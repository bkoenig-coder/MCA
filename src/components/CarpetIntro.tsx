import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SoyomboSymbol, GerSymbol } from './MongolianDesign';

// ---- Mongolian carpet: a woven indigo field framed by wool stripes and a band of lozenges ----
// Dyed-wool colours (indigo, madder red, saffron, ivory) rather than metallic gold; the emblem keeps its gold.
const NAVY = '#0A2A5C';
const INK = '#0B1636'; // near-black indigo for the dark pin stripes
const CRIMSON = '#A3202D';
const SAFFRON = '#E0A92E';
const IVORY = '#F1E6CC';

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * The woven lozenge band: an ivory ground, an indigo diamond with a crimson heart, and saffron beads between
 * the diamonds. The tile is square; the vertical version puts the beads top and bottom.
 */
const lozengeTile = (vertical: boolean) => {
  const beads = vertical
    ? `<circle cx="13" cy="0" r="2" fill="${SAFFRON}"/><circle cx="13" cy="26" r="2" fill="${SAFFRON}"/>`
    : `<circle cx="0" cy="13" r="2" fill="${SAFFRON}"/><circle cx="26" cy="13" r="2" fill="${SAFFRON}"/>`;
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><rect width="26" height="26" fill="${IVORY}"/><path d="M13 2L24 13L13 24L2 13Z" fill="none" stroke="${INK}" stroke-width="2.2"/><path d="M13 8L18 13L13 18L8 13Z" fill="${CRIMSON}"/>${beads}</svg>`
  );
};

// Field weave: small lozenges, light thread and dark shadow thread
const lozenge = (stroke: string) =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g fill="none" stroke="${stroke}" stroke-width="2"><path d="M28 4L52 28L28 52L4 28Z"/><path d="M28 14L42 28L28 42L14 28Z"/></g><circle cx="28" cy="28" r="2.5" fill="${stroke}"/></svg>`
  );
const LOZENGE_LIGHT = lozenge('#8FB6E6');
const LOZENGE_DARK = lozenge('#021430');

// ---- The border: wool stripes from the outer edge inwards, with the lozenge band in the middle ----
type Stripe = { w: number; color?: string; band?: boolean };
const STRIPES: Stripe[] = [
  { w: 5, color: IVORY },
  { w: 9, color: CRIMSON },
  { w: 3, color: INK },
  { w: 26, band: true },
  { w: 3, color: INK },
  { w: 4, color: SAFFRON },
  { w: 3, color: CRIMSON },
];

/** Corner stone where the two lozenge bands meet: indigo square, saffron outline and diamond, crimson heart. */
const CornerStone = ({ size, className = '' }: { size: number; className?: string }) => {
  const m = size / 2;
  const r = Math.max(2, size / 2 - 4);
  const h = r / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className} aria-hidden="true">
      <rect width={size} height={size} fill={INK} />
      <rect x="1.5" y="1.5" width={size - 3} height={size - 3} fill="none" stroke={SAFFRON} strokeWidth="1.3" />
      <path d={`M${m} ${m - r}L${m + r} ${m}L${m} ${m + r}L${m - r} ${m}Z`} fill={SAFFRON} />
      <path d={`M${m} ${m - h}L${m + h} ${m}L${m} ${m + h}L${m - h} ${m}Z`} fill={CRIMSON} />
    </svg>
  );
};

/** The woven border. `u` scales every stripe, `inset` is the distance from the screen edge. */
const WovenFrame = ({ u, inset }: { u: number; inset: number }) => {
  let off = 0;
  const rings = STRIPES.map((s, i) => {
    const w = Math.max(2, Math.round(s.w * u));
    const ring = (() => {
      if (!s.band) {
        // plain stripe: a border drawn all the way round (the corners join diagonally)
        return <div key={i} className="absolute" style={{ inset: off, border: `${w}px solid ${s.color}` }} />;
      }
      const common = { backgroundColor: IVORY, backgroundSize: `${w}px ${w}px` } as const;
      const horizontal = { ...common, backgroundImage: lozengeTile(false), backgroundRepeat: 'round no-repeat' } as const;
      const vertical = { ...common, backgroundImage: lozengeTile(true), backgroundRepeat: 'no-repeat round' } as const;
      return (
        <div key={i} className="absolute" style={{ inset: off }}>
          <div className="absolute top-0" style={{ left: w, right: w, height: w, ...horizontal }} />
          <div className="absolute bottom-0" style={{ left: w, right: w, height: w, ...horizontal }} />
          <div className="absolute left-0" style={{ top: w, bottom: w, width: w, ...vertical }} />
          <div className="absolute right-0" style={{ top: w, bottom: w, width: w, ...vertical }} />
          {['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'].map((pos) => (
            <CornerStone key={pos} size={w} className={`absolute ${pos}`} />
          ))}
        </div>
      );
    })();
    off += w;
    return ring;
  });
  return (
    <div className="absolute" style={{ inset, boxShadow: '0 0 0 1px rgba(2,20,48,0.6), 0 2px 10px rgba(0,0,0,0.45)' }}>
      {rings}
    </div>
  );
};

