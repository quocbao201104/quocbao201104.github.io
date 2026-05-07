import { useEffect, useMemo, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(opts: {
  from?: number;
  to: number;
  durationMs?: number;
  startKey?: number | string;
  enabled?: boolean;
}) {
  const { from = 0, to, durationMs = 820, startKey = 0, enabled = true } = opts;

  const safeTo = useMemo(() => {
    if (!Number.isFinite(to)) return 0;
    return Math.max(0, Math.min(100, Math.round(to)));
  }, [to]);

  const [value, setValue] = useState(enabled ? from : safeTo);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(safeTo);
      return;
    }

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);

    const start = performance.now();
    const fromV = from;
    const toV = safeTo;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      const v = fromV + (toV - fromV) * eased;
      setValue(Math.round(v));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, safeTo, durationMs, startKey]);

  return value;
}

