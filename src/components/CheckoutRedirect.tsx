import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation, Trans } from 'react-i18next';

interface CheckoutRedirectProps {
  tier: 'student' | 'professional' | 'institutional';
  title: string;
}

export default function CheckoutRedirect({ tier, title: titleProp }: CheckoutRedirectProps) {
  const { t } = useTranslation();
  const title = t(`pagesMisc.tiers.${tier}`, { defaultValue: titleProp });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const { user, loading: authLoading } = useAuth();
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        handleCheckout(user);
      } else {
        setNeedsLogin(true);
      }
    }
  }, [authLoading, user]);

  const handleCheckout = async (currentUser: any) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-membership-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          email: currentUser?.email,
          userId: currentUser?.uid,
          firstName: currentUser?.displayName?.split(' ')[0] || '',
          lastName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
          returnUrl: window.location.origin
        })
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (window !== window.top) {
          // Open in new tab if in iframe (AI Studio preview)
          const newWindow = window.open(data.url, '_blank');
          if (!newWindow) {
            setCheckoutUrl(data.url);
            setLoading(false);
          } else {
            setCheckoutUrl(data.url);
            setError(t('pagesMisc.checkout.newTab'));
            setLoading(false);
          }
        } else {
          window.location.href = data.url;
        }
      } else {
        if (data?.error) console.error(data.error);
        throw new Error(t('pagesMisc.checkout.sessionFailed'));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t('common.error.unexpected'));
      setLoading(false);
    }
  };

  const handleLoginAndCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setNeedsLogin(false);
        // handleCheckout will be called automatically by the useEffect
        // because `user` will change. But we can also call it directly
        // to be safe if the effect misses it or delays:
        // Actually, the effect will catch the `user` change.
      } else {
        setError(t('pagesMisc.checkout.loginRequired'));
        setLoading(false);
      }
    } catch (err) {
      setError(t('pagesMisc.checkout.loginFailed'));
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-paper pt-24 md:pt-32 pb-24 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32 pb-24 flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        {checkoutUrl ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-sm border border-brand-ink/5 flex flex-col items-center">
            <h2 className="text-3xl font-serif text-brand-ink mb-3">
              {tier === 'student' ? t('pagesMisc.checkout.readyActivation') : t('pagesMisc.checkout.readyCheckout')}
            </h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed mb-8">
              {tier === 'student' ? (
                <span><Trans i18nKey="pagesMisc.checkout.activateDesc" values={{ title }} components={{ b: <span className="font-bold text-brand-ink" /> }} /></span>
              ) : (
                <span><Trans i18nKey="pagesMisc.checkout.checkoutDesc" values={{ title }} components={{ b: <span className="font-bold text-brand-ink" /> }} /></span>
              )}
              {error && <span className="block mt-2 text-brand-gold font-bold">{error}</span>}
            </p>
            <a href={checkoutUrl} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300">
              {tier === 'student' ? t('pagesMisc.checkout.activateBtn') : t('pagesMisc.checkout.payBtn')}
            </a>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                {t('pagesMisc.checkout.cancelBack')}
            </Link>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-red-100">
            <h2 className="text-xl font-serif text-brand-ink mb-2">
              {tier === 'student' ? t('pagesMisc.checkout.failedActivation') : t('pagesMisc.checkout.failedSubscription')}
            </h2>
            <p className="text-red-500 mb-6 font-light">{error}</p>
            <button onClick={() => { setError(''); setNeedsLogin(!user); if(user) handleCheckout(user); }} disabled={loading} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : t('pagesMisc.checkout.tryAgain')}
            </button>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                {t('pagesMisc.checkout.cancelBack')}
            </Link>
          </motion.div>
        ) : needsLogin ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-sm border border-brand-ink/5 flex flex-col items-center">
            <h2 className="text-3xl font-serif text-brand-ink mb-3">{t('pagesMisc.checkout.signInRequired')}</h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed mb-8">
              <Trans i18nKey="pagesMisc.checkout.signInDesc" values={{ title }} components={{ b: <span className="font-bold text-brand-ink" /> }} />
            </p>
            <button onClick={handleLoginAndCheckout} disabled={loading} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {loading ? t('pagesMisc.checkout.signingIn') : t('pagesMisc.checkout.signInGoogle')}
            </button>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                {t('pagesMisc.checkout.cancelBack')}
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-sm border border-brand-ink/5 flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-brand-gold mb-6" />
            <h2 className="text-3xl font-serif text-brand-ink mb-3">
              {tier === 'student' ? t('pagesMisc.checkout.preparingActivation') : t('pagesMisc.checkout.redirecting')}
            </h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed">
              {tier === 'student' ? (
                <span><Trans i18nKey="pagesMisc.checkout.waitActivation" values={{ title }} components={{ b: <span className="font-bold text-brand-ink" /> }} /></span>
              ) : (
                <span><Trans i18nKey="pagesMisc.checkout.waitCheckout" values={{ title }} components={{ b: <span className="font-bold text-brand-ink" /> }} /></span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
