import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Runtime mobile device & viewport checking for lightweight animation selection
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
};

/**
 * Returns optimized framer-motion props for fading elements in and up.
 * On mobile devices, translation offsets are heavily reduced, easing curves are simplified,
 * and entry trigger margins are loosened to prevent layout/scrolling lag and blank sections.
 */
export function getFadeUp(delay = 0, defaultY = 30, duration = 0.8) {
  const isMobile = isMobileViewport();
  const yValue = isMobile ? Math.min(defaultY, 10) : defaultY;
  const animDuration = isMobile ? Math.min(duration, 0.4) : duration;
  const animEase = isMobile ? "easeOut" : [0.22, 1, 0.36, 1];
  const margin = isMobile ? "-15px" : "-100px";

  return {
    initial: { opacity: 0, y: yValue },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin },
    transition: {
      duration: animDuration,
      delay,
      ease: animEase as any,
    },
  };
}

/**
 * Returns optimized animation-trigger props for simple entry fading (without position movement)
 */
export function getFadeIn(delay = 0, duration = 0.6) {
  const isMobile = isMobileViewport();
  const animDuration = isMobile ? Math.min(duration, 0.35) : duration;

  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: isMobile ? "-10px" : "-50px" },
    transition: {
      duration: animDuration,
      delay,
      ease: "easeOut" as any,
    },
  };
}

/**
 * Returns optimized horizontal animations (fading from left/right)
 */
export function getFadeSide(direction: 'left' | 'right' = 'left', delay = 0, defaultX = 30) {
  const isMobile = isMobileViewport();
  const xValue = isMobile ? Math.min(defaultX, 10) : defaultX;
  const startX = direction === 'left' ? -xValue : xValue;
  const animDuration = isMobile ? 0.4 : 0.8;
  const animEase = isMobile ? "easeOut" : [0.22, 1, 0.36, 1];
  const margin = isMobile ? "-15px" : "-100px";

  return {
    initial: { opacity: 0, x: startX },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin },
    transition: {
      duration: animDuration,
      delay,
      ease: animEase as any,
    },
  };
}
