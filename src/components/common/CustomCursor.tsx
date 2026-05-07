import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const INNER_SIZE = 6;
const OUTER_SIZE = 18;
const LAG_FACTOR = 0.12;

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const outerPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const targetRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (reducedMotion) return;

    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const tick = () => {
      const { x: tx, y: ty } = targetRef.current;
      const { x: ox, y: oy } = outerPos.current;

      outerPos.current = {
        x: ox + (tx - ox) * LAG_FACTOR,
        y: oy + (ty - oy) * LAG_FACTOR,
      };

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${tx - INNER_SIZE / 2}px, ${ty - INNER_SIZE / 2}px)`;
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x - OUTER_SIZE / 2}px, ${outerPos.current.y - OUTER_SIZE / 2}px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms ease-out' }}
    >
      {/* Outer square — follows with lag */}
      <div
        ref={outerRef}
        className="absolute left-0 top-0"
        style={{
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          border: '1.5px solid rgba(168, 85, 247, 0.5)',
          willChange: 'transform',
        }}
      />

      {/* Inner core — bright square, direct position */}
      <div
        ref={innerRef}
        className="absolute left-0 top-0"
        style={{
          width: INNER_SIZE,
          height: INNER_SIZE,
          backgroundColor: 'rgba(168, 85, 247, 0.85)',
          boxShadow: '0 0 6px rgba(168, 85, 247, 0.5)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
