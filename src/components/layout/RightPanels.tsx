import { SystemHealthPanel } from '@/components/panels/SystemHealthPanel';
import { ActiveExperimentsPanel } from '@/components/panels/ActiveExperimentsPanel';
import { TechStackPanel } from '@/components/panels/TechStackPanel';

export function RightPanels() {
  return (
    <aside
      className="hidden xl:flex w-[300px] shrink-0 border-l border-white/[0.04]
        bg-bg-base/30 backdrop-blur-2xl flex-col gap-6 p-6 overflow-y-auto"
    >
      <SystemHealthPanel />
      <ActiveExperimentsPanel />
      <TechStackPanel />
    </aside>
  );
}
