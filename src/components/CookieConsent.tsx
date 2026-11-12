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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[200] bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[380px] bg-brand-cream rounded-xl border border-brand-line shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-5 font-sans"
        >
          <h3 className="font-sans font-medium text-base text-brand-ink mb-1.5 tracking-normal">{t('cookies.title')}</h3>
          <p className="text-sm text-brand-ink-soft leading-relaxed">
            {t('cookies.description')}{' '}
            <Link to="/privacy" className="text-brand-ink underline underline-offset-2 hover:text-brand-blue transition-colors duration-150">
              {t('cookies.policy')}
            </Link>
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => choose(false)}
              className="flex-1 h-10 rounded-lg border border-brand-line text-sm font-medium text-brand-ink hover:bg-brand-sand"
            >
              {t('cookies.reject')}
            </button>
            <button
              onClick={() => choose(true)}
              className="flex-1 h-10 rounded-lg bg-brand-ink text-white text-sm font-medium hover:bg-brand-blue"
            >
              {t('cookies.accept')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
