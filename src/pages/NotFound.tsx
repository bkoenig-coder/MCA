import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-brand-paper">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center border border-brand-ink/10 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 inset-y-0 flex items-center justify-center text-brand-gold/30"
            >
              <Compass size={80} strokeWidth={1} />
            </motion.div>
            <span className="text-4xl font-serif text-brand-ink relative z-10">404</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif text-brand-ink mb-6 tracking-tight">
          Lost in the <span className="italic text-brand-gold">Steppe</span>
        </h1>
        
        <p className="text-lg text-brand-ink/60 mb-10 leading-relaxed font-light">
          The path you are looking for seems to have faded like tracks in the wind. Let us guide you back to familiar terrain.
        </p>

        <Link 
          to="/"
          className="inline-flex items-center gap-3 bg-brand-ink text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-brand-gold transition-colors duration-300 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
