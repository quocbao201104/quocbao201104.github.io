import { Home, FolderGit2, Bot, FlaskConical, Brain, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUIStore, type SectionId } from '@/stores/uiStore';

interface NavItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'lab', label: 'Lab', icon: FlaskConical },
  { id: 'skills', label: 'Skills', icon: BarChart3 },
  { id: 'memory', label: 'Memory', icon: Brain },
];

export function NavSection() {
  const active = useUIStore((s) => s.activeSection);
  const openTab = useUIStore((s) => s.openTab);

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => openTab(item.id)}
            className={cn(
              'group relative flex items-center gap-2.5 rounded-lg px-3 py-2',
              'text-[13px] transition-all duration-200 text-left',
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
              size={15}
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-accent-purple' : 'text-ink-dim group-hover:text-ink-muted',
              )}
            />
            <span className="font-medium truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
