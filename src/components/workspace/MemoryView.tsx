export function MemoryView() {
  return (
    <div className="panel-soft rounded-2xl p-8 border border-white/[0.05]">
      <span className="label-eyebrow">Memory</span>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-bright">
        Living second brain
      </h2>
      <p className="mt-2 text-[14px] text-ink-muted/90 leading-relaxed max-w-[72ch]">
        This view will become a calm interface over long-term context: episodic logs, semantic
        recall, and graph-backed navigation. For now, use the terminal command:
        <span className="font-mono text-accent-purple-soft"> search memory &lt;query&gt;</span>.
      </p>
    </div>
  );
}

