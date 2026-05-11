import { corsHeaders, handleCors } from './_cors.js';
import { runChat, type Mode, type Persona } from './_chat_core.js';

export const config = {
  runtime: 'edge',
};

type ChatReq = {
  message: string;
  mode: Mode;
  sessionId?: string;
  activeView?: string;
  persona?: Persona;
};

export default async function handler(req: Request) {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
    }
    const body = (await req.json()) as ChatReq;
    const message = (body?.message ?? '').trim();
    const mode = body?.mode ?? 'llm';
    const persona = body?.persona ?? 'bao';
    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }
    const { answer, hits } = await runChat({ message, mode, persona });
    return new Response(
      JSON.stringify({
        answer,
        hits,
      }),
      { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}

