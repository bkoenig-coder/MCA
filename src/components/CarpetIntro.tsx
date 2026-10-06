import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SoyomboSymbol, GerSymbol, MeanderBand } from './MongolianDesign';
import { CuteCloud } from './CuteClouds';

/** One tile of the woven cloud-scroll pattern: two rows of curling clouds, the lower row shifted half a tile. */
const cloudTile = (stroke: string) => {
  const cloud =
    '<path d="M6 74C6 66 14 64 18 68C21 71 17 76 13 74M18 78H202M214 74C214 66 206 64 202 68C199 71 203 76 207 74"/>' +
    '<path d="M30 78C24 56 44 40 62 50C74 57 70 74 58 72C49 70 50 60 58 60"/>' +
    '<path d="M72 78C66 42 98 18 128 30C148 38 148 64 130 64C116 64 114 48 126 46C134 45 138 52 133 56"/>' +
    '<path d="M150 78C150 57 172 44 188 54C198 60 194 74 183 72C175 70 176 61 184 61"/>';
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140">' +
    `<g fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">` +
    `<g transform="translate(6 6) scale(0.82)">${cloud}</g>` +
    `<g transform="translate(-94 76) scale(0.82)">${cloud}</g>` +
    `<g transform="translate(106 76) scale(0.82)">${cloud}</g>` +
    '</g></svg>';
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const CLOUD_TILE_LIGHT = cloudTile('#9CC8F5');
const CLOUD_TILE_DARK = cloudTile('#021A3A');

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

  // Deep blue wool carpet woven with a Mongolian cloud-scroll pattern, cute gold clouds and a golden border
  const carpetBg = (
    <>
      {/* Base blue wool, lighter in the middle like a lit carpet */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0F5BAA_0%,#0A417F_55%,#062A57_100%)]" />

      {/* Cloud-scroll weave: light thread and a dark shadow thread, offset like real pile */}
      <div
        className="absolute inset-0 opacity-[0.3] mix-blend-screen"
        style={{ backgroundImage: CLOUD_TILE_LIGHT, backgroundSize: '200px 140px' }}
      />
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{ backgroundImage: CLOUD_TILE_DARK, backgroundSize: '200px 140px', backgroundPosition: '2px 2px' }}
      />

      {/* Noise for fabric texture */}
      <div
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Woven cloud medallions in gold, one in each corner of the field */}
      <CuteCloud variant="b" tone="gold" className="absolute left-[7%] top-[14%] w-[20vw] max-w-[260px] min-w-[96px] opacity-90" />
      <CuteCloud variant="c" tone="gold" className="absolute right-[7%] top-[20%] w-[16vw] max-w-[210px] min-w-[80px] opacity-90" />
      <CuteCloud variant="a" tone="gold" className="absolute left-[9%] bottom-[12%] w-[17vw] max-w-[220px] min-w-[84px] opacity-90" />
      <CuteCloud variant="b" tone="gold" className="absolute right-[6%] bottom-[16%] w-[19vw] max-w-[250px] min-w-[92px] opacity-90" />

      {/* Golden border accents and a meander band inside the frame */}
      <div className="absolute inset-x-2 inset-y-2 md:inset-x-6 md:inset-y-6 border-[6px] border-double border-brand-gold/40 pointer-events-none" />
      <div className="absolute inset-x-5 inset-y-5 md:inset-x-9 md:inset-y-9 border-[1px] border-brand-gold/50 pointer-events-none bg-[#031a38]/25 mix-blend-multiply" />
      <MeanderBand className="absolute left-6 right-6 top-6 md:left-11 md:right-11 md:top-11 bg-brand-gold/60" />
      <MeanderBand className="absolute left-6 right-6 bottom-6 md:left-11 md:right-11 md:bottom-11 bg-brand-gold/60" />
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
                <div className="relative select-none h-[min(34vh,24rem)] aspect-[400/330]">
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
              <div className="absolute left-0 right-0 top-1/2 flex flex-col items-center px-4 pt-[clamp(3rem,10vh,6.5rem)]">
                <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                  <span className="text-[min(9.5vw,12vh)] text-white font-light tracking-[0.15em] md:tracking-[0.2em] drop-shadow-xl mb-[1.5vh]">{t('siteUi.footer.monogram1')}</span>
                  <span className="text-[min(7vw,8.5vh)] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">{t('siteUi.footer.monogram2')}</span>
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
