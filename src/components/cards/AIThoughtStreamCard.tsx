import { Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CardShell } from './CardShell';
import { useTypewriter } from '@/hooks/useTypewriter';

const thoughts = [
  'Thinking about long-term memory systems and how agents should forget gracefully...',
  'Exploring GraphRAG retrieval tradeoffs over hierarchical knowledge...',
  'Optimizing agent orchestration latency under multi-step plans...',
  'Designing self-healing pipelines for streaming embeddings...',
];

const READ_PAUSE_MS = 5200;

export function AIThoughtStreamCard() {
  const [idx, setIdx] = useState(0);
  const text = thoughts[idx]!;
  const { displayed, done } = useTypewriter(text, { speed: 22 });

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(
      () => setIdx((i) => (i + 1) % thoughts.length),
      READ_PAUSE_MS,
    );
    return () => window.clearTimeout(t);
  }, [done, idx]);

  return (
    <CardShell eyebrow="AI Thought Stream" icon={Lightbulb} iconTone="warn">
      <div className="relative h-[78px]">
        <p className="text-[13px] leading-relaxed text-ink-muted/95">
          {displayed}
          {!done && <Caret />}
        </p>
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThinkingDot />
          <span className="text-2xs font-mono text-ink-dim">
            {done ? 'just now' : 'thinking...'}
          </span>
        </div>
        <ThinkingWave active={!done} />
      </div>
    </CardShell>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-3 w-[2px] -mb-[2px] align-middle bg-accent-purple animate-cursor-blink"
    />
  );
}

function ThinkingDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="absolute inset-0 rounded-full bg-accent-purple/50 animate-pulse-ring" />
      <span className="relative h-2 w-2 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
    </span>
  );
}

function ThinkingWave({ active }: { active: boolean }) {
  return (
    <svg
      width="86"
      height="20"
      viewBox="0 0 86 20"
      className="transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.55 }}
    >
      <defs>
        <linearGradient id="waveGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <path
        d="M0,10 Q5,4 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T86,10"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      >
        {active && (
          <animate
            attributeName="d"
            dur="2.4s"
            repeatCount="indefinite"
            values="
              M0,10 Q5,4 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T86,10;
              M0,10 Q5,16 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T86,10;
              M0,10 Q5,4 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T86,10
            "
          />
        )}
      </path>
    </svg>
  );
}
