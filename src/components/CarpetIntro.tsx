import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoyomboSymbol, GerSymbol } from './MongolianDesign';
import NaadamMedallions from './NaadamIllustrations';

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

  // Carpet texture overlaid on a deep brand blue
  const carpetBg = (
    <>
      {/* Base carpet blue */}
      <div className="absolute inset-0 bg-[#0A57A0]" /> 
      
      {/* Traditional cloud-scroll pattern, tiled */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%2296%22 viewBox=%220 0 150 96%22%3E%3Cg fill=%22none%22 stroke=%22%23D4AF37%22 stroke-opacity=%220.13%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cg transform=%22scale(0.6)%22%3E%3Cpath d=%22M6 74C6 66 14 64 18 68C21 71 17 76 13 74%22/%3E%3Cpath d=%22M18 78H202%22/%3E%3Cpath d=%22M214 74C214 66 206 64 202 68C199 71 203 76 207 74%22/%3E%3Cpath d=%22M30 78C24 56 44 40 62 50C74 57 70 74 58 72C49 70 50 60 58 60%22/%3E%3Cpath d=%22M72 78C66 42 98 18 128 30C148 38 148 64 130 64C116 64 114 48 126 46C134 45 138 52 133 56%22/%3E%3Cpath d=%22M150 78C150 57 172 44 188 54C198 60 194 74 183 72C175 70 176 61 184 61%22/%3E%3C/g%3E%3Cg transform=%22translate(75 48) scale(0.6)%22%3E%3Cpath d=%22M6 74C6 66 14 64 18 68C21 71 17 76 13 74%22/%3E%3Cpath d=%22M18 78H202%22/%3E%3Cpath d=%22M214 74C214 66 206 64 202 68C199 71 203 76 207 74%22/%3E%3Cpath d=%22M30 78C24 56 44 40 62 50C74 57 70 74 58 72C49 70 50 60 58 60%22/%3E%3Cpath d=%22M72 78C66 42 98 18 128 30C148 38 148 64 130 64C116 64 114 48 126 46C134 45 138 52 133 56%22/%3E%3Cpath d=%22M150 78C150 57 172 44 188 54C198 60 194 74 183 72C175 70 176 61 184 61%22/%3E%3C/g%3E%3Cg transform=%22translate(-75 48) scale(0.6)%22%3E%3Cpath d=%22M6 74C6 66 14 64 18 68C21 71 17 76 13 74%22/%3E%3Cpath d=%22M18 78H202%22/%3E%3Cpath d=%22M214 74C214 66 206 64 202 68C199 71 203 76 207 74%22/%3E%3Cpath d=%22M30 78C24 56 44 40 62 50C74 57 70 74 58 72C49 70 50 60 58 60%22/%3E%3Cpath d=%22M72 78C66 42 98 18 128 30C148 38 148 64 130 64C116 64 114 48 126 46C134 45 138 52 133 56%22/%3E%3Cpath d=%22M150 78C150 57 172 44 188 54C198 60 194 74 183 72C175 70 176 61 184 61%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: "150px 96px" }}
      />

      {/* Soft vignette for depth */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(3,22,48,0.55) 100%)" }} />
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
            className="w-full h-1/2 bg-[#06284f] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
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
            className="w-full h-1/2 bg-[#06284f] shadow-[0_-30px_60px_rgba(0,0,0,0.9)] overflow-hidden relative z-10"
            initial={{ y: "0%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* Dark inner shadow to simulate gap opening */}
            <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

            {/* The duplicated absolute contents structure handles the bottom half */}
            <div className="absolute bottom-0 left-0 w-full h-[200%]">
              {carpetBg}
              {/* Starts just under the fringe at the seam and sizes itself to the screen height */}
              <div className="absolute left-0 right-0 top-1/2 flex flex-col items-center px-4 pt-[clamp(3.25rem,10vh,6.5rem)]">
                <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                  <span className="text-[min(6.2vw,8.5vh)] text-white font-light tracking-[0.1em] md:tracking-[0.14em] drop-shadow-xl mb-[1.2vh] whitespace-nowrap">MONGOLISCHE ZENTRUM</span>
                  <span className="text-[min(5.4vw,7vh)] text-brand-gold italic font-light tracking-[0.18em] md:tracking-[0.24em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">IN ÖSTERREICH</span>
                </h1>
                <NaadamMedallions className="mt-[3vh]" />
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
