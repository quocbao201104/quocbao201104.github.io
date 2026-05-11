import { createClient } from '@supabase/supabase-js';
import { corsHeaders, handleCors } from './_cors.js';
import {
  cheapEmbed,
  compactContext,
  redactLocalPaths,
  redactPrivateRepoLinks,
  redactSensitive,
  stripPrivateRepoHints,
  type ChunkHit,
} from './_chat_core.js';

export const config = {
  runtime: 'edge',
};

type SearchReq = {
  query: string;
  topK?: number;
  allowPii?: boolean;
};

type Redactions = {
  email: boolean;
  phone: boolean;
  localPath: boolean;
  repoLink: boolean;
  privateHint: boolean;
};

type SearchHit = {
  id: string;
  title: string | null;
  source: string | null;
  path: string | null;
  type: string | null;
  subtype: string | null;
  status: string | null;
  similarity: number | null;
  contains_pii: boolean | null;
  snippet: string;
  redactions: Redactions;
};

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function detectRedactions(original: string, redacted: string): Redactions {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(original) || redacted.includes('[redacted-email]');
  const phone =
    /(?:\+?\d[\d\s().-]{7,}\d)/.test(original) ||
    redacted.includes('[redacted-phone]');
  const localPath =
    (/[A-Z]:\\[^\s`]+/.test(original) || /\/Users\/[^\s`]+/.test(original) || /\/home\/[^\s`]+/.test(original)) &&
    redacted.includes('[redacted-local-path]');
  const repoLink = /https?:\/\/github\.com\/[^\s)]+/i.test(original) || redacted.includes('[redacted-repo-link]');
  const privateHint =
    /\bprivate repository\b/i.test(original) ||
    /\bprivate repo\b/i.test(original) ||
    /^\s*local path:\s*/gim.test(original) ||
    original !== stripPrivateRepoHints(original);

  return { email, phone, localPath, repoLink, privateHint };
}

function compactSnippet(text: string) {
  // Keep UI-friendly: collapse huge whitespace, preserve newlines.
  const t = text.replace(/[ \t]+\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim();
  return compactContext(t, 560);
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(req.headers.get('origin')) });
    }

    const body = (await req.json()) as SearchReq;
    const query = (body?.query ?? '').trim();
    const allowPii = Boolean(body?.allowPii);
    const topK = clampInt(body?.topK ?? 6, 1, 20);

    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), {
        status: 400,
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    });

    const qvec = cheapEmbed(query);
    const { data, error } = await supabase.rpc('match_chunks', {
      query_embedding: qvec,
      match_count: topK,
      allow_pii: allowPii,
    });
    if (error) throw new Error(`Supabase rpc match_chunks error: ${error.message}`);

    const hits = (data ?? []) as ChunkHit[];

    const outHits: SearchHit[] = hits.map((h) => {
      const title = h.title ?? null;
      const source = h.source ?? null;
      const path = h.path ?? null;
      const type = h.type ?? null;
      const subtype = h.subtype ?? null;
      const status = h.status ?? null;
      const similarity = h.similarity ?? null;
      const contains_pii = h.contains_pii ?? null;

      if (allowPii) {
        return {
          id: h.id,
          title,
          source,
          path,
          type,
          subtype,
          status,
          similarity,
          contains_pii,
          snippet: compactSnippet(h.content ?? ''),
          redactions: { email: false, phone: false, localPath: false, repoLink: false, privateHint: false },
        };
      }

      const statusLower = (status ?? '').toLowerCase();
      const isPublic = statusLower === 'public';

      const step1 = redactSensitive(h.content ?? '');
      const step2 = redactLocalPaths(step1);
      const step3 = stripPrivateRepoHints(step2);
      const redacted = redactPrivateRepoLinks(step3, isPublic);

      return {
        id: h.id,
        title,
        source,
        path,
        type,
        subtype,
        status,
        similarity,
        contains_pii,
        snippet: compactSnippet(redacted),
        redactions: detectRedactions(h.content ?? '', redacted),
      };
    });

    return new Response(JSON.stringify({ hits: outHits }), {
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
}

