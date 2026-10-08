import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie-consent')) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      /* storage blocked: stay hidden */
    }
  }, []);

  const choose = (all: boolean) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify({ essential: true, analytics: all, marketing: all }));
    } catch {
      /* ignore */
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-label={t('cookies.title')}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed z-[200] bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[380px] bg-white rounded-2xl border border-brand-ink/10 shadow-[0_12px_40px_rgba(10,17,40,0.18)] p-5 font-sans"
        >
          <h3 className="font-bold text-base text-brand-ink mb-1.5">{t('cookies.title')}</h3>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            {t('cookies.description')}{' '}
            <Link to="/privacy" className="text-brand-ink underline font-semibold hover:text-[#C5A059] transition-colors">
              {t('cookies.policy')}
            </Link>
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => choose(false)}
              className="flex-1 py-2.5 rounded-full border border-brand-ink/20 text-sm font-semibold text-brand-ink hover:bg-brand-paper transition-colors"
            >
              {t('cookies.reject')}
            </button>
            <button
              onClick={() => choose(true)}
              className="flex-1 py-2.5 rounded-full bg-brand-ink text-white text-sm font-semibold hover:bg-[#C5A059] transition-colors"
            >
              {t('cookies.accept')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
