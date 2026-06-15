import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OverlayProps {
  activePopup: string | null;
  onClose: () => void;
}

export function Overlay({ activePopup, onClose }: OverlayProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {activePopup && (
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
            {t(`diorama.${activePopup}.title`)}
          </h3>
          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
            {t(`diorama.${activePopup}.content`)}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

