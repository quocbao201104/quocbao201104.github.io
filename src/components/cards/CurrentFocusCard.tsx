import { Target } from 'lucide-react';
import { CardShell } from './CardShell';

export function CurrentFocusCard() {
  const progress = 68;
  return (
    <CardShell eyebrow="Current Focus" icon={Target} iconTone="purple">
      <h3 className="text-[15px] font-semibold text-ink-bright leading-tight">
        GraphRAG Research
      </h3>
      <p className="text-[13px] text-ink-muted mt-2 leading-relaxed">
        Improving retrieval quality in complex knowledge graphs.
      </p>

      <div className="mt-auto pt-5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-2xs">
          <span className="font-mono uppercase tracking-wider2 text-ink-dim">
            Progress
          </span>
          <span className="font-mono text-ink-bright">{progress}%</span>
        </div>
        <div className="relative h-1 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full
              bg-gradient-to-r from-accent-purple-deep via-accent-purple to-accent-cyan
              shadow-[0_0_12px_0_rgba(168,85,247,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </CardShell>
  );
}
