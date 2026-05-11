import { createClient } from '@supabase/supabase-js';

export type Mode = 'llm' | 'rag';
export type Persona = 'bao' | 'recruiter' | 'architect' | 'memory';

export type ChunkHit = {
  id: string;
  content: string;
  source?: string | null;
  title?: string | null;
  similarity?: number | null;
  path?: string | null;
  type?: string | null;
  subtype?: string | null;
  status?: string | null;
  contains_pii?: boolean | null;
};

export type RunChatInput = {
  message: string;
  mode: Mode;
  persona: Persona;
};

export type RunChatResult = {
  answer: string;
  hits: Pick<ChunkHit, 'id' | 'title' | 'source' | 'similarity'>[];
};

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

async function openaiFetch(path: string, init: RequestInit) {
  const base = getEnv('LLM_BASE_URL'); // e.g. https://bao-os-api.vercel.app/v1
  const url = base.replace(/\/$/, '') + path;
  return fetch(url, init);
}

// Xiaomi MiMo token-plan endpoint is chat-completions focused; embeddings may not be available.
// Use a lightweight, deterministic local embedding for RAG so ingestion/search don't depend on /embeddings.
const EMBED_DIMS = 1536;

function fnv1a32(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    // h *= 16777619 (with overflow)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

export function cheapEmbed(text: string): number[] {
  const v = new Array<number>(EMBED_DIMS).fill(0);
  const tokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, ' ')
    .split(/\s+/g)
    .filter(Boolean);

  for (const tok of tokens) {
    const h = fnv1a32(tok);
    const idx = h % EMBED_DIMS;
    const sign = (h & 1) === 0 ? 1 : -1;
    v[idx] += sign * Math.min(3, 1 + tok.length / 6);
  }

  let norm = 0;
  for (let i = 0; i < v.length; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < v.length; i++) v[i] = v[i] / norm;
  return v;
}

function isContactIntent(message: string) {
  const m = message.toLowerCase();
  // English + Vietnamese + common variants
  return (
    m.includes('contact') ||
    m.includes('email') ||
    m.includes('e-mail') ||
    m.includes('mail') ||
    m.includes('phone') ||
    m.includes('number') ||
    m.includes('telegram') ||
    m.includes('zalo') ||
    m.includes('liên hệ') ||
    m.includes('lien he') ||
    m.includes('số điện thoại') ||
    m.includes('so dien thoai') ||
    m.includes('gmail') ||
    m.includes('@')
  );
}

export function redactSensitive(text: string) {
  // Email
  let out = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');
  // Phone-ish (kept intentionally broad, but avoids eating long numeric sequences inside code)
  out = out.replace(
    /(?:\+?\d[\d\s().-]{7,}\d)/g,
    (m) => (m.replace(/\d/g, '').length <= 6 ? '[redacted-phone]' : m),
  );
  return out;
}

export function redactPrivateRepoLinks(text: string, allow: boolean) {
  if (allow) return text;
  // Conservative: hide GitHub repo URLs unless explicitly marked public via metadata (handled upstream).
  return text.replace(/https?:\/\/github\.com\/[^\s)]+/gi, '[redacted-repo-link]');
}

