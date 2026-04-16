import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface OverlayProps {
  activePopup: string | null;
  onClose: () => void;
}

const popups: Record<string, { title: string; content: string }> = {
  ger: {
    title: 'The Ger (Yurt)',
    content: 'The traditional Mongolian Ger is a portable, round tent covered with skins or felt. Designed to be easily dismantled and carried on horses or yaks, it is perfectly suited for the nomadic lifestyle of the steppes.'
  },
  play: {
    title: 'Shagai (Ankle Bone Games)',
    content: 'Children on the steppe often played games using "shagai", the cleaned and polished ankle bones of sheep or goats. These games taught dexterity and were a central part of nomadic culture and fortune-telling.'
  },
  herding: {
    title: 'Airag & Herding',
    content: 'Livestock are the lifeblood of the steppe. Mares are milked to produce Airag (fermented mare\'s milk), a staple beverage rich in vitamins that sustained warriors and families alike during long journeys.'
  },
  training: {
    title: 'The Three Manly Skills',
    content: 'Bökh (wrestling), archery, and horse riding are known as the "Three Manly Skills" (Eriin Gurvan Naadam). These martial disciplines were essential for survival and formed the backbone of the Mongol military prowess.'
  }
};

export function Overlay({ activePopup, onClose }: OverlayProps) {
  return (
    <AnimatePresence>
      {activePopup && popups[activePopup] && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-amber-100/50 z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
            {popups[activePopup].title}
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm">
            {popups[activePopup].content}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
