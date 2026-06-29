import { createClient } from '@supabase/supabase-js';
import type { AgentTraceStep, ConsoleMode, ConsoleResponse, SourceChunk } from '../src/types/console.js';

export type Mode = ConsoleMode;
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
  command: string;
  userInput: string;
  message: string;
  mode: Mode;
  persona: Persona;
  intent?: string;
  topK?: number;
};

export type RunChatResult = ConsoleResponse;

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
  // Only genuine "how do I reach you" intents unlock PII (email/phone).
  // Deliberately narrow: ambiguous tokens like 'mail', 'number', or a bare '@'
  // must NOT open redaction (e.g. "what's the version number?" stays redacted).
  // English + Vietnamese (accented and unaccented) contact terms.
  return (
    m.includes('contact') ||
    m.includes('email') ||
    m.includes('e-mail') ||
    m.includes('gmail') ||
    m.includes('phone') ||
    m.includes('telegram') ||
    m.includes('zalo') ||
    m.includes('liên hệ') ||
    m.includes('lien he') ||
    m.includes('số điện thoại') ||
    m.includes('so dien thoai')
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
  // Conservative: hide repo-host URLs unless explicitly marked public via metadata (handled upstream).
  return text.replace(
    /https?:\/\/(?:github\.com|gitlab\.com|bitbucket\.org)\/[^\s)]+/gi,
    '[redacted-repo-link]',
  );
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

// cheapEmbed is bag-of-words, so off-topic queries still pull back low-similarity
// junk. Drop hits below this floor. Hits with a missing similarity field are kept
// (we don't penalize chunks the RPC didn't score).
//
// Assumes match_chunks returns cosine similarity in [0,1] (higher = better). If the
// RPC is ever changed to return a distance metric, this floor must be re-tuned — set
// RAG_MIN_SIMILARITY to override without a code change.
function getMinSimilarity() {
  const raw = process.env.RAG_MIN_SIMILARITY;
  if (raw === undefined) return 0.2;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0.2;
}

function applyRedaction(content: string, isPublic: boolean, allowPii: boolean) {
  // Email/phone are the only things a contact intent may unlock.
  const piiSafe = allowPii ? content : redactSensitive(content);
  // Local paths and private-repo links/hints are ALWAYS redacted, regardless of
  // intent — they are never something a chat reply should leak. Repo links are
  // only kept when the chunk is explicitly marked public via metadata.
  const safe = stripPrivateRepoHints(redactLocalPaths(piiSafe));
  return redactPrivateRepoLinks(safe, isPublic);
}

async function retrieve(query: string, allowPii: boolean, topK = 6): Promise<ChunkHit[]> {
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
    match_count: topK,
    allow_pii: allowPii,
  });
  if (error) throw new Error(`Supabase rpc match_chunks error: ${error.message}`);
  const rawHits = (data ?? []) as ChunkHit[];

  // Filter out low-similarity noise. Keep hits without a similarity score.
  const minSimilarity = getMinSimilarity();
  const hits = rawHits.filter(
    (h) => typeof h.similarity !== 'number' || h.similarity >= minSimilarity,
  );

  // Server-side enforcement outside prompt: even if ingest/frontmatter is wrong,
  // we prevent sensitive info from entering normal context. Redaction is layered —
  // a contact intent only relaxes email/phone, never local paths or repo links.
  return hits.map((h) => {
    const status = (h.status ?? '').toLowerCase();
    const isPublic = status === 'public';
    return {
      ...h,
      content: applyRedaction(h.content, isPublic, allowPii),
    };
  });
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

  if (mode === 'llm') return [base, ...personaRules].join('\n');

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

function toSourceChunks(hits: ChunkHit[], allowPii: boolean): SourceChunk[] {
  return hits.map((h) => {
    const tags = [h.type, h.subtype].filter(Boolean) as string[];
    const content = compactContext(h.content, 360);
    const healthWarnings: string[] = [];
    if (h.contains_pii) healthWarnings.push('contains_pii_flagged');
    // Redaction now runs even under a contact intent (local paths / repo links
    // are always stripped), so flag it whenever the marker is present.
    if (content.includes('[redacted') || (!allowPii && h.contains_pii)) {
      healthWarnings.push('redaction_applied');
    }

    const source: SourceChunk = {
      id: h.id,
      title: h.title ?? h.source ?? h.id,
      path: h.path ?? h.source ?? undefined,
      content,
      similarity: typeof h.similarity === 'number' ? h.similarity : undefined,
      tags: tags.length > 0 ? tags : undefined,
      containsPii: h.contains_pii ?? undefined,
      healthWarnings: healthWarnings.length > 0 ? healthWarnings : undefined,
    };
    if (!allowPii && h.contains_pii) {
      source.redactedContent = content;
    }
    return source;
  });
}

