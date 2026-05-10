import { corsHeaders, handleCors } from '../_cors.js';

export const config = {
  runtime: 'edge',
};

function maybeAuth(req: Request) {
  const required = process.env.OPENAI_COMPAT_TOKEN;
  if (!required) return null;
  const got = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!got || got !== required) {
    return new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
      status: 401,
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  const auth = maybeAuth(req);
  if (auth) return auth;

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders(req.headers.get('origin')),
    });
  }

  // Minimal OpenAI-compatible models response
  const model = process.env.LLM_MODEL ?? 'mimo-v2.5-pro';
  return new Response(
    JSON.stringify({
      object: 'list',
      data: [
        {
          id: model,
          object: 'model',
          created: 0,
          owned_by: 'bao-os',
        },
        {
          id: 'bao-os-rag',
          object: 'model',
          created: 0,
          owned_by: 'bao-os',
        },
      ],
    }),
    {
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    },
  );
}

import { corsHeaders, handleCors } from '../_cors.js';

export const config = {
  runtime: 'edge',
};

function requireCompatAuth(req: Request) {
  const expected = process.env.OPENAI_COMPAT_TOKEN;
  if (!expected) return null;
  const got = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!got || got !== expected) return new Response('Unauthorized', { status: 401, headers: corsHeaders(req.headers.get('origin')) });
  return null;
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  const authErr = requireCompatAuth(req);
  if (authErr) return authErr;

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(req.headers.get('origin')) });
  }

  const created = Math.floor(Date.now() / 1000);
  return new Response(
    JSON.stringify({
      object: 'list',
      data: [
        { id: 'bao-os-rag', object: 'model', created, owned_by: 'bao-os' },
        { id: 'bao-os-llm', object: 'model', created, owned_by: 'bao-os' },
        { id: 'bao-os-recruiter', object: 'model', created, owned_by: 'bao-os' },
        { id: 'bao-os-architect', object: 'model', created, owned_by: 'bao-os' },
        { id: 'bao-os-memory', object: 'model', created, owned_by: 'bao-os' },
      ],
    }),
    { headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' } },
  );
}

