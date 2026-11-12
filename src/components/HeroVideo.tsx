import { useEffect, useState } from 'react';

// The footage opens on a shot of Earth from orbit. The film for this page starts in Mongolia:
// first on the steppe scene the poster is taken from, then every loop from the open sky.
const FIRST_START = 22.3;
const LOOP_START = 2.9;

/**
 * Background video for the home page. A small poster picture shows at once; the video itself
 * (a short, light copy) starts a moment later, and is skipped for visitors who asked for less
 * motion or who are on a slow or data-saving connection.
 */
export default function HeroVideo() {
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as any).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType || '');
    if (reduce || slow) return;
    const t = window.setTimeout(() => setPlay(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <img
        src="/media/hero-poster.webp"
        srcSet="/media/hero-poster-640.webp 640w, /media/hero-poster.webp 1280w"
        sizes="100vw"
        alt=""
        // @ts-ignore: fetchPriority is valid on img
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {play && (
        <video
          autoPlay
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = FIRST_START; }}
          onCanPlay={() => setReady(true)}
          onEnded={(e) => {
            const v = e.currentTarget;
            v.currentTime = LOOP_START;
            v.play().catch(() => {});
          }}
          // The file carries black cinema bars above and below the picture; the frame is taller than the hero so they fall outside it
          className={`absolute inset-x-0 top-[-13.5%] h-[128%] w-full object-cover pointer-events-none transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="/media/hero-640.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/media/hero-1280.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
