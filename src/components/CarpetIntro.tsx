import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SoyomboSymbol, GerSymbol } from './MongolianDesign';

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

  // Carpet texture overlaid on deep rich carmine red
  const carpetBg = (
    <>
      {/* Base realistic carpet red */}
      <div className="absolute inset-0 bg-[#8c0808]" /> 
      
      {/* Concentric circles pattern mimicking the uploaded pattern */}
      <div 
        className="absolute inset-0 mix-blend-color-dodge opacity-[0.15]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='4' opacity='0.7'%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3Ccircle cx='30' cy='30' r='16'/%3E%3Ccircle cx='30' cy='30' r='26'/%3E%3Ccircle cx='90' cy='30' r='6'/%3E%3Ccircle cx='90' cy='30' r='16'/%3E%3Ccircle cx='90' cy='30' r='26'/%3E%3Ccircle cx='30' cy='90' r='6'/%3E%3Ccircle cx='30' cy='90' r='16'/%3E%3Ccircle cx='30' cy='90' r='26'/%3E%3Ccircle cx='90' cy='90' r='6'/%3E%3Ccircle cx='90' cy='90' r='16'/%3E%3Ccircle cx='90' cy='90' r='26'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='60' cy='60' r='20'/%3E%3Ccircle cx='60' cy='60' r='32'/%3E%3Ccircle cx='60' cy='0' r='8'/%3E%3Ccircle cx='60' cy='0' r='20'/%3E%3Ccircle cx='60' cy='0' r='32'/%3E%3Ccircle cx='60' cy='120' r='8'/%3E%3Ccircle cx='60' cy='120' r='20'/%3E%3Ccircle cx='60' cy='120' r='32'/%3E%3Ccircle cx='0' cy='60' r='8'/%3E%3Ccircle cx='0' cy='60' r='20'/%3E%3Ccircle cx='0' cy='60' r='32'/%3E%3Ccircle cx='120' cy='60' r='8'/%3E%3Ccircle cx='120' cy='60' r='20'/%3E%3Ccircle cx='120' cy='60' r='32'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-width='4' opacity='0.7'%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3Ccircle cx='30' cy='30' r='16'/%3E%3Ccircle cx='30' cy='30' r='26'/%3E%3Ccircle cx='90' cy='30' r='6'/%3E%3Ccircle cx='90' cy='30' r='16'/%3E%3Ccircle cx='90' cy='30' r='26'/%3E%3Ccircle cx='30' cy='90' r='6'/%3E%3Ccircle cx='30' cy='90' r='16'/%3E%3Ccircle cx='30' cy='90' r='26'/%3E%3Ccircle cx='90' cy='90' r='6'/%3E%3Ccircle cx='90' cy='90' r='16'/%3E%3Ccircle cx='90' cy='90' r='26'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='60' cy='60' r='20'/%3E%3Ccircle cx='60' cy='60' r='32'/%3E%3Ccircle cx='60' cy='0' r='8'/%3E%3Ccircle cx='60' cy='0' r='20'/%3E%3Ccircle cx='60' cy='0' r='32'/%3E%3Ccircle cx='60' cy='120' r='8'/%3E%3Ccircle cx='60' cy='120' r='20'/%3E%3Ccircle cx='60' cy='120' r='32'/%3E%3Ccircle cx='0' cy='60' r='8'/%3E%3Ccircle cx='0' cy='60' r='20'/%3E%3Ccircle cx='0' cy='60' r='32'/%3E%3Ccircle cx='120' cy='60' r='8'/%3E%3Ccircle cx='120' cy='60' r='20'/%3E%3Ccircle cx='120' cy='60' r='32'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Noise for fabric texture */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Golden border accents */}
      <div className="absolute inset-x-2 inset-y-2 md:inset-x-6 md:inset-y-6 border-[6px] border-double border-brand-gold/30 pointer-events-none" />
      <div className="absolute inset-x-5 inset-y-5 md:inset-x-9 md:inset-y-9 border-[1px] border-brand-gold/40 pointer-events-none bg-[#3a0606]/30 mix-blend-multiply" />
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
            className="w-full h-1/2 bg-[#3a0606] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
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
            className="w-full h-1/2 bg-[#3a0606] shadow-[0_-30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
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
