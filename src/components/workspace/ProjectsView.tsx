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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {projects.map((p) => (
          <article
            key={p.id}
            className={cn(
              'panel-soft rounded-2xl p-6 lg:p-7 overflow-hidden',
              'border border-white/[0.05] hover:border-white/[0.07]',
              'transition-[border-color,transform,box-shadow] duration-500 ease-out',
              'hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-30px_rgba(168,85,247,0.35)]',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <ProjectIcon kind={p.icon} />
                <span className="text-2xs font-mono uppercase tracking-wider2 text-accent-purple-soft/80">
                  {p.eyebrow}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1
                      border border-white/[0.06] bg-white/[0.02]
                      text-2xs font-mono text-ink-dim hover:text-ink-bright
                      hover:border-white/[0.10] transition-colors"
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

            <h3 className="mt-5 text-xl font-semibold text-ink-bright tracking-tight">
              {p.title}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted/90 max-w-[70ch]">
              {p.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-md px-2 py-1
                    border border-white/[0.06] bg-bg-raised/60
                    text-2xs font-mono text-ink-dim"
                >
                  {t}
                </span>
              ))}
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
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <Icon size={14} className="text-accent-purple-soft" />
    </span>
  );
}

