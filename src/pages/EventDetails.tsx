import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, doc, getDoc, OperationType, handleFirestoreError, signInWithGoogle, addDoc, collection, serverTimestamp, writeBatch, increment } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, Loader2, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine } from '../components/MongolianDesign';
import { useTranslation } from 'react-i18next';

export default function EventDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isRegisteringFree, setIsRegisteringFree] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError(t('events.details.notFound'));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `events/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistrationForm({ ...registrationForm, name: user?.displayName || '', email: user?.email || '' });
    setShowRegistrationModal(true);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (event.price > 0) {
       setRegistering(true);
       try {
          localStorage.setItem('guest_registration', JSON.stringify({
            name: registrationForm.name,
            email: registrationForm.email,
            phone: registrationForm.phone,
            notes: registrationForm.notes,
          }));

          const response = await fetch('/api/create-checkout-session', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                eventId: event.id,
                eventTitle: event.title,
                price: event.price,
                userId: user ? user.uid : 'guest',
                userEmail: registrationForm.email,
             })
          });
          const data = await response.json();
          if (data.url) {
             window.location.href = data.url;
          } else {
             throw new Error(data.error || t('common.error.checkout'));
          }
       } catch (err: any) {
          setError(err.message || t('common.error.unexpected'));
       } finally {
          setRegistering(false);
          setShowRegistrationModal(false);
       }
       return;
    }

    setIsRegisteringFree(true);
    try {
      const batch = writeBatch(db);
      
      const regRef = doc(collection(db, 'registrations'));
      batch.set(regRef, {
        eventId: event.id,
        eventTitle: event.title,
        userId: user ? user.uid : 'guest',
        userEmail: registrationForm.email,
        name: registrationForm.name,
        email: registrationForm.email,
        phone: registrationForm.phone,
        notes: registrationForm.notes,
        status: 'completed',
        amount: 0,
        createdAt: serverTimestamp(),
      });

      const eventRef = doc(db, 'events', event.id);
      batch.update(eventRef, {
        registeredCount: increment(1)
      });

      await batch.commit();

      setRegistrationSuccess(true);
      setTimeout(() => {
        setShowRegistrationModal(false);
        setRegistrationSuccess(false);
        setRegistrationForm({ name: '', email: '', phone: '', notes: '' });
      }, 3000);
    } catch (err) {
      console.error("Error registering:", err);
      setError("Failed to register. Please try again.");
    } finally {
      setIsRegisteringFree(false);
    }
  };

  const allImages = event ? [event.imageUrl, ...(event.galleryImages || [])] : [];

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allImages.length, currentImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h1 className="text-3xl font-serif mb-4">{error || t('common.error.unexpected')}</h1>
        <Link to="/events" className="text-brand-gold font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> {t('events.details.back')}
        </Link>
      </div>
    );
  }

  const lang = i18n.language;
  const dTitle = lang === 'mn' ? (event.titleMn || event.title) : lang === 'de' ? (event.titleDe || event.title) : (event.titleEn || event.title);
  const dDesc = lang === 'mn' ? (event.descriptionMn || event.description) : lang === 'de' ? (event.descriptionDe || event.description) : (event.descriptionEn || event.description);
  const dLocation = lang === 'mn' ? (event.locationMn || event.location) : lang === 'de' ? (event.locationDe || event.location) : (event.locationEn || event.location);
  const dCat = lang === 'mn' ? (event.categoryMn || event.category) : lang === 'de' ? (event.categoryDe || event.category) : (event.categoryEn || event.category);

  // Format title for styling (split last word)
  let titleParts = dTitle.split(' ');
  let titleStart = dTitle;
  let titleEnd = '';
  if (titleParts.length > 1) {
    titleEnd = titleParts.pop() || '';
    titleStart = titleParts.join(' ');
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden">
      {/* Background Symbols */}
        <div className="absolute top-20 right-0 opacity-[0.02] pointer-events-none">
          <UlziiSymbol className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] text-brand-gold" />
        </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors mb-8 md:mb-12 font-medium group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('events.details.back')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[700px] relative group"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={allImages[currentImageIndex]} 
                alt={dTitle} 
                className="w-full h-full object-contain bg-brand-paper/30 absolute inset-0 cursor-grab active:cursor-grabbing"
                referrerPolicy="no-referrer"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50) {
                    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                  } else if (swipe > 50) {
                    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                  }
                }}
              />
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between p-4 pointer-events-none">
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="p-3 bg-brand-ink/30 backdrop-blur text-white rounded-full hover:bg-brand-gold transition-colors pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                    className="p-3 bg-brand-ink/30 backdrop-blur text-white rounded-full hover:bg-brand-gold transition-colors pointer-events-auto"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'w-6 bg-brand-gold' : 'bg-white/50 hover:bg-white'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-widest">
                  {dCat || t('events.details.category')}
                </span>
                {event.capacity > 0 && (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-ink/5 text-brand-ink/60 text-xs font-bold uppercase tracking-widest">
                    {event.registeredCount || 0}/{event.capacity} Spots Filled
                  </span>
                )}
                <ArcherSymbol className="w-5 h-5 text-brand-gold opacity-50 ml-auto" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
                {titleStart} <span className="italic text-brand-gold">{titleEnd}</span>
              </h1>
              
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-10 mt-8">
                <div className="flex items-start gap-4 p-5 md:p-6 bg-brand-sand/20 rounded-2xl md:rounded-3xl border border-brand-ink/5 hover:bg-brand-sand/40 transition-colors">
                  <div className="bg-white p-3 rounded-xl md:rounded-2xl shadow-sm text-brand-gold flex-shrink-0">
                    <Calendar size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">{t('events.details.date')}</p>
                    <p className="text-sm md:text-base font-medium">{new Date(event.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 md:p-6 bg-brand-sand/20 rounded-2xl md:rounded-3xl border border-brand-ink/5 hover:bg-brand-sand/40 transition-colors">
                  <div className="bg-white p-3 rounded-xl md:rounded-2xl shadow-sm text-brand-gold flex-shrink-0">
                    <Clock size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">{t('events.details.time')}</p>
                    <p className="text-sm md:text-base font-medium">{event.time || t('events.tba')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 md:p-6 bg-brand-sand/20 rounded-2xl md:rounded-3xl sm:col-span-2 border border-brand-ink/5 hover:bg-brand-sand/40 transition-colors">
                  <div className="bg-white p-3 rounded-xl md:rounded-2xl shadow-sm text-brand-gold flex-shrink-0">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">{t('events.details.location')}</p>
                    <p className="text-sm md:text-base font-medium">{dLocation || t('events.vienna')}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10 pb-10 border-b border-brand-ink/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">{t('events.details.fee')}</p>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-brand-gold">
                    {event.price === 0 ? 'Free' : `€${(event.price / 100).toFixed(2)}`}
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={registering || (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity)}
                  className="w-full sm:w-auto bg-brand-ink text-white px-12 py-5 rounded-2xl font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-brand-ink/20"
                >
                  {registering ? <Loader2 className="animate-spin" size={24} /> : (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity) ? 'Sold Out' : t('events.details.cta')}
                </button>
              </div>

              <p className="text-xl md:text-2xl text-brand-ink/70 leading-relaxed font-light whitespace-pre-wrap">
                {dDesc}
              </p>
            </div>

            {event.whatsIncluded && event.whatsIncluded.length > 0 && (
              <div className="mb-10 md:mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-serif">{t('events.details.included')}</h3>
                  <div className="flex-grow h-px bg-brand-ink/5" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.whatsIncluded.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-brand-ink/70">
                      <CheckCircle2 size={18} className="text-brand-gold flex-shrink-0" />
                      <span className="text-sm md:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </motion.div>
        </div>

        <div className="mt-16 md:mt-20">
          <MongolianLine className="w-full text-brand-gold/20 h-8" />
        </div>
      </div>

      {/* Free Event Registration Modal */}
      <AnimatePresence>
        {showRegistrationModal && event && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !registrationSuccess && setShowRegistrationModal(false)}
              className="absolute inset-0 bg-brand-ink/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl"
            >
              {!registrationSuccess && (
                <button 
                  onClick={() => setShowRegistrationModal(false)}
                  className="absolute top-8 right-8 text-brand-ink/40 hover:text-brand-ink transition-colors"
                >
                  <X size={24} />
                </button>
              )}

              {registrationSuccess ? (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="text-3xl font-serif text-brand-ink mb-4">Registration Complete!</h3>
                  <p className="text-brand-ink/60">We look forward to seeing you at {event.title}.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                      {event.price === 0 ? 'Free Event Registration' : 'Event Registration'}
                    </span>
                    <h3 className="text-3xl font-serif text-brand-ink mb-2">{event.title}</h3>
                    <p className="text-brand-ink/60 text-sm">Please provide your details to secure your spot.</p>
                  </div>

                  <form onSubmit={submitRegistration} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={registrationForm.name}
                        onChange={e => setRegistrationForm({...registrationForm, name: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Email Address</label>
                      <input 
                        required
                        type="email"
                        value={registrationForm.email}
                        onChange={e => setRegistrationForm({...registrationForm, email: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        value={registrationForm.phone}
                        onChange={e => setRegistrationForm({...registrationForm, phone: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Additional Notes (Optional)</label>
                      <textarea 
                        value={registrationForm.notes}
                        onChange={e => setRegistrationForm({...registrationForm, notes: e.target.value})}
                        rows={3}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all resize-none"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isRegisteringFree}
                      className="w-full bg-brand-ink text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl shadow-brand-ink/10 flex items-center justify-center gap-3 mt-4"
                    >
                      {isRegisteringFree ? <Loader2 className="animate-spin" size={18} /> : 'Complete Registration'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
