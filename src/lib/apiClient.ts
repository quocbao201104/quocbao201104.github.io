const LEGACY_API_BASE_URL = 'https://bao-os-api.vercel.app';

type AttemptFailure = {
  url: string;
  status?: number;
  body?: string;
  error?: string;
};

export function getApiBaseUrl() {
  // Prefer same-origin `/api/*` by default so Vercel/Netlify deployments
  // with serverless functions "just work" without extra config.
  //
  // For truly static hosting (e.g. GitHub Pages), set `VITE_API_BASE_URL`
  // to your API deployment, e.g. https://bao-os-api.vercel.app
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL?.trim?.();
  return envUrl ? envUrl.replace(/\/+$/, '') : '';
}

export async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const configuredBase = getApiBaseUrl();
  const primaryUrl = configuredBase ? joinUrl(configuredBase, path) : normalizeApiPath(path);
  const failures: AttemptFailure[] = [];

  const primary = await requestJson<T>(primaryUrl, body, signal);
  if (primary.ok) return primary.data;

  failures.push(primary.failure);

  if (!configuredBase && shouldRetryLegacyApi(primary.failure, path)) {
    const legacyUrl = joinUrl(LEGACY_API_BASE_URL, normalizeApiPath(path));
    const fallback = await requestJson<T>(legacyUrl, body, signal);
    if (fallback.ok) return fallback.data;
    failures.push(fallback.failure);
  }

  throw new Error(formatApiError(failures, configuredBase));
}

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function normalizeApiPath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function shouldRetryLegacyApi(failure: AttemptFailure, path: string) {
  if (!normalizeApiPath(path).startsWith('/api/')) return false;
  if (failure.status === 404 || failure.status === 405) return true;
  return isHtmlBody(failure.body);
}

async function requestJson<T>(url: string, body: unknown, signal?: AbortSignal): Promise<{ ok: true; data: T } | { ok: false; failure: AttemptFailure }> {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });

    const contentType = r.headers.get('content-type') ?? '';
    const text = await safeText(r);
    const bodyText = truncateOneLine(text, 300);

    if (!r.ok) {
      return {
        ok: false,
        failure: {
          url,
          status: r.status,
          body: bodyText,
        },
      };
    }

    if (contentType.includes('text/html') || isHtmlBody(bodyText)) {
      return {
        ok: false,
        failure: {
          url,
          status: r.status,
          body: bodyText,
        },
      };
    }

    return { ok: true, data: JSON.parse(text) as T };
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, failure: { url, error: msg } };
  }
}

function formatApiError(failures: AttemptFailure[], configuredBase: string) {
  const networkOnly = failures.every((failure) => failure.error && failure.status === undefined);
  const lines = [networkOnly ? 'Network error while calling API' : 'API request failed'];

  failures.forEach((failure, index) => {
    lines.push(`- attempt ${index + 1}: ${failure.url}`);
    if (failure.status !== undefined) lines.push(`  status: ${failure.status}`);
    if (failure.body) lines.push(`  body: ${failure.body}`);
    if (failure.error) lines.push(`  error: ${failure.error}`);
  });

  if (!configuredBase) {
    lines.push(`- hint: set VITE_API_BASE_URL if hosting is static (no /api functions)`);
  }

  return lines.join('\n');
}

function isHtmlBody(body?: string) {
  return Boolean(body && /<\/?(?:!doctype\s+html|html|body)\b/i.test(body));
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

