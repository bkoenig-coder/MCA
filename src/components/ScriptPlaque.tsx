import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

// Traditional (vertical) Mongolian script: "Mongol Töv" (Mongolian Center)
const SCRIPT = 'ᠮᠣᠩᠭᠣᠯ ᠲᠥᠪ';

const Diamond = ({ className = '' }: { className?: string }) => (
  <i aria-hidden="true" className={cn('block w-1.5 h-1.5 rotate-45 bg-brand-gold', className)} />
);

/** A line with a small diamond at one end, used above and below the script. */
const Thread = ({ flip = false, h = 'h-10' }: { flip?: boolean; h?: string }) => (
  <div aria-hidden="true" className={cn('flex flex-col items-center', flip && 'flex-col-reverse')}>
    <Diamond />
    <div className={cn('w-px bg-gradient-to-b from-brand-gold/70 to-brand-gold/0', h, flip && 'rotate-180')} />
  </div>
);

/**
 * The vertical Mongolian-script plaque on the home page: a dark stele with a double gold frame,
 * gold lettering that slowly catches the light, and the Cyrillic name underneath.
 */
export default function ScriptPlaque({ compact = false, mini = false }: { compact?: boolean; mini?: boolean }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative isolate overflow-hidden rounded-md border border-brand-gold/55 pointer-events-auto',
        'bg-[linear-gradient(180deg,#101c3a_0%,#0a1128_100%)] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.65)]',
        mini ? 'w-[68px] px-1.5 py-4' : compact ? 'w-[132px] px-3 py-6' : 'w-[230px] xl:w-[260px] px-6 py-7'
      )}
    >
      {/* inner frame */}
      <div aria-hidden="true" className="absolute inset-2 rounded-[3px] border border-brand-gold/25 pointer-events-none" />
      {/* corner diamonds */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos) => (
        <Diamond key={pos} className={cn('absolute w-1 h-1', pos)} />
      ))}
      {/* soft light behind the lettering */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(212,175,55,0.16),transparent_65%)] pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

      <div className="relative flex flex-col items-center">
        {!mini && <span className={cn('uppercase font-bold text-brand-gold border border-brand-gold/40 rounded-sm bg-black/20', compact ? 'text-[7px] tracking-[0.3em] px-2 py-1' : 'text-[10px] tracking-[0.4em] px-4 py-1.5')}>
          {compact ? t('siteUi.home.estShort') : t('siteUi.home.established')}
        </span>}

        <div className="my-3">
          <Thread h={mini ? 'h-4' : compact ? 'h-5' : 'h-8'} />
        </div>

        <motion.h2
          lang="mn-Mong"
          aria-label="Mongol Töv"
          className="select-none leading-none text-center"
          style={{
            writingMode: 'vertical-lr',
            fontFamily: '"Noto Sans Mongolian", "Mongolian Baiti", serif',
            fontSize: mini ? '38px' : compact ? '64px' : 'clamp(54px, 8vh, 104px)',
            letterSpacing: 'normal',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundImage:
              'linear-gradient(180deg, #8a6a14 0%, #e9cf7a 22%, #fff3c4 38%, #d4af37 55%, #f0d98a 72%, #9a7410 100%)',
            backgroundSize: '100% 260%',
            filter: 'drop-shadow(0 2px 14px rgba(212,175,55,0.35))',
          }}
          animate={reduce ? undefined : { backgroundPosition: ['50% 0%', '50% 100%', '50% 0%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          {SCRIPT}
        </motion.h2>

        <div className="my-3">
          <Thread flip h={mini ? 'h-4' : compact ? 'h-5' : 'h-8'} />
        </div>

        {!mini && (<>
        <div className="font-serif italic text-brand-gold/90 text-center leading-tight" style={{ fontSize: compact ? 13 : 20 }}>
          Монгол Төв
        </div>
        <span className={cn('mt-3 uppercase font-bold text-brand-gold border border-brand-gold/55 rounded-sm', compact ? 'text-[7px] tracking-[0.3em] px-2 py-1' : 'text-[10px] tracking-[0.5em] px-4 py-1.5')}>
          {t('siteUi.home.official')}
        </span></>)}
      </div>
    </motion.div>
  );
}
