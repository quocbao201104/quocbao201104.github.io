import { motion } from 'framer-motion';
import type { TerminalLine } from '@/data/terminalScript';
import { cn } from '@/lib/cn';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const speakerToneClasses = {
  purple: 'text-accent-purple-soft',
  cyan: 'text-accent-cyan',
  ok: 'text-status-ok',
  warn: 'text-status-warn',
  muted: 'text-ink-dim',
};

interface TerminalLineProps {
  line: TerminalLine;
  animate: boolean;
  onDone?: () => void;
}

export function TerminalLineRow({ line, animate, onDone }: TerminalLineProps) {
  if (line.kind === 'command') {
    return <CommandRow line={line} animate={animate} onDone={onDone} />;
  }
  return <OutputRow line={line} animate={animate} onDone={onDone} />;
}

function CommandRow({
  line,
  animate,
  onDone,
}: {
  line: Extract<TerminalLine, { kind: 'command' }>;
  animate: boolean;
  onDone?: () => void;
}) {
  const { displayed, done } = useTypewriter(line.text, {
    enabled: animate,
    speed: 26,
    onComplete: onDone,
  });
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-baseline gap-2 font-mono text-[12.5px] leading-relaxed"
    >
      <span className="text-status-ok shrink-0 select-none">{line.prompt}</span>
      <span className="text-ink-bright">
        {displayed}
        {animate && !done && <Cursor />}
      </span>
    </motion.div>
  );
}

function OutputRow({
  line,
  animate,
  onDone,
}: {
  line: Extract<TerminalLine, { kind: 'output' }>;
  animate: boolean;
  onDone?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  // Slight realistic latency before output begins streaming
  const [latencyDone, setLatencyDone] = useState(!animate || reduced);
  useEffect(() => {
    if (!animate || reduced) {
      setLatencyDone(true);
      return;
    }
    setLatencyDone(false);
    const t = window.setTimeout(() => setLatencyDone(true), 240);
    return () => window.clearTimeout(t);
  }, [animate, reduced]);

  const tone = line.speakerTone ?? 'muted';
  const { displayed, done } = useTypewriter(line.text, {
    enabled: animate && latencyDone,
    speed: 11,
    onComplete: onDone,
  });

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="font-mono text-[12.5px] leading-relaxed"
    >
      <span className={cn('text-ink-muted/95 whitespace-pre-wrap break-words', speakerToneClasses[tone])}>
        {animate && !latencyDone ? <Cursor /> : displayed}
        {animate && latencyDone && !done && <Cursor />}
      </span>
    </motion.div>
  );
}

function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-3 w-1.5 -mb-[2px] bg-accent-purple animate-cursor-blink align-middle" />
  );
}
