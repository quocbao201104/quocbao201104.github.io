export function getApiBaseUrl() {
  // For GitHub Pages, set VITE_API_BASE_URL to your Vercel deployment, e.g. https://bao-os-api.vercel.app
  // In local dev, you can omit it and use Vercel dev proxy separately.
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;

  // Safe default for static hosting (GitHub Pages / custom domain).
  // Prevents hitting the static host /api/* which returns 405 HTML.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    if (!isLocal) return 'https://bao-os-api.vercel.app';
  }

  return '';
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const base = getApiBaseUrl();
  const url = base ? `${base}${path}` : path;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`API ${r.status}: ${t}`);
  }
  return (await r.json()) as T;
}

