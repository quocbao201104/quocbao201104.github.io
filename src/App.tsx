import { TopSystemBar } from '@/components/layout/TopSystemBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { MainArea } from '@/components/layout/MainArea';
import { RightPanels } from '@/components/layout/RightPanels';
import { BottomTerminal } from '@/components/layout/BottomTerminal';
import { CommandPalette } from '@/components/palette/CommandPalette';
import { GlowOrb } from '@/components/common/GlowOrb';
import { useUIStore } from '@/stores/uiStore';

export default function App() {
  const terminalCollapsed = useUIStore((s) => s.terminalCollapsed);
  const terminalVisible = useUIStore((s) => s.terminalVisible);
  const dockH = terminalCollapsed ? 48 : 280;

  return (
    <div className="relative min-h-screen bg-app text-ink-muted vignette-edges">
      {/* Static atmosphere (no idle animation) */}
      <GlowOrb className="-top-40 right-0" color="purple" size={760} />
      <GlowOrb className="bottom-0 -left-40" color="cyan" size={520} />

      {/* Subtle grid backdrop, faded at edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-[0.4] mask-radial-fade"
      />

      {/* App chrome uses internal scroll areas (no body scroll) */}
      <div className="flex h-screen flex-col overflow-hidden">
        <TopSystemBar />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <LeftSidebar />

          <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div
                id="center-scroll"
                className="flex-1 min-w-0 overflow-y-auto"
                style={{ paddingBottom: terminalVisible ? dockH : 0 }}
              >
                <MainArea />
              </div>
              <RightPanels />
            </div>
          </main>
        </div>
      </div>

      {terminalVisible && (
        <div
          className="
            fixed bottom-0 z-40
            left-0 right-0
            lg:left-[260px]
            xl:right-[300px]
          "
        >
          <BottomTerminal />
        </div>
      )}

      <CommandPalette />
    </div>
  );
}
