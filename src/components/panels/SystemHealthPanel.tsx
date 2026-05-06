import { systemHealth, type HealthStatus } from '@/data/systemHealth';
import { PanelShell } from './PanelShell';
import { StatusDot } from '@/components/common/StatusDot';

const labelByStatus: Record<HealthStatus, { label: string; tone: 'ok' | 'warn' | 'err' }> = {
  operational: { label: 'Operational', tone: 'ok' },
  degraded: { label: 'Degraded', tone: 'warn' },
  down: { label: 'Down', tone: 'err' },
};

export function SystemHealthPanel() {
  return (
    <PanelShell title="System Health" link={{ label: 'View full status' }}>
      <ul className="flex flex-col gap-2.5">
        {systemHealth.map((item) => {
          const meta = labelByStatus[item.status];
          return (
            <li
              key={item.name}
              className="flex items-center justify-between text-[13px]"
            >
              <span className="text-ink-muted">{item.name}</span>
              <span className="flex items-center gap-1.5 text-2xs font-mono text-status-ok/90">
                <StatusDot tone={meta.tone} />
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}
