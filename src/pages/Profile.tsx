import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, logOut } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { User as UserIcon, LogOut, Save, Shield, Mail, Calendar, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const tierName = (tier: string) => t(`pagesMisc.tiers.${tier}`, { defaultValue: tier });
  const formatDate = (value: any) =>
    (typeof value?.toDate === 'function' ? value.toDate() : new Date(value)).toLocaleDateString(t('common.locale'));

  const handleCancelSubscription = async () => {
    if (!profile?.stripeSessionId) return;
    if (!window.confirm(t('pagesMisc.profile.confirmCancel'))) return;
    
    setIsCanceling(true);
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: profile.stripeSessionId })
      });
      if (!res.ok) {
        throw new Error(t('pagesMisc.profile.cancelFailed'));
      }
      
      await updateDoc(doc(db, 'users', user.uid), {
        membershipStatus: 'canceled',
        updatedAt: serverTimestamp()
      });
      toast.success(t('pagesMisc.profile.canceledToast'));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t('common.error.unexpected'));
    } finally {
      setIsCanceling(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Handle Stripe success redirect
    const query = new URLSearchParams(location.search);
    if (query.get('success') === 'true' && query.get('membership')) {
      const membership = query.get('membership');
      const sessionId = query.get('session_id');
      toast.success(t('pagesMisc.profile.subscribed', { membership: tierName(membership || '') }));
      
      // Update user doc with membership info
      if (user) {
        updateDoc(doc(db, 'users', user.uid), {
          membershipTier: membership,
          membershipStatus: 'active',
          ...(sessionId ? { stripeSessionId: sessionId } : {}),
          membershipUpdatedAt: serverTimestamp()
        }).catch(err => {
          console.error("Failed to update membership in firestore", err);
        });
      }
      
      // Remove query params
      navigate('/profile', { replace: true });
    }
  }, [location, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        updatedAt: serverTimestamp()
      });
      toast.success(t('pagesMisc.profile.updated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('pagesMisc.profile.updateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      toast.success(t('pagesMisc.profile.loggedOut'));
    } catch (error) {
      toast.error(t('pagesMisc.profile.logoutFailed'));
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-brand-ink/5"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold overflow-hidden border-4 border-white shadow-lg">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>
              {(profile?.role === 'admin' || user.email?.toLowerCase() === 'emeraldtorstein@gmail.com' || user.email?.toLowerCase() === 'batmunkh.unen@gmail.com') && (
                <div className="absolute -bottom-2 -right-2 bg-brand-ink text-brand-gold p-2 rounded-xl shadow-lg" title={t('pagesMisc.profile.admin')}>
                  <Shield size={16} />
                </div>
              )}
              {profile?.role === 'moderator' && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl shadow-lg" title={t('pagesMisc.profile.moderator')}>
                  <Shield size={16} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-serif text-brand-ink mb-2">
                {profile?.displayName || t('pagesMisc.profile.welcome')}
              </h1>
              <p className="text-brand-ink/40 text-sm font-medium uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} />
                {user.email}
              </p>
              {profile?.membershipTier && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full border border-brand-gold/20">
                  <Award size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('pagesMisc.profile.memberBadge', { tier: tierName(profile.membershipTier) })}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-ink/40">{t('pagesMisc.profile.fullName')}</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold w-5 h-5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl border-none focus:ring-2 focus:ring-brand-gold/20 transition-all text-brand-ink font-medium"
                  placeholder={t('pagesMisc.profile.fullNamePlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-3 bg-brand-ink text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl shadow-brand-ink/10"
              >
                <Save size={18} />
                {isSaving ? t('pagesMisc.profile.saving') : t('pagesMisc.profile.save')}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 bg-white text-brand-ink py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={18} />
                {t('pagesMisc.profile.logOut')}
              </button>
            </div>
          </form>

          {profile?.membershipTier && (
            <div className="mt-12 pt-12 border-t border-brand-ink/5">
              <h3 className="text-xl font-serif text-brand-ink mb-2">{t('pagesMisc.profile.subscription')}</h3>
              <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-ink/5">
                <div>
                  <p className="font-bold text-brand-ink">{t('pagesMisc.profile.memberBadge', { tier: tierName(profile.membershipTier) })}</p>
                  <p className="text-sm font-medium text-brand-ink/60 mt-1">
                    {t('pagesMisc.profile.status')} <span className={profile.membershipStatus === 'canceled' ? 'text-brand-ink/40' : 'text-green-600'}>{profile.membershipStatus === 'canceled' ? t('pagesMisc.profile.canceled') : t('pagesMisc.profile.active')}</span>
                  </p>
                  <p className="text-xs text-brand-ink/40 mt-2 max-w-sm">
                    {t('pagesMisc.profile.refundNote')}
                  </p>
                </div>
                {profile.membershipStatus === 'active' && profile.stripeSessionId && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                    className="shrink-0 px-6 py-3 bg-white text-brand-ink rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isCanceling ? t('pagesMisc.profile.canceling') : t('pagesMisc.profile.cancel')}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 pt-12 border-t border-brand-ink/5">
            <div className="flex items-center gap-4 text-brand-ink/40">
              <Calendar size={16} />
              <span className="text-xs font-medium uppercase tracking-widest">
                {profile?.createdAt ? t('pagesMisc.profile.memberSince', { date: formatDate(profile.createdAt) }) : t('pagesMisc.profile.memberSinceRecent')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
