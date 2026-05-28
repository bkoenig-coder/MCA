import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Settings, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-brand-ink/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] w-full font-sans"
        >
          <div className="max-w-[1600px] w-full mx-auto px-6 md:px-16 py-8 md:py-10">
            {!showSettings ? (
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
                
                {/* Left Content */}
                <div className="flex-1 max-w-4xl">
                  <div className="flex items-center gap-3 mb-3 text-brand-ink">
                    <Shield size={18} strokeWidth={2} />
                    <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider">
                      {t('cookies.title')}
                    </h3>
                  </div>
                  <p className="text-sm text-brand-ink/70 leading-relaxed">
                    {t('cookies.description')}
                    <Link to="/privacy" className="text-brand-ink underline font-bold ml-2 hover:text-[#C5A059] transition-colors">
                      {t('cookies.policy')}
                    </Link>
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-brand-ink/20 text-xs font-bold uppercase tracking-widest text-brand-ink hover:bg-brand-paper transition-colors"
                  >
                    <Settings size={14} />
                    {t('cookies.settings')}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-brand-ink/20 text-xs font-bold uppercase tracking-widest text-brand-ink hover:bg-brand-paper transition-colors"
                  >
                    {t('cookies.reject')}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-brand-ink border border-brand-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:border-[#C5A059] transition-colors"
                  >
                    {t('cookies.accept')}
                  </button>
                </div>

              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-5xl mx-auto"
              >
                <div className="flex items-center justify-between border-b border-brand-ink/10 pb-6 mb-6">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-brand-ink">
                    {t('cookies.preferences')}
                  </h3>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-brand-ink/50 hover:text-brand-ink transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    { id: 'essential', title: t('cookies.essential'), desc: t('cookies.essentialDesc'), disabled: true },
                    { id: 'analytics', title: t('cookies.analytics'), desc: t('cookies.analyticsDesc'), disabled: false },
                    { id: 'marketing', title: t('cookies.marketing'), desc: t('cookies.marketingDesc'), disabled: false },
                  ].map((pref) => (
                    <div 
                      key={pref.id}
                      className={cn(
                        "p-6 border transition-all cursor-pointer bg-white",
                        preferences[pref.id as keyof typeof preferences] 
                          ? "border-brand-ink" 
                          : "border-brand-ink/10"
                      )}
                      onClick={() => !pref.disabled && setPreferences(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof preferences] }))}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-xs uppercase tracking-widest text-brand-ink">{pref.title}</span>
                        <div className={cn(
                          "w-5 h-5 border flex items-center justify-center transition-all",
                          preferences[pref.id as keyof typeof preferences] 
                            ? "bg-brand-ink border-brand-ink text-white" 
                            : "border-brand-ink/30 bg-transparent"
                        )}>
                          {preferences[pref.id as keyof typeof preferences] && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-xs text-brand-ink/60 leading-relaxed">{pref.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-8 py-3 border border-brand-ink/20 text-xs font-bold uppercase tracking-widest text-brand-ink hover:bg-brand-paper transition-colors"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-8 py-3 bg-brand-ink border border-brand-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:border-[#C5A059] transition-colors"
                  >
                    {t('cookies.save')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
