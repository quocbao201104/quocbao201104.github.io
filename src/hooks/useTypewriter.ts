import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface Options {
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

export function useTypewriter(text: string, opts: Options = {}) {
  const reduced = usePrefersReducedMotion();
  const { speed = 18, enabled = true, onComplete } = opts;
  const effectivelyEnabled = enabled && !reduced;

  const [displayed, setDisplayed] = useState(effectivelyEnabled ? '' : text);
  const [done, setDone] = useState(!effectivelyEnabled);

  useEffect(() => {
    if (!effectivelyEnabled) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, effectivelyEnabled, speed]);

  return { displayed, done };
}
