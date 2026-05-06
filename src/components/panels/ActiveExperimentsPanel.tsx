import { experiments } from '@/data/experiments';
import { PanelShell } from './PanelShell';

export function ActiveExperimentsPanel() {
  return (
    <PanelShell title="Active Experiments" link={{ label: 'View all experiments' }}>
      <ul className="flex flex-col gap-2.5">
        {experiments.map((e) => (
          <li
            key={e.name}
            className="flex items-center justify-between text-[13px]"
          >
            <span className="text-ink-muted truncate">{e.name}</span>
            <span className="text-2xs font-mono text-accent-purple-soft shrink-0 ml-2">
              {e.version}
            </span>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
