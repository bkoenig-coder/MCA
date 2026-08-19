import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight, Loader2, Info, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, db, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, writeBatch, doc, increment, getDocs, where, handleFirestoreError, OperationType } from '../firebase';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol } from '../components/MongolianDesign';
import { cn } from '@/src/lib/utils';

export default function Events() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registrationForm, setRegistrationForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleSuccessRedirect = async () => {
      const isSuccess = searchParams.get('success') === 'true';
      const eventId = searchParams.get('event_id');
      
      const guestDataRaw = localStorage.getItem('guest_registration');
      const guestData = guestDataRaw ? JSON.parse(guestDataRaw) : { name: 'Guest', email: 'guest@example.com' };
      
      if (isSuccess && eventId) {
        try {
          const uid = user ? user.uid : 'guest';
          const email = user ? user.email : guestData.email;
          const name = user ? user.displayName : guestData.name;

          // Check if already registered
          let isAlreadyRegistered = false;
          if (uid !== 'guest') {
             const q = query(collection(db, 'registrations'), where('eventId', '==', eventId), where('userId', '==', uid));
             const snapshot = await getDocs(q);
             isAlreadyRegistered = !snapshot.empty;
          }
          
          if (!isAlreadyRegistered) {
            // Find event details
            const event = events.find(e => e.id === eventId);
            if (event) {
              setSelectedEvent(event);
              const batch = writeBatch(db);
              
              const regRef = doc(collection(db, 'registrations'));
              batch.set(regRef, {
                eventId: event.id,
                eventTitle: event.title,
                userId: uid,
                userEmail: email || '',
                name: name || '',
                email: email || '',
                phone: guestData.phone || '',
                notes: guestData.notes || '',
                status: 'paid',
                amount: event.price,
                createdAt: serverTimestamp(),
              });

              const eventRef = doc(db, 'events', event.id);
              batch.update(eventRef, {
                registeredCount: increment(1)
              });

              await batch.commit();
            }
          } else {
             const event = events.find(e => e.id === eventId);
             if (event) setSelectedEvent(event);
          }
          
          // Clear URL params
          setSearchParams({});
          setShowRegistrationModal(true);
          setRegistrationSuccess(true);
          localStorage.removeItem('guest_registration');
          setTimeout(() => {
             setRegistrationSuccess(false);
             setShowRegistrationModal(false);
             setSelectedEvent(null);
          }, 5000);
        } catch (error) {
          console.error("Error processing successful registration:", error);
        }
      }
    };

    if (events.length > 0) {
      handleSuccessRedirect();
    }
  }, [searchParams, user, events, setSearchParams]);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (event: any) => {
    setError(null);
    setSelectedEvent(event);
    setRegistrationForm({ ...registrationForm, name: user?.displayName || '', email: user?.email || '' });
    setShowRegistrationModal(true);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (selectedEvent.price > 0) {
      setLoadingId(selectedEvent.id);
      setIsRegistering(true);
      try {
        localStorage.setItem('guest_registration', JSON.stringify({
          name: registrationForm.name,
          email: registrationForm.email,
          phone: registrationForm.phone,
          notes: registrationForm.notes,
        }));

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            eventTitle: selectedEvent.title,
            price: selectedEvent.price,
            userId: user ? user.uid : 'guest',
            userEmail: registrationForm.email,
            returnUrl: window.location.origin
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || t('common.error.server'));
        }

        if (data.url) {
          if (window !== window.top) {
             window.open(data.url, '_blank');
          } else {
             window.location.href = data.url;
          }
        } else {
          throw new Error(t('common.error.checkout'));
        }
      } catch (err: any) {
        setError(err.message || t('common.error.unexpected'));
      } finally {
        setLoadingId(null);
        setIsRegistering(false);
        setShowRegistrationModal(false);
      }
      return;
    }

    setIsRegistering(true);
    try {
      const batch = writeBatch(db);
      
      const regRef = doc(collection(db, 'registrations'));
      batch.set(regRef, {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
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

      const eventRef = doc(db, 'events', selectedEvent.id);
      batch.update(eventRef, {
        registeredCount: increment(1)
      });

      await batch.commit();

      setRegistrationSuccess(true);
      setTimeout(() => {
        setShowRegistrationModal(false);
        setRegistrationSuccess(false);
        setSelectedEvent(null);
        setRegistrationForm({ name: '', email: '', phone: '', notes: '' });
      }, 3000);
    } catch (err) {
      console.error("Error registering:", err);
      setError("Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="pt-[140px] md:pt-[152px]">
      {/* Hero */}
      <section className="relative min-h-[380px] md:h-[460px] flex items-center px-6 text-white overflow-hidden border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://plus.unsplash.com/premium_photo-1769868292024-22f57678074e?q=80&w=1600&auto=format&fit=crop" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <UlziiSymbol className="w-5 h-5 text-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-brand-gold">{t('events.tag')}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight">
              {t('events.title')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('events.titleItalic')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {loading ? (
            <div className="flex justify-center py-24 md:py-40">
              <Loader2 className="animate-spin text-brand-gold" size={48} />
            </div>
          ) : (
            <div className="space-y-24 md:space-y-40">
              {/* Upcoming Events */}
              <div>
                <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-12">Upcoming Events</h2>
                <div className="space-y-8 md:space-y-12">
                  {events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0, 0, 0, 0)).length === 0 ? (
                    <p className="text-brand-ink/60 font-medium">No upcoming events at the moment.</p>
                  ) : events.filter(e => new Date(e.date).getTime() >= new Date().setHours(0, 0, 0, 0)).map((event, idx) => {
                    const lang = i18n.language;
                    const dTitle = lang === 'mn' ? (event.titleMn || event.title) : lang === 'de' ? (event.titleDe || event.title) : (event.titleEn || event.title);
                    const dDesc = lang === 'mn' ? (event.descriptionMn || event.description) : lang === 'de' ? (event.descriptionDe || event.description) : (event.descriptionEn || event.description);
                    const dLocation = lang === 'mn' ? (event.locationMn || event.location) : lang === 'de' ? (event.locationDe || event.location) : (event.locationEn || event.location);
                    const dCat = lang === 'mn' ? (event.categoryMn || event.category) : lang === 'de' ? (event.categoryDe || event.category) : (event.categoryEn || event.category);

                    return (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group bg-white rounded-[32px] md:rounded-[48px] overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row"
                    >
                      {/* Image Section */}
                      <div className="md:w-[40%] relative overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[350px]">
                        <img 
                          src={event.imageUrl} 
                          alt={dTitle} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                      </div>
                      
                      {/* Content Section */}
                      <div className="md:w-[60%] p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-brand-paper rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-gold">
                              {dCat || t('events.defaultCategory')}
                            </span>
                            {event.capacity > 0 && (
                              <span className="px-4 py-1.5 bg-brand-ink/5 rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-ink/60">
                                {event.registeredCount || 0}/{event.capacity} Spots Filled
                              </span>
                            )}
                          </div>
                          <span className="font-serif text-xl text-brand-ink">
                            {event.price === 0 ? 'Free' : `€${(event.price / 100).toFixed(2)}`}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-serif text-brand-ink mb-4 group-hover:text-brand-gold transition-colors duration-500">
                          {dTitle}
                        </h3>
                        
                        <p className="text-brand-ink/60 font-light leading-relaxed mb-8 line-clamp-2">
                          {dDesc}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                          <div className="flex items-center gap-3 text-brand-ink/60">
                            <Calendar size={16} className="text-brand-gold" />
                            <span className="text-[11px] uppercase tracking-widest font-medium">
                              {new Date(event.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-brand-ink/60">
                            <Clock size={16} className="text-brand-gold" />
                            <span className="text-[11px] uppercase tracking-widest font-medium">
                              {event.time || t('events.tba')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-brand-ink/60">
                            <MapPin size={16} className="text-brand-gold" />
                            <span className="text-[11px] uppercase tracking-widest font-medium truncate">
                              {dLocation || t('events.vienna')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => handleRegister(event)}
                            disabled={loadingId === event.id || (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity)}
                            className="flex-1 bg-brand-ink text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-gold transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            {loadingId === event.id ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity) ? (
                              <>Sold Out <X size={14} /></>
                            ) : (
                              <>{t('events.register')} <ArrowRight size={14} /></>
                            )}
                          </button>
                          <Link 
                            to={`/events/${event.id}`}
                            className="flex-1 border border-brand-ink/20 text-brand-ink px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:border-brand-gold hover:text-brand-gold transition-all text-center flex items-center justify-center gap-3"
                          >
                            {t('events.viewDetails')} <Info size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Past Events */}
              {events.filter(e => new Date(e.date).getTime() < new Date().setHours(0, 0, 0, 0)).length > 0 && (
                <div>
                  <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-12">Past Events</h2>
                  <div className="space-y-8 md:space-y-12">
                    {events.filter(e => new Date(e.date).getTime() < new Date().setHours(0, 0, 0, 0)).map((event, idx) => {
                      const lang = i18n.language;
                      const dTitle = lang === 'mn' ? (event.titleMn || event.title) : lang === 'de' ? (event.titleDe || event.title) : (event.titleEn || event.title);
                      const dDesc = lang === 'mn' ? (event.descriptionMn || event.description) : lang === 'de' ? (event.descriptionDe || event.description) : (event.descriptionEn || event.description);
                      const dLocation = lang === 'mn' ? (event.locationMn || event.location) : lang === 'de' ? (event.locationDe || event.location) : (event.locationEn || event.location);
                      const dCat = lang === 'mn' ? (event.categoryMn || event.category) : lang === 'de' ? (event.categoryDe || event.category) : (event.categoryEn || event.category);

                      return (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="group bg-white rounded-[32px] md:rounded-[48px] overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row opacity-80"
                      >
                        {/* Image Section */}
                        <div className="md:w-[40%] relative overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[350px] grayscale-[30%]">
                          <img 
                            src={event.imageUrl} 
                            alt={dTitle} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                        </div>
                        
                        {/* Content Section */}
                        <div className="md:w-[60%] p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <span className="px-4 py-1.5 bg-brand-paper rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-gold">
                                {dCat || t('events.defaultCategory')}
                              </span>
                            </div>
                            <span className="font-serif text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">
                              Completed
                            </span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-serif text-brand-ink mb-4 group-hover:text-brand-gold transition-colors duration-500">
                            {dTitle}
                          </h3>
                          
                          <p className="text-brand-ink/60 font-light leading-relaxed mb-8 line-clamp-2">
                            {dDesc}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                            <div className="flex items-center gap-3 text-brand-ink/60">
                              <Calendar size={16} className="text-brand-gold border border-brand-gold rounded-full p-0.5" />
                              <span className="text-[11px] uppercase tracking-widest font-medium">
                                {new Date(event.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-brand-ink/60">
                              <Clock size={16} className="text-brand-gold border border-brand-gold rounded-full p-0.5" />
                              <span className="text-[11px] uppercase tracking-widest font-medium">
                                {event.time || t('events.tba')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-brand-ink/60">
                              <MapPin size={16} className="text-brand-gold border border-brand-gold rounded-full p-0.5" />
                              <span className="text-[11px] uppercase tracking-widest font-medium truncate">
                                {dLocation || t('events.vienna')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <Link 
                              to={`/events/${event.id}`}
                              className="w-full bg-brand-sand/50 text-brand-ink px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-sand transition-all text-center flex items-center justify-center gap-3"
                            >
                              View Event Details & Photos <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Private Events CTA */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-12 text-brand-gold">
            <UlziiSymbol className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-8 md:mb-10 tracking-tight">
            {t('events.bespoke.title')} <span className="italic text-brand-gold">{t('events.bespoke.titleItalic')}</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-ink/60 font-light leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('events.bespoke.desc')}
          </p>
          <Link to="/contact" className="w-full sm:w-auto inline-block border border-brand-ink/20 text-brand-ink px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:border-brand-gold hover:text-brand-gold transition-all">
            {t('events.bespoke.cta')}
          </Link>
        </div>
      </section>

      {/* Free Event Registration Modal */}
      <AnimatePresence>
        {showRegistrationModal && selectedEvent && (
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
                  <p className="text-brand-ink/60">We look forward to seeing you at {selectedEvent.title}.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                      {selectedEvent.price === 0 ? 'Free Event Registration' : 'Event Registration'}
                    </span>
                    <h3 className="text-3xl font-serif text-brand-ink mb-2">{selectedEvent.title}</h3>
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
                      disabled={isRegistering}
                      className="w-full bg-brand-ink text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-3 mt-4"
                    >
                      {isRegistering ? <Loader2 className="animate-spin" size={18} /> : 'Complete Registration'}
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
