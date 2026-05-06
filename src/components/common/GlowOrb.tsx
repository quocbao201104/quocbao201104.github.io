import { cn } from '@/lib/cn';

interface GlowOrbProps {
  className?: string;
  color?: 'purple' | 'cyan';
  size?: number;
}

export function GlowOrb({ className, color = 'purple', size = 600 }: GlowOrbProps) {
  const fill =
    color === 'purple'
      ? 'rgba(168,85,247,0.20)'
      : 'rgba(103,232,249,0.14)';

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute -z-10 rounded-full blur-3xl', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${fill} 0%, transparent 65%)`,
      }}
    />
  );
}
