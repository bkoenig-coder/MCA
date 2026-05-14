import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CarpetIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5 seconds total
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[99999] pointer-events-none flex flex-col"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Top half of the carpet opening upwards */}
          <motion.div 
            className="w-full h-1/2 bg-[#5c1a1b] border-b-4 border-brand-gold overflow-hidden relative origin-top z-10 shadow-2xl"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.75, 0, 0.25, 1] }}
          >
            {/* Inner Pattern */}
            <div className="absolute inset-x-4 inset-y-4 border-2 border-brand-gold/30 rounded-t-xl opacity-50" />
            <div className="absolute inset-x-8 inset-y-8 border border-brand-gold/20 rounded-t-lg opacity-40 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />

            <div className="absolute top-0 left-0 w-full h-[200%] flex flex-col items-center justify-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-brand-gold font-bold tracking-[0.15em] sm:tracking-[0.2em] text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] leading-tight">
                MONGOLIAN <br/>
                <span className="text-white text-2xl sm:text-3xl md:text-5xl font-light tracking-[0.2em] sm:tracking-[0.3em]">CENTER</span>
              </h1>
            </div>
          </motion.div>

          {/* Bottom half of the carpet opening downwards */}
          <motion.div 
            className="w-full h-1/2 bg-[#5c1a1b] border-t-[1px] border-[#3a0d0d] overflow-hidden relative origin-bottom z-10 shadow-2xl"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.75, 0, 0.25, 1] }}
          >
            {/* Inner Pattern */}
            <div className="absolute inset-x-4 inset-y-4 border-2 border-brand-gold/30 rounded-b-xl opacity-50" />
            <div className="absolute inset-x-8 inset-y-8 border border-brand-gold/20 rounded-b-lg opacity-40 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />

            {/* Dark inner shadow to simulate gap */}
            <div className="absolute top-0 left-0 w-full h-[20px] bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 w-full h-[200%] flex flex-col items-center justify-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-brand-gold font-bold tracking-[0.15em] sm:tracking-[0.2em] text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] leading-tight">
                MONGOLIAN <br/>
                <span className="text-white text-2xl sm:text-3xl md:text-5xl font-light tracking-[0.2em] sm:tracking-[0.3em]">CENTER</span>
              </h1>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