function estimateConfidence(mode: Mode, hits: ChunkHit[], answer: string) {
  if (!answer.trim()) return 0.2;
  if (mode === 'llm') return 0.7;
  if (hits.length === 0) return 0.45;

  // Base confidence on retrieval quality, not raw count: 6 weakly-matching
  // chunks should not read as high confidence. Use the strongest hit, blended
  // with the mean so a single lucky match doesn't dominate.
  const scores = hits
    .map((h) => h.similarity)
    .filter((s): s is number => typeof s === 'number');
  if (scores.length === 0) return 0.55;

  const max = Math.max(...scores);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const quality = 0.6 * max + 0.4 * mean;
  return Math.max(0.3, Math.min(0.95, 0.3 + quality * 0.65));
}

function toErrorMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

const RETRIEVAL_UNAVAILABLE_DETAIL = 'retrieval unavailable; answering without memory context';

export async function runChat(input: RunChatInput): Promise<RunChatResult> {
  const message = input.message.trim();
  if (!message) throw new Error('Missing message');

  const mode = input.mode;
  const persona = input.persona;
  const command = (input.command ?? mode).trim() || mode;
  const userInput = (input.userInput ?? message).trim() || message;
  const topK = Math.max(1, Math.min(20, input.topK ?? 6));
  const intent = input.intent;

  const allowPii = isContactIntent(message);
  const trace: AgentTraceStep[] = [];
  const shouldRetrieve = mode === 'rag' || mode === 'agentic_rag';
  let retrievalError: string | undefined;

  if (mode === 'agentic_rag') {
    trace.push(
      { label: 'Parse intent', status: 'completed', detail: intent ?? 'agentic_query' },
      { label: 'Route execution', status: 'completed', detail: persona },
      { label: 'Retrieve knowledge', status: 'running' },
    );
  }

  let hits: ChunkHit[] = [];
  if (shouldRetrieve) {
    try {
      hits = await retrieve(message, allowPii, topK);
    } catch (e: unknown) {
      retrievalError = toErrorMessage(e);
      console.error('Knowledge retrieval failed:', retrievalError);
    }
  }

  if (mode === 'agentic_rag') {
    trace[trace.length - 1] = {
      label: 'Retrieve knowledge',
      status: retrievalError ? 'failed' : 'completed',
      detail: retrievalError ? RETRIEVAL_UNAVAILABLE_DETAIL : `${hits.length} chunk(s)`,
    };
    trace.push({ label: 'Compose final response', status: 'running' });
  } else if (retrievalError) {
    trace.push({
      label: 'Retrieve knowledge',
      status: 'failed',
      detail: RETRIEVAL_UNAVAILABLE_DETAIL,
    });
  }

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

  let j: unknown;
  try {
    j = JSON.parse(text);
  } catch {
    throw new Error(
      `LLM returned non-JSON response (status ${r.status}): ${text.slice(0, 200)}`,
    );
  }
  const answer = (j as { choices?: { message?: { content?: string } }[] })
    ?.choices?.[0]?.message?.content ?? '';
  const sources = shouldRetrieve ? toSourceChunks(hits, allowPii) : undefined;
  const usedTools = shouldRetrieve && !retrievalError ? ['retrieve_chunks', 'llm_generate'] : ['llm_generate'];

  if (mode === 'agentic_rag') {
    trace[trace.length - 1] = { label: 'Compose final response', status: 'completed' };
  }

  return {
    mode,
    command,
    userInput,
    answer,
    sources,
    trace: trace.length > 0 ? trace : undefined,
    metadata: {
      intent,
      topK,
      model,
      usedTools,
      warnings: retrievalError ? ['retrieval_unavailable'] : undefined,
      confidence: estimateConfidence(mode, hits, answer),
    },
  };
}

