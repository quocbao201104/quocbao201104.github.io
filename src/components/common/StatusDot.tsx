import { cn } from '@/lib/cn';

type Tone = 'ok' | 'warn' | 'err' | 'cyan' | 'purple' | 'muted';

const toneClasses: Record<Tone, { dot: string; ring: string }> = {
  ok: { dot: 'bg-status-ok', ring: 'shadow-[0_0_10px_0_rgba(52,211,153,0.6)]' },
  warn: { dot: 'bg-status-warn', ring: 'shadow-[0_0_10px_0_rgba(251,191,36,0.6)]' },
  err: { dot: 'bg-status-err', ring: 'shadow-[0_0_10px_0_rgba(248,113,113,0.6)]' },
  cyan: { dot: 'bg-accent-cyan', ring: 'shadow-[0_0_10px_0_rgba(103,232,249,0.6)]' },
  purple: { dot: 'bg-accent-purple', ring: 'shadow-[0_0_10px_0_rgba(168,85,247,0.6)]' },
  muted: { dot: 'bg-ink-faint', ring: '' },
};

interface StatusDotProps {
  tone?: Tone;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusDot({
  tone = 'ok',
  size = 'sm',
  className,
}: StatusDotProps) {
  const c = toneClasses[tone];
  const dim = size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5';
  return (
    <span
      aria-hidden
      className={cn('relative inline-flex', dim, className)}
    >
      {/* No continuous pulse animation (perf). */}
      <span className={cn('relative rounded-full', dim, c.dot, c.ring)} />
    </span>
  );
}
