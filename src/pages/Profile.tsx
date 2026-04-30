import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, logOut } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { User as UserIcon, LogOut, Save, Shield, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper">
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
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-brand-paper min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-brand-ink/5"
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
                <div className="absolute -bottom-2 -right-2 bg-brand-ink text-brand-gold p-2 rounded-xl shadow-lg" title="Admin">
                  <Shield size={16} />
                </div>
              )}
              {profile?.role === 'moderator' && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl shadow-lg" title="Moderator">
                  <Shield size={16} />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif text-brand-ink mb-2">
                {profile?.displayName || 'Welcome Back'}
              </h1>
              <p className="text-brand-ink/40 text-sm font-medium uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} />
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold w-5 h-5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-brand-paper rounded-2xl border-none focus:ring-2 focus:ring-brand-gold/20 transition-all text-brand-ink font-medium"
                  placeholder="Your full name"
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
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 bg-brand-paper text-brand-ink py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </form>

          <div className="mt-12 pt-12 border-t border-brand-ink/5">
            <div className="flex items-center gap-4 text-brand-ink/40">
              <Calendar size={16} />
              <span className="text-xs font-medium uppercase tracking-widest">
                Member since {profile?.createdAt?.toDate ? new Date(profile.createdAt.toDate()).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
