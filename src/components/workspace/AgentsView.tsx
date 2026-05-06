import { AgentList } from '@/components/sidebar/AgentList';
import { useUIStore } from '@/stores/uiStore';
import { agents } from '@/data/agents';

export function AgentsView() {
  const selected = useUIStore((s) => s.selectedAgentId);
  const active = agents.find((a) => a.id === selected) ?? agents[0]!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
      <div className="panel-soft rounded-2xl p-5 lg:p-6 border border-white/[0.05]">
        <span className="label-eyebrow">Agents</span>
        <div className="mt-4">
          <AgentList />
        </div>
      </div>

      <div className="panel-soft rounded-2xl p-6 lg:p-8 border border-white/[0.05]">
        <span className="label-eyebrow">Selected Agent</span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-bright">
          {active.name}
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted/90 leading-relaxed max-w-[70ch]">
          {active.subtitle}. This is a calm, intentional interface — use the terminal to ask
          questions, inspect architectures, or query memory.
        </p>

        <div className="mt-6 panel-flat rounded-xl p-5 border border-white/[0.05]">
          <p className="text-[13px] text-ink-muted/95 leading-relaxed">
            Try:
          </p>
          <ul className="mt-3 space-y-2 text-2xs font-mono text-accent-purple-soft">
            <li>&gt; ask recruiter backend</li>
            <li>&gt; inspect architecture orgmind</li>
            <li>&gt; run memory agent graphrag</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

