import { techStack } from '@/data/techStack';
import { PanelShell } from './PanelShell';

export function TechStackPanel() {
  return (
    <PanelShell title="Tech Stack" link={{ label: 'View all technologies' }}>
      <div className="grid grid-cols-4 gap-2 pt-1">
        {techStack.map((t) => (
          <div
            key={t.id}
            title={t.label}
            className="group flex items-center justify-center cursor-default"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              {t.glyph}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
