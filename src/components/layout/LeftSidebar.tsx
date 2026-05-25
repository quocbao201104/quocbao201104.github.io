import { NavSection } from '@/components/sidebar/NavSection';

export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 border-r border-line/80 bg-bg-base/70 flex-col">
      <div className="p-3 pt-5 flex-1">
        <NavSection />
      </div>
    </aside>
  );
}
