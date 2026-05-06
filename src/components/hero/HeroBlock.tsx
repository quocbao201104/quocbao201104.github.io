import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';

export function HeroBlock() {
  return (
    <div className="relative flex flex-col gap-6">
      {/* Eyebrow chip */}
      <div className="inline-flex">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
            'border border-accent-purple/25 bg-accent-purple/[0.08]',
            'text-2xs font-mono uppercase tracking-wider2 text-accent-purple-soft',
          )}
        >
          <Sparkles size={11} className="text-accent-purple" />
          {profile.eyebrow}
        </span>
      </div>

      {/* Headline — softer scale, more breathing room */}
      <h1 className="text-[36px] sm:text-[42px] lg:text-[50px] leading-[1.12] tracking-[-0.02em] font-semibold text-ink-bright">
        {profile.headline.line1}{' '}
        <span className="text-gradient-purple">{profile.headline.accent}</span>
      </h1>

      {/* Subheading */}
      <p className="text-[15px] text-ink-muted max-w-[480px] leading-relaxed">
        {profile.role}
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