// The cut edge of the carpet where it opens: a striped selvedge and wool tassels
const FRINGE_THREADS = `repeating-linear-gradient(90deg, ${IVORY} 0px, ${IVORY} 2px, transparent 2px, transparent 6px, ${CRIMSON} 6px, ${CRIMSON} 8px, transparent 8px, transparent 12px)`;
const SELVEDGE_DOWN = `linear-gradient(to bottom, ${CRIMSON} 0%, ${CRIMSON} 50%, ${IVORY} 50%, ${IVORY} 78%, ${SAFFRON} 78%, ${SAFFRON} 100%)`;
const SELVEDGE_UP = `linear-gradient(to top, ${CRIMSON} 0%, ${CRIMSON} 50%, ${IVORY} 50%, ${IVORY} 78%, ${SAFFRON} 78%, ${SAFFRON} 100%)`;

export default function CarpetIntro() {
  const { t } = useTranslation();
  // Shown once per visit: coming back to another page or reloading goes straight to the site
  const [isVisible, setIsVisible] = useState(() => {
    try {
      // Visitors who asked for less motion skip the sliding-carpet opening and go straight to the site
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
      return sessionStorage.getItem('mca-intro-seen') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isVisible) return;
    try {
      sessionStorage.setItem('mca-intro-seen', '1');
    } catch {
      /* private mode: ignore */
    }
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const phone = typeof window !== 'undefined' && window.innerWidth < 768;
  const frameInset = phone ? 8 : 14; // distance of the border from the screen edge
  const stripeScale = phone ? 0.62 : 1.15; // phones get a slimmer border

  // Deep blue wool carpet: lozenge-woven field framed by wool stripes and a lozenge band
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

      {/* Border: wool stripes round a band of woven lozenges */}
      <WovenFrame u={stripeScale} inset={frameInset} />

      {/* Fine warp and weft threads over everything, so the stripes read as woven wool */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />
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
              <div className="absolute left-0 right-0 bottom-1/2 flex flex-col items-center px-4 pb-[clamp(2.5rem,9vh,5.5rem)] md:pb-[clamp(3.25rem,6vh,4.5rem)]">
                <div className="relative select-none h-[min(26vh,18rem)] md:h-[min(calc(44vh_-_110px),25rem)] aspect-[400/330]">
                  <SoyomboSymbol className="absolute inset-0 w-full h-full text-brand-gold opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                  <GerSymbol className="absolute left-1/2 -translate-x-1/2 -bottom-[3%] w-[58%] h-[52%] drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]" strokeColor="#d4af37" fillColor="#fdfbf7" />
                </div>
              </div>
            </div>

            {/* Tassels for top half */}
            <div
              className="absolute bottom-0 left-0 w-full h-4 md:h-6 z-30 border-b border-black/50"
              style={{
                backgroundImage: `${FRINGE_THREADS}, linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))`,
              }}
            />
            {/* Striped selvedge right above the tassels */}
            <div
              className="absolute bottom-4 md:bottom-6 left-0 w-full h-2 md:h-3 shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-30"
              style={{ backgroundImage: SELVEDGE_DOWN }}
            />

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

            {/* Tassels for bottom half */}
            <div
              className="absolute top-0 left-0 w-full h-4 md:h-6 z-30 border-t border-black/50"
              style={{
                backgroundImage: `${FRINGE_THREADS}, linear-gradient(to top, transparent, rgba(0,0,0,0.6))`,
              }}
            />
            {/* Striped selvedge right below the tassels */}
            <div
              className="absolute top-4 md:top-6 left-0 w-full h-2 md:h-3 shadow-[0_-4px_15px_rgba(0,0,0,0.8)] z-30"
              style={{ backgroundImage: SELVEDGE_UP }}
            />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
