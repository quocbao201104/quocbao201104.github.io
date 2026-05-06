import { Home, FolderGit2, Bot, FlaskConical, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUIStore, type SectionId } from '@/stores/uiStore';

interface NavItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  available: boolean;
}

const items: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, available: true },
  { id: 'projects', label: 'Projects', icon: FolderGit2, available: true },
  { id: 'agents', label: 'Agents', icon: Bot, available: true },
  { id: 'lab', label: 'Lab', icon: FlaskConical, available: true },
  { id: 'memory', label: 'Memory', icon: Brain, available: true },
];

export function NavSection() {
  const active = useUIStore((s) => s.activeSection);
  const openTab = useUIStore((s) => s.openTab);

  const handleClick = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    openTab(id);
  };

  return (
    <nav className="flex flex-col gap-0.5">
      <div className="label-eyebrow px-3 mb-3">Navigation</div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <a
            key={item.id}
            href="#"
            onClick={handleClick(item.id)}
            className={cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2',
              'text-sm transition-all duration-200',
              isActive
                ? 'text-ink-bright bg-white/[0.04] border border-line-strong'
                : 'text-ink-muted hover:text-ink-bright hover:bg-white/[0.02] border border-transparent',
            )}
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r bg-accent-purple shadow-[0_0_10px_0_rgba(168,85,247,0.7)]"
              />
            )}
            <Icon
              size={16}
              className={cn(
                'transition-colors',
                isActive ? 'text-accent-purple' : 'text-ink-dim group-hover:text-ink-muted',
              )}
            />
            <span className="font-medium">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
