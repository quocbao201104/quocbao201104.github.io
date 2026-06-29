import { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ExternalLink, Github, Heart, Shield, Brain, Sparkles, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { getMarkdownProjects, type MarkdownProject } from '@/lib/projects/markdownProjects';
import { cn } from '@/lib/cn';

const icons = {
  heart: Heart,
  shield: Shield,
  brain: Brain,
  spark: Sparkles,
};

export function ProjectsView() {
  const projects = getMarkdownProjects();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="label-eyebrow">Projects</span>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-bright">
          Selected builds
        </h2>
        <p className="text-[14px] leading-relaxed text-ink-muted/95 max-w-[62ch]">
          A small set of systems that reflect how I think: calm UX, strong architecture,
          and practical intelligence. Kéo ngang trên mỗi card để xem demo.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}

function ProjectIcon({ kind }: { kind: keyof typeof icons }) {
  const Icon = icons[kind];
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg
      border border-white/[0.06] bg-white/[0.02] shrink-0">
      <Icon size={15} className="text-accent-purple-soft" />
    </span>
  );
}

function ProjectCard({ project: p }: { project: MarkdownProject }) {
  // page 0 = intro, pages 1..n = demo slides
  const pageCount = 1 + p.demos.length;
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, next));
    if (clamped === page) return;
    setDir(clamped > page ? 1 : -1);
    setPage(clamped);
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(page + 1);
    else if (info.offset.x > threshold) goTo(page - 1);
  };

  return (
    <article
      className={cn(
        'group relative panel-soft rounded-xl overflow-hidden flex flex-col',
        'border border-white/[0.05] hover:border-white/[0.08]',
        'transition-[border-color,box-shadow] duration-400 ease-out',
        'hover:shadow-[0_8px_30px_-12px_rgba(168,85,247,0.2)]',
      )}
    >
      <span
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
      />

      {/* Swipeable stage — fixed height keeps every card uniform */}
      <div className="relative h-[280px] overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={page}
            custom={dir}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            initial={{ x: dir === 0 ? 0 : dir > 0 ? '100%' : '-100%', opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? '-100%' : '100%', opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {page === 0 ? (
              <IntroPage project={p} />
            ) : (
              <DemoPage project={p} index={page - 1} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Edge arrows — desktop affordance, hidden on small screens */}
        {page > 0 && (
          <button
            type="button"
            aria-label="Trang trước"
            onClick={() => goTo(page - 1)}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20
              h-7 w-7 items-center justify-center rounded-full
              border border-white/10 bg-black/40 backdrop-blur text-ink-dim
              hover:text-ink-bright hover:border-accent-purple/30 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
        )}
        {page < pageCount - 1 && (
          <button
            type="button"
            aria-label="Trang sau"
            onClick={() => goTo(page + 1)}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20
              h-7 w-7 items-center justify-center rounded-full
              border border-white/10 bg-black/40 backdrop-blur text-ink-dim
              hover:text-ink-bright hover:border-accent-purple/30 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Footer: page dots */}
      <div className="flex items-center justify-center gap-1.5 py-3 border-t border-white/[0.04]">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={i === 0 ? 'Giới thiệu' : `Demo ${i}`}
            onClick={() => goTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === page
                ? 'w-5 bg-accent-purple-soft'
                : 'w-1.5 bg-white/15 hover:bg-white/30',
            )}
          />
        ))}
      </div>
    </article>
  );
}

function IntroPage({ project: p }: { project: MarkdownProject }) {
  return (
    <div className="h-full flex flex-col px-5 py-5 lg:px-6 lg:py-5 overflow-y-auto select-none">
      <div className="flex items-center gap-3">
        <ProjectIcon kind={p.icon} />
        <div className="min-w-0">
          <span className="block text-2xs font-mono uppercase tracking-wider2 text-accent-purple-soft/80 truncate">
            {p.eyebrow}
          </span>
          <h3 className="text-base lg:text-lg font-semibold text-ink-bright tracking-tight truncate">
            {p.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink-muted/90 line-clamp-3">
        {p.summary}
      </p>

      {p.problem && (
        <div className="mt-2.5 border-l-2 border-accent-purple/25 pl-3">
          <span className="text-2xs font-mono uppercase tracking-wider2 text-accent-purple-soft/70">
            Giải quyết
          </span>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-dim line-clamp-2">
            {p.problem}
          </p>
        </div>
      )}

      <div className="mt-auto pt-3 flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          {p.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded px-2 py-0.5
                border border-white/[0.06] bg-white/[0.02]
                text-[11px] font-mono text-ink-dim"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {p.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5
                border border-white/[0.06] bg-white/[0.02]
                text-2xs font-mono text-ink-dim hover:text-ink-bright
                hover:border-accent-purple/25 hover:bg-accent-purple/[0.04]
                transition-colors"
            >
              {l.label}
              {l.label.toLowerCase().includes('git') ? (
                <Github size={12} />
              ) : (
                <ExternalLink size={12} />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoPage({ project: p, index }: { project: MarkdownProject; index: number }) {
  const demo = p.demos[index];

  if (demo.src) {
    return (
      <div className="h-full w-full bg-black/30">
        <img
          src={demo.src}
          alt={demo.caption || `${p.title} demo ${index + 1}`}
          draggable={false}
          className="h-full w-full object-cover pointer-events-none"
        />
        {demo.caption && (
          <span className="absolute bottom-2 left-3 right-3 text-2xs font-mono text-ink-dim/90
            bg-black/40 backdrop-blur px-2 py-1 rounded truncate">
            {demo.caption}
          </span>
        )}
      </div>
    );
  }

  // Placeholder slide — gradient + project name, swap-ready once a real image lands
  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-deep select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/25 via-accent-purple/5 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-3 text-center px-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl
          border border-white/10 bg-white/[0.03]">
          <ImageIcon size={20} className="text-accent-purple-soft/80" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-bright">{p.title}</p>
          <p className="mt-1 text-2xs font-mono uppercase tracking-wider2 text-ink-dim">
            {demo.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

