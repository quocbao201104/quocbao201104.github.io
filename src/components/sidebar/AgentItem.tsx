import type { Agent } from '@/data/agents';
import { StatusDot } from '@/components/common/StatusDot';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';

const statusLabel: Record<Agent['status'], string> = {
  online: 'Online',
  idle: 'Idle',
  thinking: 'Thinking',
};

export function AgentItem({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  const tone = agent.status === 'idle' ? 'muted' : agent.tone;
  const selectedAgentId = useUIStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useUIStore((s) => s.setSelectedAgentId);
  const isActive = selectedAgentId === agent.id;

  return (
    <button
      type="button"
      onClick={() =>
        setSelectedAgentId(isActive ? null : agent.id)
      }
      title={`${agent.name} — ${statusLabel[agent.status]}`}
      className={cn(
        'group relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left',
        'border transition-all duration-300 ease-out',
        'hover:translate-x-[2px] motion-reduce:hover:translate-x-0',
        isActive
          ? 'border-accent-purple/30 bg-accent-purple/[0.08]'
          : 'border-transparent hover:border-white/[0.06] hover:bg-white/[0.025]',
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-r
            bg-accent-purple shadow-[0_0_10px_0_rgba(168,85,247,0.7)]"
        />
      )}

      <span
        className={cn(
          'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
          'bg-white/[0.025] border transition-colors duration-300',
          isActive
            ? 'border-accent-purple/30'
            : 'border-white/[0.05] group-hover:border-accent-purple/25',
        )}
      >
        <Icon
          size={14}
          className={cn(
            'transition-colors duration-300',
            isActive
              ? 'text-accent-purple-soft'
              : 'text-ink-muted group-hover:text-accent-purple-soft',
          )}
        />
        <span className="absolute -right-0.5 -top-0.5">
          <StatusDot tone={tone} pulse={agent.status !== 'idle'} />
        </span>
      </span>

      <span className="flex flex-col min-w-0">
        <span
          className={cn(
            'text-[13px] font-medium leading-tight truncate transition-colors',
            isActive ? 'text-ink-bright' : 'text-ink-bright/95',
          )}
        >
          {agent.name}
        </span>
        <span className="text-2xs text-ink-dim mt-0.5 truncate">{agent.subtitle}</span>
      </span>
    </button>
  );
}
