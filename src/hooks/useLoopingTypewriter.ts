import { useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'typing' | 'pauseAfterTyped' | 'deleting' | 'pauseAfterDeleted';

interface Options {
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
  pauseAfterTypedMs?: number;
  pauseAfterDeletedMs?: number;
  enabled?: boolean;
}

export function useLoopingTypewriter(
  phrases: readonly string[],
  opts: Options = {},
) {
  const {
    typeSpeedMs = 26,
    deleteSpeedMs = 14,
    pauseAfterTypedMs = 1100,
    pauseAfterDeletedMs = 260,
    enabled = true,
  } = opts;

  const safePhrases = useMemo(
    () => phrases.filter((p) => p.trim().length > 0),
    [phrases],
  );

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [displayed, setDisplayed] = useState('');

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || safePhrases.length === 0) return;

    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const full = safePhrases[phraseIndex % safePhrases.length] ?? '';

    const schedule = (ms: number, fn: () => void) => {
      timeoutRef.current = window.setTimeout(fn, ms);
    };

    if (phase === 'typing') {
      if (displayed.length >= full.length) {
        schedule(pauseAfterTypedMs, () => setPhase('pauseAfterTyped'));
        return;
      }
      schedule(typeSpeedMs, () => setDisplayed(full.slice(0, displayed.length + 1)));
      return;
    }

    if (phase === 'pauseAfterTyped') {
      schedule(0, () => setPhase('deleting'));
      return;
    }

    if (phase === 'deleting') {
      if (displayed.length === 0) {
        schedule(pauseAfterDeletedMs, () => setPhase('pauseAfterDeleted'));
        return;
      }
      schedule(deleteSpeedMs, () => setDisplayed(displayed.slice(0, -1)));
      return;
    }

    // pauseAfterDeleted
    schedule(0, () => {
      setPhraseIndex((i) => (i + 1) % safePhrases.length);
      setPhase('typing');
    });

    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [
    enabled,
    safePhrases,
    phraseIndex,
    phase,
    displayed,
    typeSpeedMs,
    deleteSpeedMs,
    pauseAfterTypedMs,
    pauseAfterDeletedMs,
  ]);

  useEffect(() => {
    if (!enabled) return;
    setPhraseIndex(0);
    setPhase('typing');
    setDisplayed('');
  }, [enabled, safePhrases.length]);

  return {
    displayed,
    phraseIndex: safePhrases.length === 0 ? 0 : phraseIndex % safePhrases.length,
    phraseCount: safePhrases.length,
  };
}

