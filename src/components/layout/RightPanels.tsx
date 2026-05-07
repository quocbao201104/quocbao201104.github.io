import { SystemHealthPanel } from '@/components/panels/SystemHealthPanel';
import { TechStackPanel } from '@/components/panels/TechStackPanel';

export function RightPanels() {
  return (
    <aside
      className="hidden xl:flex w-[300px] shrink-0 border-l border-white/[0.04]
        bg-bg-base/45 flex-col gap-6 p-6 overflow-hidden"
    >
      <TechStackPanel />
      <SystemHealthPanel />
    </aside>
  );
}
