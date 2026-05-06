import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { springSnappy } from '@/lib/motion';

interface CardShellProps {
  eyebrow: string;
  icon: LucideIcon;
  iconTone?: 'purple' | 'cyan' | 'ok' | 'warn';
  className?: string;
  children: ReactNode;
}

const iconColors = {
  purple: 'text-accent-purple',
  cyan: 'text-accent-cyan',
  ok: 'text-status-ok',
  warn: 'text-status-warn',
};

const iconRingTones = {
  purple: 'border-accent-purple/25 bg-accent-purple/[0.08]',
  cyan: 'border-accent-cyan/25 bg-accent-cyan/[0.08]',
  ok: 'border-status-ok/25 bg-status-ok/[0.08]',
  warn: 'border-status-warn/25 bg-status-warn/[0.08]',
};

export function CardShell({
  eyebrow,
  icon: Icon,
  iconTone = 'purple',
  className,
  children,
}: CardShellProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={springSnappy}
      className={cn(
        'group relative panel-soft p-5 lg:p-6 flex flex-col gap-4 overflow-hidden',
        'transition-[border-color,box-shadow] duration-500 ease-out',
        'hover:border-accent-purple/20',
        'hover:shadow-[0_8px_30px_-12px_rgba(168,85,247,0.25)]',
        className,
      )}
    >
      {/* Hover sheen — tones way down */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 right-0 h-px
          bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <header className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center rounded-md border',
            iconRingTones[iconTone],
          )}
        >
          <Icon size={11} className={iconColors[iconTone]} />
        </span>
        <span className="label-eyebrow text-ink-bright/70">{eyebrow}</span>
      </header>

      <div className="flex flex-col flex-1">{children}</div>
    </motion.article>
  );
}
