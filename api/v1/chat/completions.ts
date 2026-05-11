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
  [k: string]: any;
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
  if (!got || got !== expected) {
    return new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
      status: 401,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
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
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
    }

    const body = (await req.json()) as OpenAIChatCompletionsRequest;
    if (body?.stream) {
      return new Response(JSON.stringify({ error: { message: 'stream not supported', type: 'invalid_request_error' } }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const prompt = getTranscriptMessage(messages).trim();
    if (!prompt) {
      return new Response(JSON.stringify({ error: { message: 'Missing messages', type: 'invalid_request_error' } }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    const requestedModel = body?.model ?? 'bao-os-rag';
    const mode = pickMode(requestedModel);
    const persona = pickPersona(requestedModel);

    const { answer } = await runChat({ message: prompt, mode, persona });

    const uuid = (crypto as any).randomUUID?.() ?? Math.random().toString(16).slice(2);
    const id = `chatcmpl_${String(uuid).replace(/-/g, '')}`;
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
      { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: { message: e?.message ?? 'Unknown error', type: 'server_error' } }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}

