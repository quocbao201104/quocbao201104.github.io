import type { Variants, Transition } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeStandard = [0.4, 0, 0.2, 1] as const;

/** Soft, expressive spring — for entrances and gentle motion */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 22,
  mass: 0.9,
};

/** Snappy spring — for hover and small interactions */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.7,
};

/** Long, calm tween — for ambient atmosphere */
export const calmTween: Transition = {
  duration: 0.8,
  ease: easeOut,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay, delayChildren: 0.05 },
  },
});

export const softHover = {
  whileHover: { y: -2 },
  transition: springSnappy,
};
