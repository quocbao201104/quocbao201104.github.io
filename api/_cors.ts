export function corsHeaders(origin: string | null) {
  // If you want strict allowlisting, set ALLOWED_ORIGIN in Vercel env.
  const allow = process.env.ALLOWED_ORIGIN;
  const allowOrigin = allow ?? origin ?? '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  } as const;
}

export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
  }
  return null;
}

