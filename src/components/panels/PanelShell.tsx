import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PanelShellProps {
  title: string;
  link?: { label: string; href?: string; onClick?: () => void };
  className?: string;
  children: ReactNode;
}

export function PanelShell({ title, link, className, children }: PanelShellProps) {
  return (
    <section
      className={cn(
        'panel-soft rounded-xl px-5 py-5 lg:px-6 lg:py-6 flex flex-col gap-4',
        'transition-colors duration-300 hover:border-white/[0.06]',
        className,
      )}
    >
      <header className="flex items-center justify-between">
        <h3 className="text-2xs font-mono uppercase tracking-wider2 text-ink-bright/90">
          {title}
        </h3>
      </header>

      <div className="flex flex-col gap-3">{children}</div>

      {link && (
        <button
          type="button"
          onClick={link.onClick}
          className="group mt-1 inline-flex items-center gap-1.5 self-start text-2xs font-mono
            text-accent-purple-soft/80 hover:text-accent-purple transition-colors duration-300"
        >
          {link.label}
          <ArrowRight
            size={11}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </button>
      )}
    </section>
  );
}
