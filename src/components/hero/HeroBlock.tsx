import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';

export function HeroBlock() {
  return (
    <div className="relative flex flex-col gap-6">
      <p className="font-mono text-[12px] uppercase tracking-wider2 text-accent-cyan/85">
        {profile.eyebrow}
      </p>

      <h1 className="text-[64px] sm:text-[86px] lg:text-[104px] xl:text-[118px] leading-[0.9] tracking-[-0.075em] font-semibold text-ink-bright">
        {profile.headline.line1}
      </h1>

      <div className="flex max-w-[620px] flex-wrap items-center gap-2">
        {profile.roleChips.slice(0, 4).map((role) => (
          <span
            key={role}
            className={cn(
              'rounded-full border border-line bg-bg-raised/70 px-3 py-1.5',
              'font-mono text-2xs uppercase tracking-wider2 text-ink-muted',
              'transition-colors duration-200 ease-out hover:border-accent-purple/45',
              'hover:bg-accent-purple/[0.08] hover:text-ink-bright',
            )}
          >
            {role}
          </span>
        ))}
      </div>

      <p className="max-w-[600px] text-[15px] leading-relaxed text-ink-muted sm:text-base">
        {profile.bio}
      </p>

      {/* "Now" identity line — quiet, human */}
      <div className="flex items-center gap-2.5 mt-1">
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
          <span className="relative h-1.5 w-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.55)]" />
        </span>
        <span className="text-[13px] text-ink-muted/90 italic font-light">
          {profile.now}
        </span>
      </div>

      {/* CTAs — refined, less marketing-y */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={profile.cta.primary.href}
          className={cn(
            'group inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
            'bg-accent-purple/95 text-white font-medium text-sm',
            'shadow-[0_2px_10px_-2px_rgba(168,85,247,0.4)]',
            'hover:bg-accent-purple hover:shadow-[0_4px_18px_-4px_rgba(168,85,247,0.5)]',
            'active:scale-[0.985] transition-all duration-300 ease-out',
          )}
        >
          {profile.cta.primary.label}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
          />
        </a>
        <a
          href={profile.cta.secondary.href}
          className={cn(
            'group inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
            'glass text-ink-bright font-medium text-sm',
            'hover:border-accent-purple/30 hover:bg-white/[0.04]',
            'transition-all duration-300 ease-out',
          )}
        >
          <Sparkles size={13} className="text-accent-cyan" />
          {profile.cta.secondary.label}
        </a>
      </div>

      {/* Scroll cue */}
      <div className="pt-4 flex items-center gap-2 text-ink-dim label-eyebrow">
        <ChevronDown size={11} />
        Scroll to explore
      </div>
    </div>
  );
}
