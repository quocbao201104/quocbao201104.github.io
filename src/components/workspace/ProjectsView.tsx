import { ExternalLink, Github, Heart, Shield, Brain, Sparkles } from 'lucide-react';
import { getMarkdownProjects } from '@/lib/projects/markdownProjects';
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
      <header className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="label-eyebrow">Projects</span>
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-bright">
            Selected builds
          </h2>
          <p className="text-[14px] leading-relaxed text-ink-muted/95 max-w-[62ch]">
            A small set of systems that reflect how I think: calm UX, strong architecture,
            and practical intelligence.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {projects.map((p) => (
          <article
            key={p.id}
            className={cn(
              'group relative panel-soft rounded-xl overflow-hidden',
              'border border-white/[0.05] hover:border-white/[0.08]',
              'transition-[border-color,box-shadow] duration-400 ease-out',
              'hover:shadow-[0_8px_30px_-12px_rgba(168,85,247,0.2)]',
            )}
          >
            {/* Top accent line */}
            <span
              aria-hidden
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="flex flex-col lg:flex-row">
              {/* Left: icon + meta */}
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4
                px-5 pt-5 pb-3 lg:py-6 lg:px-6 lg:w-[200px] lg:shrink-0
                border-b lg:border-b-0 lg:border-r border-white/[0.04]">
                <ProjectIcon kind={p.icon} />
                <span className="text-2xs font-mono uppercase tracking-wider2 text-accent-purple-soft/80">
                  {p.eyebrow}
                </span>
              </div>

              {/* Center: content */}
              <div className="flex-1 min-w-0 px-5 py-5 lg:px-7 lg:py-6">
                <h3 className="text-lg font-semibold text-ink-bright tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted/90 max-w-[80ch]">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
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
              </div>

              {/* Right: links */}
              <div className="flex items-center gap-2 px-5 py-3 lg:py-6 lg:px-5 lg:flex-col lg:items-end lg:justify-start lg:gap-2
                border-t lg:border-t-0 lg:border-l border-white/[0.04]">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
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
          </article>
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

