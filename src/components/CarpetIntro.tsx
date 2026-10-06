import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SoyomboSymbol, GerSymbol } from './MongolianDesign';

// ---- Mongolian carpet design: a field with a central medallion, framed by meander (alkhan khee) borders ----
const NAVY = '#0A2A5C';
const BURGUNDY = '#6E1B2C';
const CREAM = '#F1E3C0';
const TEAL = '#6FB3B8';
const GOLD = '#E0B94A';

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Meander key, horizontal (24x12) and vertical (12x24) tiles
const MEANDER_H = dataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12"><path d="M0 11H3V1.5H21V11H24M8 11V5H16V11" fill="none" stroke="${GOLD}" stroke-width="1.7" stroke-linejoin="miter"/></svg>`
);
const MEANDER_V = dataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><path d="M11 0V3H1.5V21H11V24M11 8H5V16H11" fill="none" stroke="${GOLD}" stroke-width="1.7" stroke-linejoin="miter"/></svg>`
);

// Field weave: small lozenges, light thread and dark shadow thread
const lozenge = (stroke: string) =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g fill="none" stroke="${stroke}" stroke-width="2"><path d="M28 4L52 28L28 52L4 28Z"/><path d="M28 14L42 28L28 42L14 28Z"/></g><circle cx="28" cy="28" r="2.5" fill="${stroke}"/></svg>`
  );
const LOZENGE_LIGHT = lozenge('#8FB6E6');
const LOZENGE_DARK = lozenge('#021430');

/** Eight-petal rosette used in the corners of the borders. */
const Rosette = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill={BURGUNDY} />
    <circle cx="50" cy="50" r="46" fill="none" stroke={GOLD} strokeWidth="3" />
    {Array.from({ length: 8 }).map((_, i) => (
      <ellipse key={i} cx="50" cy="26" rx="9" ry="17" fill={i % 2 ? TEAL : CREAM} transform={`rotate(${i * 45} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="13" fill={NAVY} />
    <circle cx="50" cy="50" r="7" fill={GOLD} />
  </svg>
);

/** A rectangular band of meander key with a rosette in each corner. */
const MeanderFrame = ({ band, className }: { band: number; className: string }) => {
  const h = { backgroundColor: BURGUNDY, backgroundImage: MEANDER_H, backgroundSize: `${band * 1.3}px ${band * 0.65}px`, backgroundRepeat: 'repeat-x', backgroundPosition: 'center' } as const;
  const v = { backgroundColor: BURGUNDY, backgroundImage: MEANDER_V, backgroundSize: `${band * 0.65}px ${band * 1.3}px`, backgroundRepeat: 'repeat-y', backgroundPosition: 'center' } as const;
  const corner = { width: band, height: band, backgroundColor: CREAM } as const;
  return (
    <div className={`absolute ${className}`}>
      <div className="absolute inset-x-0 top-0" style={{ height: band, ...h }} />
      <div className="absolute inset-x-0 bottom-0" style={{ height: band, ...h }} />
      <div className="absolute inset-y-0 left-0" style={{ width: band, ...v }} />
      <div className="absolute inset-y-0 right-0" style={{ width: band, ...v }} />
      {['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'].map((pos) => (
        <div key={pos} className={`absolute ${pos} p-[3px]`} style={corner}>
          <Rosette className="w-full h-full" />
        </div>
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

  const outerBand = typeof window !== 'undefined' && window.innerWidth < 768 ? 26 : 38;
  const medBand = typeof window !== 'undefined' && window.innerWidth < 768 ? 22 : 30;

  // Deep blue wool carpet: lozenge-woven field, central medallion and a meander border
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

      {/* Outer border: gold edge, meander band, cream and gold guard lines */}
      <div className="absolute inset-1.5 md:inset-3 border-[3px]" style={{ borderColor: GOLD }} />
      <MeanderFrame band={outerBand} className="inset-3 md:inset-6" />
      <div className="absolute border" style={{ inset: outerBand + (outerBand > 30 ? 28 : 18), borderColor: `${CREAM}99` }} />
      <div className="absolute border-2" style={{ inset: outerBand + (outerBand > 30 ? 33 : 22), borderColor: `${GOLD}aa` }} />

      {/* Central medallion: a framed lozenge field that holds the emblem and the name */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,62rem)] h-[min(78vh,40rem)]">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, #0D3470 0%, #071F46 100%)`, boxShadow: '0 0 0 3px #E0B94A55, 0 18px 50px rgba(0,0,0,0.45)' }} />
        <MeanderFrame band={medBand} className="inset-0" />
        <div className="absolute border" style={{ inset: medBand + 8, borderColor: `${CREAM}88` }} />
      </div>

      {/* Rosettes in the four corners of the field */}
      <Rosette className="absolute w-12 h-12 md:w-20 md:h-20 left-[14%] top-[16%] opacity-95" />
      <Rosette className="absolute w-12 h-12 md:w-20 md:h-20 right-[14%] top-[16%] opacity-95" />
      <Rosette className="absolute w-12 h-12 md:w-20 md:h-20 left-[14%] bottom-[16%] opacity-95" />
      <Rosette className="absolute w-12 h-12 md:w-20 md:h-20 right-[14%] bottom-[16%] opacity-95" />
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
                <div className="relative select-none h-[min(21vh,15rem)] aspect-[400/330]">
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
                  <span className="text-[min(7.5vw,8vh)] text-white font-light tracking-[0.15em] md:tracking-[0.2em] drop-shadow-xl mb-[1.5vh]">{t('siteUi.footer.monogram1')}</span>
                  <span className="text-[min(5.5vw,6vh)] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">{t('siteUi.footer.monogram2')}</span>
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
