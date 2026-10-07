import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SoyomboSymbol, GerSymbol } from './MongolianDesign';

// ---- Mongolian carpet design: a woven field framed by traditional ornament bands ----
const NAVY = '#0A2A5C';
const BURGUNDY = '#6E1B2C';
const GOLD = '#E0B94A';

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * Ornament tiles. Each is drawn horizontally; the vertical version rotates the same drawing,
 * so the pattern reads correctly on all four sides of the frame.
 *  - curl: a row of curling waves (khuiten / cloud-scroll motif)
 *  - plait: two interlaced waves (the endless "ulzii" plait)
 */
const ORNAMENTS = {
  curl: {
    w: 40,
    h: 20,
    art:
      '<path d="M0 18.5H40"/>' +
      '<path d="M6 18.5C6 9 12 3.5 20 4.5C28 5.5 29.5 13.5 23.5 14.5C18.5 15.3 16.5 9.5 20.5 8.8"/>' +
      '<path d="M32 18.5C32 14 35 12 38 13"/>',
    sw: 3,
  },
  plait: {
    w: 32,
    h: 16,
    art: '<path d="M0 8C5 0 11 0 16 8S27 16 32 8"/><path d="M0 8C5 16 11 16 16 8S27 0 32 8"/>',
    sw: 2.8,
  },
} as const;

const ornamentTile = (kind: keyof typeof ORNAMENTS, vertical: boolean) => {
  const { w, h, art, sw } = ORNAMENTS[kind];
  const body = `<g fill="none" stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${art}</g>`;
  const svg = vertical
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${w}" viewBox="0 0 ${h} ${w}"><g transform="translate(${h} 0) rotate(90)">${body}</g></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  return dataUri(svg);
};
const TILES = {
  curl: { h: ornamentTile('curl', false), v: ornamentTile('curl', true), ratio: ORNAMENTS.curl.w / ORNAMENTS.curl.h },
  plait: { h: ornamentTile('plait', false), v: ornamentTile('plait', true), ratio: ORNAMENTS.plait.w / ORNAMENTS.plait.h },
};

