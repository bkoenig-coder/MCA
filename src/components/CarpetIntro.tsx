import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UlziiSymbol, SoyomboSymbol, MongolianLine } from './MongolianDesign';

export default function CarpetIntro() {
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#5c0e0e] to-[#3a0606]" />
      <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/woven-light.png')]" />
      {/* Golden border accents */}
      <div className="absolute inset-x-2 inset-y-2 md:inset-x-6 md:inset-y-6 border-4 border-brand-gold/30 pointer-events-none" />
      <div className="absolute inset-x-4 inset-y-4 md:inset-x-8 md:inset-y-8 border-[1px] border-brand-gold/40 pointer-events-none" />
      
      {/* Repeating Mongolian corner frames */}
      <div className="absolute top-6 left-6 text-brand-gold/20">
        <UlziiSymbol className="w-16 h-16 md:w-24 md:h-24" />
      </div>
      <div className="absolute top-6 right-6 text-brand-gold/20">
        <UlziiSymbol className="w-16 h-16 md:w-24 md:h-24" />
      </div>
      <div className="absolute bottom-6 left-6 text-brand-gold/20">
        <UlziiSymbol className="w-16 h-16 md:w-24 md:h-24" />
      </div>
      <div className="absolute bottom-6 right-6 text-brand-gold/20">
        <UlziiSymbol className="w-16 h-16 md:w-24 md:h-24" />
      </div>

      {/* Decorative lines at top and bottom */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[60%] flex gap-4 overflow-hidden opacity-20">
        {[...Array(6)].map((_, i) => (
          <MongolianLine key={i} className="w-20 md:w-32 h-6 flex-shrink-0 text-brand-gold" />
        ))}
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[60%] flex gap-4 overflow-hidden opacity-20">
        {[...Array(6)].map((_, i) => (
          <MongolianLine key={i} className="w-20 md:w-32 h-6 flex-shrink-0 text-brand-gold" />
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
            className="w-full h-1/2 bg-[#3a0606] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* The duplicated absolute contents structure handles the top half */}
            <div className="absolute top-0 left-0 w-full h-[200%]">
              {carpetBg}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center -translate-y-10 md:-translate-y-14">
                  <SoyomboSymbol className="w-10 h-16 md:w-16 md:h-24 text-brand-gold mb-6 opacity-80" />
                  <span className="text-xs md:text-sm uppercase tracking-[0.6em] md:tracking-[0.8em] text-brand-gold/80 font-medium">Welcome To</span>
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
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center translate-y-10 md:translate-y-14">
                  <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                    <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] text-white font-light tracking-[0.15em] md:tracking-[0.2em] drop-shadow-xl">MONGOLIAN</span>
                    <span className="text-3xl sm:text-4xl md:text-6xl lg:text-[70px] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)] mt-2 md:mt-4 pr-4">CENTER</span>
                  </h1>
                </div>
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
