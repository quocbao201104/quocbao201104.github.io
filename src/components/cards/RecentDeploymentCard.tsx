import { Rocket } from 'lucide-react';
import { CardShell } from './CardShell';
import { StatusDot } from '@/components/common/StatusDot';

export function RecentDeploymentCard() {
  const series = [3, 4, 6, 5, 7, 9, 8, 11, 10, 13, 12, 15];
  return (
    <CardShell eyebrow="Recent Deployment" icon={Rocket} iconTone="cyan">
      <h3 className="text-[15px] font-semibold text-ink-bright leading-tight">
        OrgMind API
      </h3>
      <p className="text-[12px] font-mono text-ink-muted mt-1.5">
        Deployed 2h ago
      </p>

      <div className="mt-auto pt-5 flex items-end justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
          border border-status-ok/25 bg-status-ok/[0.08] text-2xs font-mono text-status-ok/95">
          <StatusDot tone="ok" />
          Production
        </span>
        <MiniLine data={series} />
      </div>
    </CardShell>
  );
}

function MiniLine({ data }: { data: number[] }) {
  const w = 90;
  const h = 26;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} className="shrink-0 opacity-90">
      <defs>
        <linearGradient id="depFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(103,232,249,0.4)" />
          <stop offset="100%" stopColor="rgba(103,232,249,0)" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#depFill)" />
      <polyline
        points={points}
        fill="none"
        stroke="#67e8f9"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
