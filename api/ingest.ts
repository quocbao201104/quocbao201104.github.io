import { corsHeaders, handleCors } from './_cors';
import { createClient } from '@supabase/supabase-js';

type IngestReq = {
  files: { path: string; content: string }[];
};

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const ALLOWED_TYPES = new Set(['profile', 'project', 'research', 'experiment', 'note', 'timeline']);

async function openaiFetch(path: string, init: RequestInit) {
  const base = getEnv('LLM_BASE_URL');
  const url = base.replace(/\/$/, '') + path;
  return fetch(url, init);
}

async function embedBatch(texts: string[]) {
  const model = process.env.EMBED_MODEL ?? 'text-embedding-3-small';
  const r = await openaiFetch('/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getEnv('LLM_API_KEY')}`,
    },
    body: JSON.stringify({ model, input: texts }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Embeddings error: ${r.status} ${t}`);
  }
  const j = await r.json();
  const data = j?.data;
  if (!Array.isArray(data)) throw new Error('Embeddings response missing data');
  return data.map((d: any) => d.embedding) as number[][];
}

function chunkText(text: string, maxChars = 1100, overlap = 180) {
  const t = text.replace(/\r\n/g, '\n');
  const chunks: string[] = [];
  let i = 0;
  while (i < t.length) {
    const end = Math.min(t.length, i + maxChars);
    const slice = t.slice(i, end);
    chunks.push(slice.trim());
    if (end >= t.length) break;
    i = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
}

type Frontmatter = {
  title?: string;
  type?: string;
  subtype?: string;
  status?: string;
  tags?: string[];
  aliases?: string[];
  source_url?: string;
  updated?: string;
  contains_pii?: boolean;
};

function parseListValue(raw: string): string[] {
  const s = raw.trim();
  if (!s) return [];
  // [a, b] style
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  // comma-separated
  return s
    .split(',')
    .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function parseFrontmatter(text: string): { meta: Frontmatter; body: string } {
  const t = text.replace(/\r\n/g, '\n');
  if (!t.startsWith('---\n')) return { meta: {}, body: t };
  const end = t.indexOf('\n---\n', 4);
  if (end === -1) return { meta: {}, body: t };
  const raw = t.slice(4, end).trim();
  const body = t.slice(end + '\n---\n'.length);
  const meta: Frontmatter = {};

  const lines = raw.split('\n');
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith('#')) continue;
    const idx = l.indexOf(':');
    if (idx === -1) continue;
    const key = l.slice(0, idx).trim();
    const valueRaw = l.slice(idx + 1).trim();
    const value = valueRaw.replace(/^['"]|['"]$/g, '');

    if (key === 'tags' || key === 'aliases') {
      (meta as any)[key] = parseListValue(valueRaw);
      continue;
    }
    if (key === 'contains_pii') {
      meta.contains_pii = valueRaw.trim().toLowerCase() === 'true';
      continue;
    }
    (meta as any)[key] = value;
  }

  if (meta.type && !ALLOWED_TYPES.has(meta.type)) meta.type = undefined;
  return { meta, body };
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // Simple shared secret to prevent public ingest
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token || token !== getEnv('INGEST_TOKEN')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders(req.headers.get('origin')) });
    }

    const body = (await req.json()) as IngestReq;
    const files = body?.files ?? [];
    if (!Array.isArray(files) || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    // Flatten chunks
    const rows: {
      path: string;
      chunk_index: number;
      content: string;
      embedding: number[];
      title?: string;
      type?: string;
      subtype?: string;
      status?: string;
      tags?: string[];
      aliases?: string[];
      source_url?: string;
      updated?: string;
      contains_pii?: boolean;
    }[] = [];

    for (const f of files) {
      const { meta, body } = parseFrontmatter(f.content);
      const chunks = chunkText(body);
      const embeddings = await embedBatch(chunks);
      chunks.forEach((c, idx) => {
        rows.push({
          path: f.path,
          chunk_index: idx,
          content: c,
          embedding: embeddings[idx]!,
          title: meta.title,
          type: meta.type,
          subtype: meta.subtype,
          status: meta.status,
          tags: meta.tags,
          aliases: meta.aliases,
          source_url: meta.source_url,
          updated: meta.updated,
          contains_pii: meta.contains_pii ?? false,
        });
      });
    }

    // Upsert into a `chunks` table with a unique key (path, chunk_index)
    const { error } = await supabase
      .from('chunks')
      .upsert(rows, { onConflict: 'path,chunk_index' });

    if (error) throw new Error(`Supabase upsert error: ${error.message}`);

    return new Response(JSON.stringify({ ok: true, chunks: rows.length }), {
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
}

