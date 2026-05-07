import { NavSection } from '@/components/sidebar/NavSection';
import { StatusDot } from '@/components/common/StatusDot';
import { Plus } from 'lucide-react';

export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-line/80 bg-bg-base/70 flex-col">
      <div className="flex flex-col gap-8 p-4 pt-6 flex-1">
        <NavSection />

        <button
          type="button"
          className="mt-2 flex items-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm
            text-ink-muted hover:text-ink-bright border border-line
            hover:border-accent-purple/30 hover:bg-white/[0.02] transition-all"
        >
          <Plus size={14} className="text-accent-purple" />
          New Conversation
        </button>
      </div>

      <TerminalStatusFooter />
    </aside>
  );
}

function TerminalStatusFooter() {
  return (
    <div className="m-4 mt-0 panel p-3 flex items-center gap-3">
      <StatusDot tone="ok" />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[12px] font-medium text-ink-bright leading-tight">
          BAO.OS Terminal
        </span>
        <span className="text-2xs text-status-ok mt-0.5">Online</span>
      </div>
      <Sparkline />
    </div>
  );
}

function Sparkline() {
  const data = [4, 6, 5, 8, 7, 10, 6, 9, 7, 11, 8, 12];
  const max = Math.max(...data);
  const w = 60;
  const h = 22;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - (v / max) * h}`)
    .join(' ');
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} className="shrink-0">
      <defs>
        <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkFill)" />
      <polyline
        points={points}
        fill="none"
        stroke="#a855f7"
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
