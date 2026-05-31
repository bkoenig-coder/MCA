import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, CheckCircle, GraduationCap, Briefcase, Building2, Globe, Calendar, User, Phone, Mail, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, db, collection, addDoc, serverTimestamp, query, where, getDocs, OperationType, handleFirestoreError } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface MembershipApplicationFormProps {
  tier: 'student' | 'professional' | 'institutional';
  title: string;
}

export default function MembershipApplicationForm({ tier, title }: MembershipApplicationFormProps) {
  const { t } = useTranslation();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingApp, setExistingApp] = useState<any | null>(null);
  
  // Form values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('prefer-not-to-say');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('Austrian');
  
  // Specific values
  const [school, setSchool] = useState('');
  const [studentId, setStudentId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [position, setPosition] = useState('');
  const [website, setWebsite] = useState('');
  const [statement, setStatement] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [ageError, setAgeError] = useState('');

  // Pre-populate names from user object when logged in
  useEffect(() => {
    if (user) {
      const parts = user.displayName ? user.displayName.split(' ') : ['', ''];
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      
      // Check if user has an existing application
      const checkExistingApp = async () => {
        try {
          const q = query(
            collection(db, 'membership_applications'),
            where('userId', '==', user.uid),
            where('tier', '==', tier)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            // Find if there is any pending or approved app
            const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Prefer pending or approved
            const activeOrPending = apps.find((a: any) => a.status === 'pending' || a.status === 'approved');
            setExistingApp(activeOrPending || apps[0]);
          }
        } catch (err) {
          console.error("Error checking existing application: ", err);
        } finally {
          setCheckingExisting(false);
        }
      };
      checkExistingApp();
    } else {
      setCheckingExisting(false);
    }
  }, [user, tier]);

  // Calculate age when dob changes
  useEffect(() => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    if (tier === 'student' && calculatedAge >= 25) {
      setAgeError(t('membershipPage.form.errAge', { age: calculatedAge }));
    } else {
      setAgeError('');
    }
  }, [dob, tier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (ageError) {
      toast.error(t('membershipPage.form.errSubmit'));
      return;
    }

    setLoading(true);
    
    // Calculate final age
    let finalAge = 0;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      finalAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        finalAge--;
      }
    }

    try {
      const docData: any = {
        userId: user.uid,
        userEmail: user.email || '',
        firstName,
        lastName,
        gender,
        dob,
        phone,
        nationality,
        tier,
        age: finalAge,
        statementOfPurpose: statement,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (tier === 'student') {
        docData.schoolOrUniversity = school;
        docData.studentIdNumber = studentId;
      } else if (tier === 'professional') {
        docData.organizationName = orgName;
        docData.position = position;
        docData.websiteOrLinkedin = website;
      } else if (tier === 'institutional') {
        docData.organizationName = orgName;
        docData.websiteOrLinkedin = website;
      }

      const path = 'membership_applications';
      await addDoc(collection(db, path), docData);
      
      // Update local profile representation optionally
      setSubmitted(true);
      toast.success(t('membershipPage.form.submittedTitle'));
    } catch (err: any) {
      console.error("Error submitting membership: ", err);
      toast.error(err.message || t('membershipPage.form.errGeneric'));
      handleFirestoreError(err, OperationType.CREATE, 'membership_applications');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error("Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingExisting) {
    return (
      <div className="min-h-screen bg-brand-paper pt-32 pb-24 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-paper pt-32 pb-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-xl border border-brand-ink/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
            <User size={28} />
          </div>
          <h2 className="text-3xl font-serif text-brand-ink mb-3">{t('membershipPage.form.signInRequired')}</h2>
          <p className="text-brand-ink/50 text-sm leading-relaxed mb-8">
            {t('membershipPage.form.loginDesc', { tier: title })}
          </p>
          <button onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 py-5 bg-brand-gold text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-ink hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg shadow-brand-gold/20">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {t('membershipPage.form.signInBtn')}
          </button>
          <Link to="/membership" className="mt-6 text-xs uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink">
            {t('membershipPage.form.backBtn')}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (existingApp) {
    return (
      <div className="min-h-screen bg-brand-paper pt-32 pb-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-white p-10 md:p-12 rounded-[40px] shadow-xl border border-brand-ink/5">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              existingApp.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
              existingApp.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              <CheckCircle size={28} />
            </div>
            <h2 className="text-3xl font-serif text-brand-ink mb-3 capitalize">
              {existingApp.status === 'pending' ? t('membershipPage.form.statusPending') : existingApp.status === 'approved' ? t('membershipPage.form.statusApproved') : t('membershipPage.form.statusRejected')}
            </h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
              {existingApp.status === 'pending' && t('membershipPage.form.pendingDesc', { tier: title })}
              {existingApp.status === 'approved' && t('membershipPage.form.approvedDesc', { tier: title })}
              {existingApp.status === 'rejected' && t('membershipPage.form.rejectedDesc', { tier: title })}
            </p>
          </div>

          <div className="bg-brand-paper rounded-3xl p-6 border border-brand-ink/5 space-y-4 mb-8">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">{t('membershipPage.form.appSummary')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div>
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">{t('membershipPage.form.requestedTier')}</span>
                <span className="text-brand-ink capitalize">{existingApp.tier} Membership</span>
              </div>
              <div>
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">{t('membershipPage.form.submittedOn')}</span>
                <span className="text-brand-ink">
                  {existingApp.createdAt?.toDate ? new Date(existingApp.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">{t('membershipPage.form.applicantName')}</span>
                <span className="text-brand-ink">{existingApp.firstName} {existingApp.lastName} ({existingApp.userEmail})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/profile" className="flex-1 text-center py-5 bg-brand-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-ink transition-all shadow-lg shadow-brand-ink/10">
              {t('membershipPage.form.myProfile')}
            </Link>
            <Link to="/membership" className="flex-1 text-center py-5 bg-brand-paper text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-sand transition-all border border-brand-ink/5">
              {t('membershipPage.form.browseMemberships')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-paper pt-32 pb-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-white p-12 rounded-[40px] shadow-xl border border-brand-ink/5 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-3xl font-serif text-brand-ink mb-3">{t('membershipPage.form.submittedTitle')}</h2>
          <p className="text-brand-ink/60 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            {t('membershipPage.form.submittedDesc')}
          </p>
          <p className="text-brand-ink/50 text-xs leading-relaxed mb-10 max-w-sm mx-auto">
            {t('membershipPage.form.submittedStudentTip')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile" className="px-8 py-5 bg-raw bg-brand-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-ink transition-all shadow-lg">
              {t('membershipPage.form.profileBtn')}
            </Link>
            <Link to="/membership" className="px-8 py-5 bg-brand-paper text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-sand transition-all">
              {t('membershipPage.form.tiersBtn')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-paper min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/membership" className="inline-flex items-center gap-2 text-brand-ink/40 text-[10px] font-bold uppercase tracking-widest hover:text-brand-ink mb-8 transition-colors">
          <ArrowLeft size={12} /> {t('membershipPage.form.backToMemberships')}
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-brand-ink/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              {tier === 'student' ? <GraduationCap size={22} /> : tier === 'professional' ? <Briefcase size={22} /> : <Building2 size={22} />}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-brand-ink">{t('membershipPage.form.applyTitle', { tier: title })}</h1>
              <p className="text-brand-ink/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                {t('membershipPage.form.subtitleText')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">{t('membershipPage.form.secContact')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelFirstName')}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelLastName')}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelEmail')}</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                    <input type="email" disabled value={user.email || ''} className="w-full pl-11 pr-4 py-3.5 bg-brand-paper text-brand-ink/40 rounded-xl border border-brand-ink/5 font-medium text-sm cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelPhone')}</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="+43 660..." />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelGender')}</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold">
                    <option value="male">{t('membershipPage.form.genderMale')}</option>
                    <option value="female">{t('membershipPage.form.genderFemale')}</option>
                    <option value="other">{t('membershipPage.form.genderOther')}</option>
                    <option value="prefer-not-to-say">{t('membershipPage.form.genderPreferNotToSay')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelDob')}</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                  {ageError && <span className="block mt-1.5 text-xs text-red-500 font-medium leading-relaxed">{ageError}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelNationality')}</label>
                  <input type="text" required value={nationality} onChange={e => setNationality(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="Austrian, Mongolian, etc." />
                </div>
              </div>
            </div>

            {/* Tier Specific Information */}
            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">{t('membershipPage.form.secCredentials', { tier: title })}</h3>
              
              {tier === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelSchool')}</label>
                    <input type="text" required value={school} onChange={e => setSchool(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., University of Vienna" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelStudentId')}</label>
                    <input type="text" required value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., matriculation number" />
                  </div>
                </div>
              )}

              {tier === 'professional' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelOrgName')}</label>
                    <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., McKinsey Austria" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelPosition')}</label>
                    <input type="text" required value={position} onChange={e => setPosition(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., Senior Research Associate" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelLinkedin')}</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                      <input type="url" required value={website} onChange={e => setWebsite(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                </div>
              )}

              {tier === 'institutional' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelInstName')}</label>
                    <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., Mongolia Trade Representative Office" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">{t('membershipPage.form.labelWebsite')}</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                      <input type="url" required value={website} onChange={e => setWebsite(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="https://www.example.org" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">{t('membershipPage.form.secMotivation')}</h3>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">
                  {t('membershipPage.form.labelMotivation')}
                </label>
                <div className="relative">
                  <FileText size={14} className="absolute left-4 top-4 text-brand-gold/80" />
                  <textarea required value={statement} onChange={e => setStatement(e.target.value)} rows={5} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder={t('membershipPage.form.placeholderMotivation')} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !!ageError} className="w-full py-5 bg-brand-gold text-brand-ink rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 h-14 shadow-lg shadow-brand-gold/20">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {t('membershipPage.form.submitBtn')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
