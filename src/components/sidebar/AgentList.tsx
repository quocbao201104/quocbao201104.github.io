import { agents } from '@/data/agents';
import { AgentItem } from './AgentItem';

export function AgentList() {
  return (
    <div className="flex flex-col">
      <div className="label-eyebrow px-3 mb-3">AI Agents</div>
      <div className="flex flex-col gap-0.5">
        {agents.map((a) => (
          <AgentItem key={a.id} agent={a} />
        ))}
      </div>
    </div>
  );
}
