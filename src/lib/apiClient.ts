export function getApiBaseUrl() {
  // Prefer same-origin `/api/*` by default so Vercel/Netlify deployments
  // with serverless functions "just work" without extra config.
  //
  // For truly static hosting (e.g. GitHub Pages), set `VITE_API_BASE_URL`
  // to your API deployment, e.g. https://bao-os-api.vercel.app
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL?.trim?.();
  return envUrl ? envUrl.replace(/\/+$/, '') : '';
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const base = getApiBaseUrl();
  const primaryUrl = base ? joinUrl(base, path) : path;

  try {
    const r = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // If we're on a static host and `/api/*` doesn't exist, it often returns
    // an HTML 404/405. In that case, transparently retry the legacy API origin.
    if (!base && (r.status === 404 || r.status === 405)) {
      const ct = r.headers.get('content-type') ?? '';
      if (ct.includes('text/html')) {
        return await postJsonWithBase<T>('https://bao-os-api.vercel.app', path, body);
      }
    }

    if (!r.ok) {
      const t = await safeText(r);
      throw new Error(
        [
          `API request failed`,
          `- url: ${primaryUrl}`,
          `- status: ${r.status}`,
          t ? `- body: ${truncateOneLine(t, 300)}` : null,
          base ? null : `- hint: set VITE_API_BASE_URL if hosting is static (no /api functions)`,
        ]
          .filter(Boolean)
          .join('\n'),
      );
    }

    return (await r.json()) as T;
  } catch (e: any) {
    // Network errors (DNS, TLS, blocked by CORS, offline) reject fetch with a TypeError.
    const msg = e?.message ?? String(e);
    throw new Error(
      [
        `Network error while calling API`,
        `- url: ${primaryUrl}`,
        `- error: ${msg}`,
        `- hint: if this is a CORS error, ensure the API allows this site origin or use same-origin /api on Vercel`,
      ].join('\n'),
    );
  }
}

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

async function postJsonWithBase<T>(base: string, path: string, body: unknown): Promise<T> {
  const url = joinUrl(base, path);
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await safeText(r);
    throw new Error(
      [
        `API request failed`,
        `- url: ${url}`,
        `- status: ${r.status}`,
        t ? `- body: ${truncateOneLine(t, 300)}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
  return (await r.json()) as T;
}

async function safeText(r: Response) {
  try {
    return await r.text();
  } catch {
    return '';
  }
}

function truncateOneLine(s: string, max: number) {
  const one = s.replace(/\s+/g, ' ').trim();
  if (one.length <= max) return one;
  return one.slice(0, max).trimEnd() + '…';
}

