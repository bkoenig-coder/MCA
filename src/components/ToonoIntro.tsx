import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToonoIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); // 3.5 seconds total
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden bg-transparent"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] origin-center"
            style={{ willChange: 'transform, opacity' }}
            initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
            animate={{
              scale: [1, 1, 25],
              rotate: [0, 0, 45],
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 3.5,
              times: [0, 0.15, 1],
              ease: ["linear", "easeIn"]
            }}
          >
            <svg viewBox="0 0 1000 1000" className="w-full h-full">
              <defs>
                {/* Mask to create the transparent hole in the center */}
                <mask id="center-hole">
                  <rect width="1000" height="1000" fill="white" />
                  <circle cx="500" cy="500" r="80" fill="black" />
                </mask>
                
                {/* Blue sky gradient */}
                <radialGradient id="sky" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="40%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </radialGradient>
              </defs>

              {/* Sky background with hole */}
              <rect width="1000" height="1000" fill="url(#sky)" mask="url(#center-hole)" />

              {/* Wooden Toono Structure */}
              <g>
                {/* Toono Outer Ring */}
                <circle cx="500" cy="500" r="350" stroke="#7c2d12" strokeWidth="40" fill="none" />
                <circle cx="500" cy="500" r="350" stroke="#9a3412" strokeWidth="30" fill="none" />
                <circle cx="500" cy="500" r="330" stroke="#c2410c" strokeWidth="10" fill="none" />

                {/* Spokes (Uni) */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const x1 = 500 + 80 * Math.cos(angle);
                  const y1 = 500 + 80 * Math.sin(angle);
                  const x2 = 500 + 350 * Math.cos(angle);
                  const y2 = 500 + 350 * Math.sin(angle);
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke="#ea580c" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                    />
                  );
                })}

                {/* Decorative cross-ties (circular) */}
                <circle cx="500" cy="500" r="170" stroke="#c2410c" strokeWidth="4" fill="none" />
                <circle cx="500" cy="500" r="260" stroke="#c2410c" strokeWidth="4" fill="none" />

                {/* Toono Inner Ring (The crown) */}
                <circle cx="500" cy="500" r="80" stroke="#7c2d12" strokeWidth="24" fill="none" />
                <circle cx="500" cy="500" r="80" stroke="#9a3412" strokeWidth="16" fill="none" />
                <circle cx="500" cy="500" r="90" stroke="#fdba74" strokeWidth="2" fill="none" opacity="0.5" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
