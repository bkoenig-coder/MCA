import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutRedirectProps {
  tier: 'student' | 'professional' | 'institutional';
  title: string;
}

export default function CheckoutRedirect({ tier, title }: CheckoutRedirectProps) {
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
            setError('Checkout opened in a new tab. If it didn\'t open, please click the button below to proceed.');
            setLoading(false);
          }
        } else {
          window.location.href = data.url;
        }
      } else {
        throw new Error(data.error || 'Failed to create subscription session');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
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
        setError('Login is required to process membership.');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
              {tier === 'student' ? 'Ready for Activation' : 'Ready for Checkout'}
            </h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed mb-8">
              {tier === 'student' ? (
                <span>Click the button below to activate your free <span className="font-bold text-brand-ink">{title}</span> membership now.</span>
              ) : (
                <span>Click the button below to complete your <span className="font-bold text-brand-ink">{title}</span> membership application securely via Stripe.</span>
              )}
              {error && <span className="block mt-2 text-brand-gold font-bold">{error}</span>}
            </p>
            <a href={checkoutUrl} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300">
              {tier === 'student' ? 'Activate Free Membership' : 'Proceed to Payment'}
            </a>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                Cancel & Go Back
            </Link>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-red-100">
            <h2 className="text-xl font-serif text-brand-ink mb-2">
              {tier === 'student' ? 'Activation Failed' : 'Subscription Failed'}
            </h2>
            <p className="text-red-500 mb-6 font-light">{error}</p>
            <button onClick={() => { setError(''); setNeedsLogin(!user); if(user) handleCheckout(user); }} disabled={loading} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Try Again'}
            </button>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                Cancel & Go Back
            </Link>
          </motion.div>
        ) : needsLogin ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-sm border border-brand-ink/5 flex flex-col items-center">
            <h2 className="text-3xl font-serif text-brand-ink mb-3">Sign in required</h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed mb-8">
              Please sign in to proceed with your <span className="font-bold text-brand-ink">{title}</span> membership application.
            </p>
            <button onClick={handleLoginAndCheckout} disabled={loading} className="w-full flex items-center justify-center py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            <Link to="/membership" className="mt-6 block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-ink">
                Cancel & Go Back
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-sm border border-brand-ink/5 flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-brand-gold mb-6" />
            <h2 className="text-3xl font-serif text-brand-ink mb-3">
              {tier === 'student' ? 'Preparing Activation' : 'Redirecting to Stripe'}
            </h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed">
              {tier === 'student' ? (
                <span>Please wait while we set up your free <span className="font-bold text-brand-ink">{title}</span> membership...</span>
              ) : (
                <span>Please wait while we prepare your secure checkout for the <span className="font-bold text-brand-ink">{title}</span> membership...</span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
