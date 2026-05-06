import { AnimatePresence, motion } from 'framer-motion';
import { HeroBlock } from '@/components/hero/HeroBlock';
import { NeuralGraph } from '@/components/hero/NeuralGraph';
import { CurrentFocusCard } from '@/components/cards/CurrentFocusCard';
import { RecentDeploymentCard } from '@/components/cards/RecentDeploymentCard';
import { GithubActivityCard } from '@/components/cards/GithubActivityCard';
import { AIThoughtStreamCard } from '@/components/cards/AIThoughtStreamCard';
import { fadeUp, stagger } from '@/lib/motion';
import { useUIStore, type SectionId } from '@/stores/uiStore';
import { ProjectsView } from '@/components/workspace/ProjectsView';
import { AgentsView } from '@/components/workspace/AgentsView';
import { LabView } from '@/components/workspace/LabView';
import { MemoryView } from '@/components/workspace/MemoryView';
import { useEffect } from 'react';
import { profile } from '@/data/profile';

export function MainArea() {
  const active = useUIStore((s) => s.activeSection);

  useEffect(() => {
    const el = document.getElementById('center-scroll');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      {/* Central panel header — flush to the panel edges (VSCode-like) */}
      <WorkspaceHeader active={active} />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 lg:px-12 py-10 lg:py-14"
        >
          {active === 'home' && <HomeWorkspace />}
          {active === 'projects' && <ProjectsView />}
          {active === 'agents' && <AgentsView />}
          {active === 'lab' && <LabView />}
          {active === 'memory' && <MemoryView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HomeWorkspace() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      {/* HOME — Hero + Graph */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] gap-10 lg:gap-12 xl:gap-16 items-center min-h-[560px]">
        <HeroBlock />
        <div className="hidden md:block">
          <NeuralGraph />
        </div>
      </section>

      {/* CARD ROW */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger(0.08)}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5"
      >
        <motion.div variants={fadeUp}>
          <CurrentFocusCard />
        </motion.div>
        <motion.div variants={fadeUp}>
          <RecentDeploymentCard />
        </motion.div>
        <motion.div variants={fadeUp}>
          <GithubActivityCard />
        </motion.div>
        <motion.div variants={fadeUp}>
          <AIThoughtStreamCard />
        </motion.div>
      </motion.section>
    </div>
  );
}

function WorkspaceHeader({ active }: { active: SectionId }) {
  const openTab = useUIStore((s) => s.openTab);
  const closeTab = useUIStore((s) => s.closeTab);
  const openedTabs = useUIStore((s) => s.openedTabs);
  const tabs: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'home.tsx' },
    { id: 'projects', label: 'projects.ts' },
    { id: 'agents', label: 'agents.ai' },
    { id: 'lab', label: 'lab' },
    { id: 'memory', label: 'memory.log' },
  ];

  const activeLabel =
    tabs.find((t) => t.id === active)?.label ?? 'home.tsx';

  return (
    <div className="border-y border-white/[0.05] bg-bg-base/35 backdrop-blur-2xl overflow-hidden rounded-none">
      <div className="flex items-center gap-0 bg-white/[0.01] border-b border-white/[0.04]">
        {tabs
          .filter((t) => openedTabs.includes(t.id))
          .map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => openTab(t.id)}
              className={[
                'group relative px-4 py-2.5 text-[12.5px] font-mono transition-colors duration-200',
                'border-r border-white/[0.04]',
                isActive
                  ? 'text-ink-bright bg-white/[0.03]'
                  : 'text-ink-dim hover:text-ink-muted hover:bg-white/[0.02]',
              ].join(' ')}
            >
              <span className="inline-flex items-center gap-2">
                {t.label}
                {t.id !== 'home' && (
                  <span
                    role="button"
                    aria-label="Close tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(t.id);
                    }}
                    className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-white/[0.06] text-ink-dim hover:text-ink-bright"
                  >
                    ×
                  </span>
                )}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-4 bottom-0 h-px bg-accent-purple/70"
                />
              )}
            </button>
          );
        })}
        <div className="flex-1" />
      </div>
      <div className="px-5 py-2.5">
        <p className="text-2xs font-mono text-ink-dim">
          {profile.handle} <span className="text-ink-faint">›</span> src{' '}
          <span className="text-ink-faint">›</span> {activeLabel}
        </p>
      </div>
    </div>
  );
}
