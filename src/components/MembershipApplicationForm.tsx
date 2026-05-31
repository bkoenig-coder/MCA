import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, CheckCircle, GraduationCap, Briefcase, Building2, Globe, Calendar, User, Phone, Mail, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, db, collection, addDoc, serverTimestamp, query, where, getDocs, OperationType, handleFirestoreError } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MembershipApplicationFormProps {
  tier: 'student' | 'professional' | 'institutional';
  title: string;
}

export default function MembershipApplicationForm({ tier, title }: MembershipApplicationFormProps) {
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
      setAgeError(`The Student & Youth tier is strictly for individuals under 25 years old. You are currently ${calculatedAge} years old. Please apply for the Professional tier instead.`);
    } else {
      setAgeError('');
    }
  }, [dob, tier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (ageError) {
      toast.error("Please resolve form issues before submitting.");
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
      toast.success("Your membership application has been submitted successfully!");
    } catch (err: any) {
      console.error("Error submitting membership: ", err);
      toast.error(err.message || "Failed to submit application.");
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
          <h2 className="text-3xl font-serif text-brand-ink mb-3">Sign in Required</h2>
          <p className="text-brand-ink/50 text-sm leading-relaxed mb-8">
            You must be logged in with your Google Account to apply for a <span className="font-bold text-brand-ink">{title}</span> membership.
          </p>
          <button onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 py-5 bg-brand-gold text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-ink hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg shadow-brand-gold/20">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Sign in with Google
          </button>
          <Link to="/membership" className="mt-6 text-xs uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink">
            Cancel & Go Back
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
            <h2 className="text-3xl font-serif text-brand-ink mb-3 capitalize">Application {existingApp.status}</h2>
            <p className="text-brand-ink/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
              {existingApp.status === 'pending' && `We have received your application for the ${title} membership. Our administration is currently conducting a manual review. You will be notified once complete.`}
              {existingApp.status === 'approved' && `Your application for the ${title} membership has been approved! Your profile is now successfully updated on the system.`}
              {existingApp.status === 'rejected' && `We processed your application for the ${title} membership. Unfortunately, it could not be approved at this time. Please contact us for support.`}
            </p>
          </div>

          <div className="bg-brand-paper rounded-3xl p-6 border border-brand-ink/5 space-y-4 mb-8">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Application Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div>
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">Requested Tier</span>
                <span className="text-brand-ink capitalize">{existingApp.tier} Membership</span>
              </div>
              <div>
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">Submitted On</span>
                <span className="text-brand-ink">
                  {existingApp.createdAt?.toDate ? new Date(existingApp.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-brand-ink/40 text-[10px] uppercase font-bold tracking-wider">Applicant Name</span>
                <span className="text-brand-ink">{existingApp.firstName} {existingApp.lastName} ({existingApp.userEmail})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/profile" className="flex-1 text-center py-5 bg-brand-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-ink transition-all shadow-lg shadow-brand-ink/10">
              Go to my Profile
            </Link>
            <Link to="/membership" className="flex-1 text-center py-5 bg-brand-paper text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-sand transition-all border border-brand-ink/5">
              Browse Memberships
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
          <h2 className="text-3xl font-serif text-brand-ink mb-3">Form Submitted!</h2>
          <p className="text-brand-ink/60 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Thank you for applying. Since memberships must be approved manually by our executive board, your status is now set to <strong>Pending Review</strong>.
          </p>
          <p className="text-brand-ink/50 text-xs leading-relaxed mb-10 max-w-sm mx-auto">
            If you applied of the Student & Youth tier, once approved and active, you can sign up for events for free twice a year!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile" className="px-8 py-5 bg-raw bg-brand-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-ink transition-all shadow-lg">
              Go to Profile
            </Link>
            <Link to="/membership" className="px-8 py-5 bg-brand-paper text-brand-ink rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-sand transition-all">
              Membership Tiers
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
          <ArrowLeft size={12} /> Back to Memberships
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-brand-ink/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              {tier === 'student' ? <GraduationCap size={22} /> : tier === 'professional' ? <Briefcase size={22} /> : <Building2 size={22} />}
            </div>
            <div>
              <h1 className="text-3xl font-serif text-brand-ink">{title} Application</h1>
              <p className="text-brand-ink/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                Austria-Mongolia Community Network
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">1. Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">First Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Last Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Google Email Address (Linked)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                    <input type="email" disabled value={user.email} className="w-full pl-11 pr-4 py-3.5 bg-brand-paper text-brand-ink/40 rounded-xl border border-brand-ink/5 font-medium text-sm cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="+43 660..." />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </div>
                  {ageError && <span className="block mt-1.5 text-xs text-red-500 font-medium leading-relaxed">{ageError}</span>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Nationality</label>
                  <input type="text" required value={nationality} onChange={e => setNationality(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="Austrian, Mongolian, etc." />
                </div>
              </div>
            </div>

            {/* Tier Specific Information */}
            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">2. {title} Credentials</h3>
              
              {tier === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">School / University</label>
                    <input type="text" required value={school} onChange={e => setSchool(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., University of Vienna" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Student ID Registration Number</label>
                    <input type="text" required value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., matriculation number" />
                  </div>
                </div>
              )}

              {tier === 'professional' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Organization / Corporate Name</label>
                    <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., McKinsey Austria" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Current Job Title / Position</label>
                    <input type="text" required value={position} onChange={e => setPosition(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., Senior Research Associate" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">LinkedIn / Professional Website URL</label>
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Institution / Corporate Entity Name</label>
                    <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full px-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="e.g., Mongolia Trade Representative Office" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">Official Website Link</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/80" />
                      <input type="url" required value={website} onChange={e => setWebsite(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="https://www.example.org" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-brand-paper p-6 rounded-3xl border border-brand-ink/5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-gold">3. Motivation Statement</h3>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2">
                  Tell us about your interest in Austria-Mongolia cultural or business exchange & motivation to join
                </label>
                <div className="relative">
                  <FileText size={14} className="absolute left-4 top-4 text-brand-gold/80" />
                  <textarea required value={statement} onChange={e => setStatement(e.target.value)} rows={5} className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-brand-ink/5 font-medium text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-gold" placeholder="Please elaborate briefly on what value you wish to bring and obtain from the community network." />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !!ageError} className="w-full py-5 bg-brand-gold text-brand-ink rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 h-14 shadow-lg shadow-brand-gold/20">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Submit Membership Application
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
