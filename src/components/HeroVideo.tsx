import { useEffect, useState } from 'react';

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
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80 md:opacity-100"
      />
      {play && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${ready ? 'opacity-80 md:opacity-100' : 'opacity-0'}`}
        >
          <source src="/media/hero-640.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/media/hero-1280.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
