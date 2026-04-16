import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Settings, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol } from './MongolianDesign';
import { cn } from '@/src/lib/utils';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const allRejected = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(allRejected));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-4xl bg-brand-ink text-white rounded-[32px] md:rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 pointer-events-auto relative">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 opacity-[0.03] translate-x-1/4 -translate-y-1/4 pointer-events-none">
              <UlziiSymbol className="w-64 h-64 text-brand-gold" />
            </div>

            <div className="p-8 md:p-12 relative z-10">
              {!showSettings ? (
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                        <Shield size={20} />
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl tracking-tight">
                        {t('cookies.title')}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-white/60 font-light leading-relaxed max-w-2xl">
                      {t('cookies.description')}
                      <Link to="/privacy" className="text-brand-gold hover:underline ml-2 italic">
                        {t('cookies.policy')}
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                    >
                      <Settings size={14} />
                      {t('cookies.settings')}
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                    >
                      {t('cookies.reject')}
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-brand-gold text-brand-ink text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl shadow-brand-gold/10"
                    >
                      {t('cookies.accept')}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-3xl tracking-tight italic text-brand-gold">
                      {t('cookies.preferences')}
                    </h3>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { id: 'essential', title: t('cookies.essential'), desc: t('cookies.essentialDesc'), disabled: true },
                      { id: 'analytics', title: t('cookies.analytics'), desc: t('cookies.analyticsDesc'), disabled: false },
                      { id: 'marketing', title: t('cookies.marketing'), desc: t('cookies.marketingDesc'), disabled: false },
                    ].map((pref) => (
                      <div 
                        key={pref.id}
                        className={cn(
                          "p-6 rounded-3xl border transition-all cursor-pointer",
                          preferences[pref.id as keyof typeof preferences] 
                            ? "bg-brand-gold/10 border-brand-gold/30" 
                            : "bg-white/5 border-white/10"
                        )}
                        onClick={() => !pref.disabled && setPreferences(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof preferences] }))}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">{pref.title}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                            preferences[pref.id as keyof typeof preferences] ? "bg-brand-gold border-brand-gold text-brand-ink" : "border-white/20"
                          )}>
                            {preferences[pref.id as keyof typeof preferences] && <Check size={12} strokeWidth={4} />}
                          </div>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed font-light">{pref.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-8 py-4 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
                    >
                      {t('common.back')}
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-10 py-4 rounded-full bg-brand-gold text-brand-ink text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl shadow-brand-gold/10"
                    >
                      {t('cookies.save')}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
