import { Github } from 'lucide-react';
import { CardShell } from './CardShell';

export function GithubActivityCard() {
  const days = [4, 7, 3, 9, 6, 12, 8];
  const max = Math.max(...days);

  return (
    <CardShell eyebrow="GitHub Activity" icon={Github} iconTone="purple">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold tracking-tight text-ink-bright leading-none">
          23
        </span>
        <span className="text-[12px] text-ink-muted">commits this week</span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-2xs font-mono">
        <span className="text-status-ok/95">+412 additions</span>
        <span className="text-status-err/85">−98 deletions</span>
      </div>

      <div className="mt-auto pt-5 flex items-end gap-1 h-[40px]">
        {days.map((v, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-accent-purple/40 to-accent-purple
              shadow-[0_0_8px_-2px_rgba(168,85,247,0.6)]"
            style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
          />
        ))}
      </div>
    </CardShell>
  );
}
