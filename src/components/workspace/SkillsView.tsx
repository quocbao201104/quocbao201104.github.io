import { skillCategories, skillsMeta } from '@/data/skills';
import { cn } from '@/lib/cn';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function SkillBar({ value }: { value: number }) {
  const pct = clamp(Math.round(value), 0, 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full bg-accent-purple/80"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SkillsView() {
  return (
    <div className="flex flex-col gap-7 lg:gap-9">
      <header className="flex flex-col gap-2">
        <p className="text-2xs font-mono text-ink-dim">
          <span className="text-ink-faint">//</span> skills.json — tech stack & tools I actually
          use
        </p>
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-ink-bright">
          Skills
        </h2>

        <div className="mt-2 panel-flat rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 lg:p-5">
          <pre className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink-muted/90 font-mono">
{`{
  "status": "${skillsMeta.status}",
  "passions": ${JSON.stringify(skillsMeta.passions)},
  "location": "${skillsMeta.location}"
}`}
          </pre>
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {skillCategories.map((cat) => (
          <article
            key={cat.title}
            className={cn(
              'panel-soft rounded-2xl p-6 lg:p-7 border border-white/[0.05]',
              'overflow-hidden',
            )}
          >
            <span className="label-eyebrow">{cat.title}</span>
            <div className="mt-5 space-y-4">
              {cat.items.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[13px] text-ink-muted/95">{item.name}</span>
                    <span className="text-2xs font-mono text-ink-dim tabular-nums">
                      {clamp(item.level, 0, 100)}%
                    </span>
                  </div>
                  <SkillBar value={item.level} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

