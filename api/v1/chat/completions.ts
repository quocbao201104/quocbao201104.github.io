import { corsHeaders, handleCors } from '../../_cors.js';
import { runChat, type Mode, type Persona } from '../../_chat_core.js';

export const config = {
  runtime: 'edge',
};

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
};

type OpenAIChatReq = {
  model?: string;
  messages?: OpenAIMessage[];
  stream?: boolean;
  // Accept extra fields but ignore
  [k: string]: any;
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

function inferMode(model?: string): Mode {
  const m = (model ?? '').toLowerCase();
  if (m.includes('rag')) return 'rag';
  return 'llm';
}

function inferPersona(sys?: string): Persona {
  const s = (sys ?? '').toLowerCase();
  if (s.includes('recruiter')) return 'recruiter';
  if (s.includes('architect')) return 'architect';
  if (s.includes('memory')) return 'memory';
  return 'bao';
}

function pickSystem(messages: OpenAIMessage[] | undefined) {
  const sys = (messages ?? []).findLast?.((m) => m.role === 'system') ?? (messages ?? []).find((m) => m.role === 'system');
  return (sys?.content ?? '').trim();
}

function pickLastUser(messages: OpenAIMessage[] | undefined) {
  const arr = messages ?? [];
  for (let i = arr.length - 1; i >= 0; i--) {
    const m = arr[i]!;
    if (m.role === 'user') return (m.content ?? '').trim();
  }
  return '';
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  const auth = maybeAuth(req);
  if (auth) return auth;

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders(req.headers.get('origin')),
      });
    }

    const body = (await req.json()) as OpenAIChatReq;
    if (body?.stream) {
      return new Response(
        JSON.stringify({
          error: { message: 'stream=true is not supported by this endpoint yet' },
        }),
        {
          status: 400,
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        },
      );
    }

    const system = pickSystem(body.messages);
    const message = pickLastUser(body.messages);
    if (!message) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing user message' },
        }),
        {
          status: 400,
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        },
      );
    }

    const mode = inferMode(body.model);
    const persona = inferPersona(system);

    const { answer } = await runChat({ message, mode, persona });

    const now = Math.floor(Date.now() / 1000);
    const model = body?.model ?? process.env.LLM_MODEL ?? 'mimo-v2.5-pro';

    return new Response(
      JSON.stringify({
        id: `chatcmpl_${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
        object: 'chat.completion',
        created: now,
        model,
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: answer },
            finish_reason: 'stop',
          },
        ],
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: { message: e?.message ?? 'Unknown error' } }), {
      status: 500,
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
}

import { corsHeaders, handleCors } from '../../_cors.js';
import { runChat, type Mode, type Persona } from '../../_chat_core.js';

export const config = {
  runtime: 'edge',
};

type OpenAIChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | Array<{ type: string; text?: string }>;
};

type OpenAIChatCompletionsRequest = {
  model?: string;
  messages?: OpenAIChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

function parseContent(content: OpenAIChatMessage['content']): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((p) => (p && typeof p === 'object' && 'text' in p ? (p as any).text : ''))
    .filter(Boolean)
    .join('\n');
}

function pickMode(model: string | undefined): Mode {
  const m = (model ?? '').toLowerCase();
  if (m.includes('rag')) return 'rag';
  return 'llm';
}

function pickPersona(model: string | undefined): Persona {
  const m = (model ?? '').toLowerCase();
  if (m.includes('recruiter')) return 'recruiter';
  if (m.includes('architect')) return 'architect';
  if (m.includes('memory')) return 'memory';
  return 'bao';
}

function requireCompatAuth(req: Request) {
  const expected = process.env.OPENAI_COMPAT_TOKEN;
  if (!expected) return null;
  const got = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!got || got !== expected) return new Response('Unauthorized', { status: 401, headers: corsHeaders(req.headers.get('origin')) });
  return null;
}

function getTranscriptMessage(messages: OpenAIChatMessage[]): string {
  const nonSystem = messages.filter((m) => m && m.role !== 'system');
  if (nonSystem.length === 0) return '';
  const tail = nonSystem.slice(-8);
  return tail
    .map((m) => {
      const c = parseContent(m.content);
      if (!c) return '';
      const role = m.role === 'assistant' ? 'Assistant' : m.role === 'user' ? 'User' : m.role;
      return `${role}: ${c}`;
    })
    .filter(Boolean)
    .join('\n');
}

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  const authErr = requireCompatAuth(req);
  if (authErr) return authErr;

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(req.headers.get('origin')) });
    }

    const body = (await req.json()) as OpenAIChatCompletionsRequest;
    if (body?.stream) {
      return new Response(JSON.stringify({ error: { message: 'stream not supported', type: 'invalid_request_error' } }), {
        status: 400,
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      });
    }

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const prompt = getTranscriptMessage(messages).trim();
    if (!prompt) {
      return new Response(JSON.stringify({ error: { message: 'Missing messages', type: 'invalid_request_error' } }), {
        status: 400,
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
      });
    }

    const requestedModel = body?.model ?? 'bao-os-rag';
    const mode = pickMode(requestedModel);
    const persona = pickPersona(requestedModel);

    const { answer } = await runChat({ message: prompt, mode, persona });

    const id = `chatcmpl_${crypto.randomUUID().replace(/-/g, '')}`;
    const created = Math.floor(Date.now() / 1000);

    return new Response(
      JSON.stringify({
        id,
        object: 'chat.completion',
        created,
        model: requestedModel,
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: answer },
            finish_reason: 'stop',
          },
        ],
      }),
      { headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: { message: e?.message ?? 'Unknown error', type: 'server_error' } }), {
      status: 500,
      headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
    });
  }
}

