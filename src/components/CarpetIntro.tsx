import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, GerSymbol } from './MongolianDesign';

export default function CarpetIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screens for heavy-lifting rendering optimization
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, mobileCheck ? 1600 : 2800); // Shorter duration on mobile
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Carpet texture overlaid on deep rich carmine red
  const carpetBg = (
    <>
      {/* Base realistic carpet red */}
      <div className="absolute inset-0 bg-[#8c0808]" /> 
      
      {/* Concentric circles pattern mimicking the uploaded pattern - Only enabled on desktop for GPU sanity */}
      {!isMobile && (
        <>
          <div 
            className="absolute inset-0 mix-blend-color-dodge opacity-[0.15] pointer-events-none" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='4' opacity='0.7'%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3Ccircle cx='30' cy='30' r='16'/%3E%3Ccircle cx='30' cy='30' r='26'/%3E%3Ccircle cx='90' cy='30' r='6'/%3E%3Ccircle cx='90' cy='30' r='16'/%3E%3Ccircle cx='90' cy='30' r='26'/%3E%3Ccircle cx='30' cy='90' r='6'/%3E%3Ccircle cx='30' cy='90' r='16'/%3E%3Ccircle cx='30' cy='90' r='26'/%3E%3Ccircle cx='90' cy='90' r='6'/%3E%3Ccircle cx='90' cy='90' r='16'/%3E%3Ccircle cx='90' cy='90' r='26'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='60' cy='60' r='20'/%3E%3Ccircle cx='60' cy='60' r='32'/%3E%3Ccircle cx='60' cy='0' r='8'/%3E%3Ccircle cx='60' cy='0' r='20'/%3E%3Ccircle cx='60' cy='0' r='32'/%3E%3Ccircle cx='60' cy='120' r='8'/%3E%3Ccircle cx='60' cy='120' r='20'/%3E%3Ccircle cx='60' cy='120' r='32'/%3E%3Ccircle cx='0' cy='60' r='8'/%3E%3Ccircle cx='0' cy='60' r='20'/%3E%3Ccircle cx='0' cy='60' r='32'/%3E%3Ccircle cx='120' cy='60' r='8'/%3E%3Ccircle cx='120' cy='60' r='20'/%3E%3Ccircle cx='120' cy='60' r='32'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}
          />
          
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none" 
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
        </>
      )}

      {/* Decorative background visual for mobile to replace heavy textures */}
      {isMobile && (
        <div className="absolute inset-0 bg-radial-gradient from-[#a31212] to-[#630404] opacity-50" />
      )}

      {/* Golden border accents */}
      <div className="absolute inset-x-2 inset-y-2 md:inset-x-6 md:inset-y-6 border-[6px] border-double border-brand-gold/30 pointer-events-none" />
      <div className="absolute inset-x-5 inset-y-5 md:inset-x-9 md:inset-y-9 border-[1px] border-brand-gold/40 pointer-events-none bg-[#3a0606]/30 mix-blend-multiply" />
      
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
          exit={{ opacity: 0, transition: { duration: isMobile ? 0.5 : 0.8, ease: "easeOut" } }}
        >
          {/* Top half */}
          <motion.div 
            className="w-full h-1/2 bg-[#3a0606] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            style={{ willChange: "transform" }}
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ 
              duration: isMobile ? 0.9 : 1.5, 
              delay: isMobile ? 0.4 : 1.0, 
              ease: [0.85, 0, 0.15, 1] 
            }}
          >
            {/* The duplicated absolute contents structure handles the top half */}
            <div className="absolute top-0 left-0 w-full h-[200%]">
              {carpetBg}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center -translate-y-36 md:-translate-y-56">
                  <div className="relative flex flex-col items-center justify-center select-none">
                    <SoyomboSymbol className="w-56 h-48 md:w-[420px] md:h-[340px] text-brand-gold opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] translate-y-10 md:translate-y-16" />
                    <GerSymbol className="absolute -bottom-4 md:-bottom-6 w-32 h-24 md:w-60 md:h-44 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]" strokeColor="#d4af37" fillColor="#fdfbf7" />
                  </div>
                  <span className="text-sm md:text-lg uppercase tracking-[0.6em] md:tracking-[0.8em] text-brand-gold/80 font-medium mt-14 md:mt-24">Welcome To</span>
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
            style={{ willChange: "transform" }}
            initial={{ y: "0%" }}
            animate={{ y: "100%" }}
            transition={{ 
              duration: isMobile ? 0.9 : 1.5, 
              delay: isMobile ? 0.4 : 1.0, 
              ease: [0.85, 0, 0.15, 1] 
            }}
          >
            {/* Dark inner shadow to simulate gap opening */}
            <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

            {/* The duplicated absolute contents structure handles the bottom half */}
            <div className="absolute bottom-0 left-0 w-full h-[200%]">
              {carpetBg}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="flex flex-col items-center translate-y-32 md:translate-y-48">
                  <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                    <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] text-white font-light tracking-[0.15em] md:tracking-[0.2em] drop-shadow-xl mb-4">MONGOLIAN</span>
                    <span className="text-3xl sm:text-4xl md:text-6xl lg:text-[70px] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)] pr-4">CENTER</span>
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
