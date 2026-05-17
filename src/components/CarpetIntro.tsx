import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[99999] pointer-events-none flex flex-col"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          {/* Top half */}
          <motion.div 
            className="w-full h-1/2 bg-[#050B14] border-b-[1px] border-[#a2bcfc]/30 overflow-hidden relative origin-top z-10 shadow-2xl"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* Dark Blue Night Sky & Clouds Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#02050A] to-[#0A1128]" />
            <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[120%] md:w-full h-[150%] bg-[#a2bcfc]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[60%] h-[80%] bg-brand-gold/10 blur-[90px] rounded-full pointer-events-none mix-blend-screen" />
            
            {/* Elegant Inner Border */}
            <div className="absolute inset-x-4 inset-y-4 md:inset-x-8 md:inset-y-8 border-[0.5px] border-white/10 rounded-t-3xl opacity-80 pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-[200%] flex flex-col items-center justify-center px-4">
              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm uppercase tracking-[0.6em] md:tracking-[0.8em] text-[#a2bcfc]/80 font-medium mb-8">Welcome To</span>
                <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                  <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] text-white font-light tracking-[0.15em] md:tracking-[0.2em]">MONGOLIAN</span>
                  <span className="text-3xl sm:text-4xl md:text-6xl lg:text-[80px] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)] mt-4 md:mt-6 pr-4">CENTER</span>
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Bottom half */}
          <motion.div 
            className="w-full h-1/2 bg-[#050B14] border-t-[1px] border-[#02050A] overflow-hidden relative origin-bottom z-10 shadow-2xl"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.85, 0, 0.15, 1] }}
          >
            {/* Dark Blue Night Sky & Clouds Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] to-[#0A1128]" />
            <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[120%] md:w-full h-[150%] bg-[#a2bcfc]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[60%] h-[80%] bg-brand-gold/10 blur-[90px] rounded-full pointer-events-none mix-blend-screen" />
            
            {/* Elegant Inner Border */}
            <div className="absolute inset-x-4 inset-y-4 md:inset-x-8 md:inset-y-8 border-[0.5px] border-white/10 rounded-b-3xl opacity-80 pointer-events-none" />

            {/* Dark inner shadow to simulate split/gap opening */}
            <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full h-[200%] flex flex-col items-center justify-center px-4">
              <div className="flex flex-col items-center">
                <span className="text-xs md:text-sm uppercase tracking-[0.6em] md:tracking-[0.8em] text-[#a2bcfc]/80 font-medium mb-8">Welcome To</span>
                <h1 className="flex flex-col items-center justify-center text-center font-serif leading-[1.1]">
                  <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] text-white font-light tracking-[0.15em] md:tracking-[0.2em]">MONGOLIAN</span>
                  <span className="text-3xl sm:text-4xl md:text-6xl lg:text-[80px] text-brand-gold italic font-light tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_40px_rgba(212,175,55,0.5)] mt-4 md:mt-6 pr-4">CENTER</span>
                </h1>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