export function redactLocalPaths(text: string) {
  let out = text;
  // Windows paths: C:\Users\...
  out = out.replace(/[A-Z]:\\[^\s`]+/g, '[redacted-local-path]');
  // Common unix home paths
  out = out.replace(/\/Users\/[^\s`]+/g, '[redacted-local-path]');
  out = out.replace(/\/home\/[^\s`]+/g, '[redacted-local-path]');
  return out;
}

export function stripPrivateRepoHints(text: string) {
  // Remove lines that tend to leak private repo/local machine details.
  return text
    .split('\n')
    .filter((line) => {
      const l = line.toLowerCase();
      if (l.includes('local path:')) return false;
      if (l.includes('private repository')) return false;
      if (l.includes('private repo')) return false;
      return true;
    })
    .join('\n')
    .trim();
}

export function compactContext(text: string, maxChars: number) {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + '\n…';
}

async function retrieve(query: string, allowPii: boolean): Promise<ChunkHit[]> {
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const qvec = cheapEmbed(query);

  // Requires an RPC function in Supabase:
  //   match_chunks(query_embedding vector, match_count int, allow_pii bool)
  //     returns (id, content, source, title, similarity, path, type, subtype, status, contains_pii)
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: qvec,
    match_count: 6,
    allow_pii: allowPii,
  });
  if (error) throw new Error(`Supabase rpc match_chunks error: ${error.message}`);
  const hits = (data ?? []) as ChunkHit[];

  // Server-side enforcement outside prompt: even if ingest/frontmatter is wrong,
  // we prevent sensitive info from entering normal context.
  if (!allowPii) {
    return hits.map((h) => {
      const status = (h.status ?? '').toLowerCase();
      const isPublic = status === 'public';
      const safe = stripPrivateRepoHints(redactLocalPaths(redactSensitive(h.content)));
      return {
        ...h,
        content: redactPrivateRepoLinks(safe, isPublic),
      };
    });
  }

  return hits;
}

function buildSystemPrompt(mode: Mode, hits: ChunkHit[], persona: Persona) {
  const base =
    'You are BAO.OS — a calm, high-end AI operating system. Be concise, precise, and non-hype. Prefer bullet points and clear next steps.';

  const personaRules =
    persona === 'recruiter'
      ? [
          'Persona: Recruiter Agent.',
          '- Write like a senior recruiter / hiring manager.',
          '- Focus on positioning, strengths, evidence, and interview angles.',
          '- Keep it practical: 5–10 bullets max, then 1 suggested next step.',
        ]
      : persona === 'architect'
        ? [
            'Persona: Architect Agent.',
            '- Focus on system design: boundaries, data flow, trade-offs, failure modes.',
            '- Prefer clear structure: Overview → Components → Data flow → Risks → Next steps.',
          ]
        : persona === 'memory'
          ? [
              'Persona: Memory Agent.',
              '- Behave like a calm “second brain”: retrieve, summarize, and cite which memory items you used (by title) without quoting long passages.',
              '- If the user asks to “search”, respond with top matches first, then a short summary.',
            ]
          : [];

  if (mode !== 'rag') return [base, ...personaRules].join('\n');

  const context =
    hits.length === 0
      ? 'No memory context retrieved.'
      : `Memory context:\n${hits
          .map(
            (h, i) =>
              `[#${i + 1}] ${h.title ?? h.source ?? h.id}\n${compactContext(h.content, 700)}`.trim(),
          )
          .join('\n\n')}`;

  return [
    base,
    ...personaRules,
    'RAG rules:',
    '- Use the memory context as notes. Do NOT copy/paste it verbatim.',
    '- Synthesize in your own words. Quote at most 1 short sentence if needed.',
    '- Do not mention private repos, local file paths, or internal links unless the user explicitly asks.',
    '',
    context,
    '',
    'If context is insufficient, ask one clarifying question.',
  ].join('\n');
}

export async function runChat(input: RunChatInput): Promise<RunChatResult> {
  const message = input.message.trim();
  if (!message) throw new Error('Missing message');

  const mode = input.mode;
  const persona = input.persona;

  const allowPii = isContactIntent(message);
  const hits = mode === 'rag' ? await retrieve(message, allowPii) : [];
  const model = process.env.LLM_MODEL ?? 'mimo-v2.5-pro';

  const r = await openaiFetch('/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getEnv('LLM_API_KEY')}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: buildSystemPrompt(mode, hits, persona) },
        { role: 'user', content: message },
      ],
    }),
  });

  const text = await r.text();
  if (!r.ok) throw new Error(`LLM error ${r.status}: ${text}`);

  const j = JSON.parse(text);
  const answer = j?.choices?.[0]?.message?.content ?? '';

  return {
    answer,
    hits: hits.map((h) => ({ id: h.id, title: h.title, source: h.source, similarity: h.similarity })),
  };
}

