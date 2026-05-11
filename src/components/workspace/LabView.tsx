import { useMemo, useState } from 'react';
import { postJson } from '../../lib/apiClient';

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

type SearchRes = { hits: SearchHit[] };

function fmtSimilarity(sim: number | null) {
  if (sim == null || !Number.isFinite(sim)) return '—';
  const pct = Math.max(0, Math.min(100, Math.round(sim * 1000) / 10));
  return `${pct}%`;
}

function firstNonEmpty(...xs: Array<string | null | undefined>) {
  for (const x of xs) {
    const s = (x ?? '').trim();
    if (s) return s;
  }
  return '';
}

function hasAnyRedaction(r: Redactions | null | undefined) {
  if (!r) return false;
  return Boolean(r.email || r.phone || r.localPath || r.repoLink || r.privateHint);
}

export function LabView() {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(6);
  const [allowPii, setAllowPii] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hits, setHits] = useState<SearchHit[] | null>(null);

  const examples = useMemo(
    () => [
      'bao.os memory architecture',
      'cheapEmbed dimensions',
      'match_chunks rpc schema',
      'redaction rules for local paths',
      'projects: status=public',
    ],
    [],
  );

  async function runSearch() {
    const q = query.trim();
    setError(null);
    if (!q) {
      setHits([]);
      setError('Enter a query to search.');
      return;
    }

    setLoading(true);
    try {
      const res = await postJson<SearchRes>('/api/search', { query: q, topK, allowPii });
      setHits(res?.hits ?? []);
    } catch (e: unknown) {
      setHits(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function copySnippet(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <div className="panel-soft rounded-2xl p-6 sm:p-8 border border-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="label-eyebrow">Lab</span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-bright">
            RAG Inspector
          </h2>
          <p className="mt-2 text-[13px] text-ink-muted/90 leading-relaxed font-mono">
            {'// inspect retrieval and redaction'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-ink-muted/90">Query</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) runSearch();
            }}
            placeholder="Search your memory index…"
            className="w-full rounded-xl px-3 py-2 bg-black/20 border border-white/[0.07] text-ink-bright placeholder:text-ink-muted/60 outline-none focus:border-white/[0.18]"
          />
          <div className="text-[11px] text-ink-muted/70">
            Press Enter to search. Use Ctrl/Cmd+Enter if you prefer.
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-ink-muted/90">Top-K</label>
          <select
            value={String(topK)}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="rounded-xl px-3 py-2 bg-black/20 border border-white/[0.07] text-ink-bright outline-none focus:border-white/[0.18]"
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 select-none rounded-xl px-3 py-2 bg-black/20 border border-white/[0.07] text-ink-bright">
            <input
              type="checkbox"
              checked={allowPii}
              onChange={(e) => setAllowPii(e.target.checked)}
              className="accent-white"
            />
            <span className="text-[13px]">Allow PII</span>
          </label>
        </div>

        <div className="flex items-end">
          <button
            onClick={runSearch}
            disabled={loading}
            className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-60 disabled:hover:bg-white/10 border border-white/[0.08] text-ink-bright"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      ) : null}

      {hits === null ? (
        <div className="mt-7 rounded-2xl border border-white/[0.06] bg-black/10 p-5">
          <div className="text-[13px] text-ink-muted/90 leading-relaxed">
            Search your indexed memory and inspect what would be retrieved, what gets redacted, and
            why.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex);
                  setTimeout(() => runSearch(), 0);
                }}
                className="text-[12px] font-mono rounded-full px-3 py-1 border border-white/[0.08] bg-black/20 hover:bg-black/30 text-ink-muted/90"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : hits.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-white/[0.06] bg-black/10 p-5 text-[13px] text-ink-muted/90">
          No hits. Try a broader query.
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-4">
          {hits.map((h) => {
            const title = firstNonEmpty(h.title, h.source, h.id);
            const pii = Boolean(h.contains_pii);
            const hasRedactions = !allowPii && hasAnyRedaction(h.redactions);
            const isPublic = (h.status ?? '').toLowerCase() === 'public';

            return (
              <div key={h.id} className="panel-soft rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-[15px] font-semibold text-ink-bright">
                        {title}
                      </div>
                      <span className="text-[12px] font-mono text-ink-muted/80">
                        sim {fmtSimilarity(h.similarity)}
                      </span>
                      {pii ? (
                        <span className="text-[11px] rounded-full px-2 py-[2px] border border-amber-400/25 bg-amber-500/10 text-amber-200">
                          contains_pii
                        </span>
                      ) : null}
                      {!allowPii && hasRedactions ? (
                        <span className="text-[11px] rounded-full px-2 py-[2px] border border-cyan-400/25 bg-cyan-500/10 text-cyan-200">
                          redacted
                        </span>
                      ) : null}
                      {isPublic ? (
                        <span className="text-[11px] rounded-full px-2 py-[2px] border border-emerald-400/25 bg-emerald-500/10 text-emerald-200">
                          public
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink-muted/80">
                      {h.path ? <span className="font-mono truncate">{h.path}</span> : null}
                      {h.type ? (
                        <span className="rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20">
                          {h.type}
                          {h.subtype ? `/${h.subtype}` : ''}
                        </span>
                      ) : null}
                      {h.status ? (
                        <span className="rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20">
                          {h.status}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copySnippet(h.snippet)}
                      className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/[0.08] text-[13px] text-ink-bright"
                    >
                      Copy snippet
                    </button>
                  </div>
                </div>

                {!allowPii && hasRedactions ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {h.redactions.email ? (
                      <span className="text-[11px] rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20 text-ink-muted/90">
                        email
                      </span>
                    ) : null}
                    {h.redactions.phone ? (
                      <span className="text-[11px] rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20 text-ink-muted/90">
                        phone
                      </span>
                    ) : null}
                    {h.redactions.localPath ? (
                      <span className="text-[11px] rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20 text-ink-muted/90">
                        localPath
                      </span>
                    ) : null}
                    {h.redactions.repoLink ? (
                      <span className="text-[11px] rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20 text-ink-muted/90">
                        repoLink
                      </span>
                    ) : null}
                    {h.redactions.privateHint ? (
                      <span className="text-[11px] rounded-full px-2 py-[2px] border border-white/[0.08] bg-black/20 text-ink-muted/90">
                        privateHint
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-[12.5px] leading-relaxed text-ink-muted/90">
                  {h.snippet}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

