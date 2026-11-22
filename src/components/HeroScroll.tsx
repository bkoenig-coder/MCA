import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

type ScrollSize = 'mini' | 'compact' | 'desktop';

const sizeForWidth = (): ScrollSize => (window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'compact' : 'mini');

/**
 * Which size of the panel fits this screen. The page renders only that one: a hidden copy would still be downloaded,
 * and on a phone that is wasted data.
 */
export function useHeroScrollSize(): ScrollSize {
  const [size, setSize] = useState<ScrollSize>(sizeForWidth);
  useEffect(() => {
    const onResize = () => setSize(sizeForWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

/**
 * The panel on the home page hero, over the video: a gilded parchment with "Mongol Töv" in the traditional vertical
 * script. It replaces the older script plaque, and comes in three sizes:
 *  - 'mini': phones, beside the text
 *  - 'compact': tablets, beside the text
 *  - 'desktop': its own column on large screens
 * The picture is cropped in from the photo's edges and exists in three widths (see public/media/hero-scroll-*.jpg).
 */
export default function HeroScroll({ size = 'desktop' }: { size?: ScrollSize }) {
  const { t } = useTranslation();

  const width = {
    mini: 'w-[96px]',
    compact: 'w-[150px]',
    desktop: 'w-full max-w-[300px] xl:max-w-[360px]',
  }[size];
  // Tell the browser how wide the picture will be, so it fetches the smallest copy that stays sharp
  const sizes = { mini: '96px', compact: '150px', desktop: '(min-width: 1280px) 360px, 300px' }[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative pointer-events-none select-none', width)}
    >
      {/* A soft warm glow behind the panel, so it lifts off the video (a plain gradient: cheap to draw) */}
      <div
        aria-hidden="true"
        className="absolute -inset-5 md:-inset-8 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2),transparent_68%)]"
      />
      <img
        src="/media/hero-scroll-480.jpg"
        srcSet="/media/hero-scroll-320.jpg 320w, /media/hero-scroll-480.jpg 480w, /media/hero-scroll-720.jpg 720w"
        sizes={sizes}
        width={1363}
        height={1874}
        alt={t('siteUi.org.name')}
        decoding="async"
        className="relative block w-full h-auto rounded-[3px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.3)]"
      />
    </motion.div>
  );
}