// Field weave: small lozenges, light thread and dark shadow thread
const lozenge = (stroke: string) =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g fill="none" stroke="${stroke}" stroke-width="2"><path d="M28 4L52 28L28 52L4 28Z"/><path d="M28 14L42 28L28 42L14 28Z"/></g><circle cx="28" cy="28" r="2.5" fill="${stroke}"/></svg>`
  );
const LOZENGE_LIGHT = lozenge('#8FB6E6');
const LOZENGE_DARK = lozenge('#021430');

/** Nested squares with a diamond: the corner stone where two ornament bands meet. */
const CornerStone = ({ className = '', size }: { className?: string; size: number }) => (
  <svg viewBox="0 0 40 40" className={className} width={size} height={size} aria-hidden="true">
    <rect width="40" height="40" fill="#07204A" />
    <rect x="3" y="3" width="34" height="34" fill="none" stroke={GOLD} strokeWidth="2" />
    <rect x="8" y="8" width="24" height="24" fill={BURGUNDY} stroke={GOLD} strokeWidth="1.2" />
    <path d="M20 11L29 20L20 29L11 20Z" fill={GOLD} />
    <path d="M20 16L24 20L20 24L16 20Z" fill={BURGUNDY} />
  </svg>
);

/** A diamond medallion used in the middle of the phone cartouches. */
const DiamondSeal = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <path d="M20 2L38 20L20 38L2 20Z" fill={BURGUNDY} stroke={GOLD} strokeWidth="2" />
    <path d="M20 9L31 20L20 31L9 20Z" fill="none" stroke={GOLD} strokeWidth="1.5" />
    <path d="M20 15L25 20L20 25L15 20Z" fill={GOLD} />
  </svg>
);

/** A rectangular ornament band with a corner stone in each corner. */
const OrnamentFrame = ({ band, kind, className, style }: { band: number; kind: keyof typeof TILES; className?: string; style?: React.CSSProperties }) => {
  const t = TILES[kind];
  const th = band * 0.8;
  const h = { backgroundColor: BURGUNDY, backgroundImage: t.h, backgroundSize: `${th * t.ratio}px ${th}px`, backgroundRepeat: 'repeat-x', backgroundPosition: 'center' } as const;
  const v = { backgroundColor: BURGUNDY, backgroundImage: t.v, backgroundSize: `${th}px ${th * t.ratio}px`, backgroundRepeat: 'repeat-y', backgroundPosition: 'center' } as const;
  return (
    <div className={`absolute ${className ?? ''}`} style={style}>
      <div className="absolute inset-x-0 top-0" style={{ height: band, ...h }} />
      <div className="absolute inset-x-0 bottom-0" style={{ height: band, ...h }} />
      <div className="absolute inset-y-0 left-0" style={{ width: band, ...v }} />
      <div className="absolute inset-y-0 right-0" style={{ width: band, ...v }} />
      {['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'].map((pos) => (
        <CornerStone key={pos} size={band} className={`absolute ${pos}`} />
      ))}
    </div>
  );
};

export default function CarpetIntro() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const phone = typeof window !== 'undefined' && window.innerWidth < 768;
  const frameInset = phone ? 12 : 24; // distance of the outer ornament band from the screen edge
  const outerBand = phone ? 20 : 30; // curling-wave band
  const innerBand = phone ? 11 : 14; // plait band
  const innerInset = frameInset + outerBand + 4;
  const lineInset = innerInset + innerBand + 5;

  // Deep blue wool carpet: lozenge-woven field framed by a curl band and a plait band
  const carpetBg = (
    <>
      {/* Field */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, #11407F 0%, ${NAVY} 60%, #061936 100%)` }} />
      <div className="absolute inset-0 opacity-[0.22] mix-blend-screen" style={{ backgroundImage: LOZENGE_LIGHT, backgroundSize: '56px 56px' }} />
      <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: LOZENGE_DARK, backgroundSize: '56px 56px', backgroundPosition: '2px 2px' }} />

      {/* Fabric noise */}
      <div
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Border: gold edge, curling-wave band, plait band, fine gold line */}
      <div className="absolute border-[3px]" style={{ inset: frameInset / 2, borderColor: GOLD }} />
      <OrnamentFrame kind="curl" band={outerBand} style={{ inset: frameInset }} />
      <OrnamentFrame kind="plait" band={innerBand} style={{ inset: innerInset }} />
      <div className="absolute border" style={{ inset: lineInset, borderColor: `${GOLD}aa` }} />

      {/* Phones: a diamond seal flanked by meander, top and bottom of the field */}
      <div className="md:hidden">
        {['top-[7.5%]', 'bottom-[7.5%]'].map((pos) => (
          <div key={pos} className={`absolute ${pos} left-12 right-12 flex items-center gap-3`}>
            <div className="flex-1 h-3" style={{ backgroundImage: TILES.plait.h, backgroundSize: '27px 13.5px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }} />
            <DiamondSeal className="w-9 h-9 shrink-0" />
            <div className="flex-1 h-3" style={{ backgroundImage: TILES.plait.h, backgroundSize: '27px 13.5px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[99999] pointer-events-none flex flex-col"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          {/* Top half */}
          <motion.div 
            className="w-full h-1/2 bg-[#041f44] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* The duplicated absolute contents structure handles the top half */}
            <div className="absolute top-0 left-0 w-full h-[200%]">
              {carpetBg}
              {/* Sits just above the fringe at the seam; sizes follow the screen height so proportions hold on any screen */}
              <div className="absolute left-0 right-0 bottom-1/2 flex flex-col items-center px-4 pb-[clamp(2.5rem,9vh,5.5rem)]">
                <div className="relative select-none h-[min(26vh,18rem)] md:h-[min(21vh,15rem)] aspect-[400/330]">
                  <SoyomboSymbol className="absolute inset-0 w-full h-full text-brand-gold opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                  <GerSymbol className="absolute left-1/2 -translate-x-1/2 -bottom-[3%] w-[58%] h-[52%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]" strokeColor="#d4af37" fillColor="#fdfbf7" />
                </div>
              </div>
            </div>

            {/* Fringe for top half */}
            <div 
              className="absolute bottom-0 left-0 w-full h-4 md:h-6 z-30 border-b border-black/50" 
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 2px, transparent 2px, transparent 6px), linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))',
              }} 
            />
            {/* Thick golden border right above fringe */}
            <div className="absolute bottom-4 md:bottom-6 left-0 w-full h-2 md:h-3 bg-gradient-to-r from-[#8a681c] via-brand-gold to-[#8a681c] shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-30 border-y border-[#ffe28a]/40" />

          </motion.div>

          {/* Bottom half */}
          <motion.div 
            className="w-full h-1/2 bg-[#041f44] shadow-[0_-30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            initial={{ y: "0%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* Dark inner shadow to simulate gap opening */}
            <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

            {/* The duplicated absolute contents structure handles the bottom half */}
            <div className="absolute bottom-0 left-0 w-full h-[200%]">
              {carpetBg}
              <div className="absolute left-0 right-0 top-1/2 flex flex-col items-center px-4 pt-[clamp(3.5rem,11vh,6rem)]">
                <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                  <span className={`${t('siteUi.footer.monogram1').length > 9 ? 'text-[min(7vw,8vh)]' : 'text-[min(9.5vw,8vh)]'} md:text-[min(7.5vw,8vh)] text-white font-light tracking-[0.12em] md:tracking-[0.2em] drop-shadow-xl mb-[1.5vh]`}>{t('siteUi.footer.monogram1')}</span>
                  <span className="text-[min(7vw,6vh)] md:text-[min(5.5vw,6vh)] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">{t('siteUi.footer.monogram2')}</span>
                </h1>
              </div>
            </div>

            {/* Fringe for bottom half */}
            <div 
              className="absolute top-0 left-0 w-full h-4 md:h-6 z-30 border-t border-black/50" 
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 2px, transparent 2px, transparent 6px), linear-gradient(to top, transparent, rgba(0,0,0,0.6))',
              }} 
            />
            {/* Thick golden border right below fringe */}
            <div className="absolute top-4 md:top-6 left-0 w-full h-2 md:h-3 bg-gradient-to-r from-[#8a681c] via-brand-gold to-[#8a681c] shadow-[0_-4px_15px_rgba(0,0,0,0.8)] z-30 border-y border-[#ffe28a]/40" />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
