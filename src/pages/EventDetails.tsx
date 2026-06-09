import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, doc, getDoc, OperationType, handleFirestoreError, signInWithGoogle, addDoc, collection, serverTimestamp, writeBatch, increment } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, Loader2, AlertCircle, X, ChevronLeft, ChevronRight, Check, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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
                returnUrl: window.location.origin
             })
          });
          const data = await response.json();
          if (data.url) {
            if (window !== window.top) {
               window.open(data.url, '_blank');
            } else {
               window.location.href = data.url;
            }
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

  const shareUrl = "https://mongoliancenter.org" + window.location.pathname;
  const shareTitle = dTitle;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden bg-brand-paper">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors mb-8 md:mb-10 font-bold uppercase tracking-widest text-[10px] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('events.details.back')}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          {/* Header */}
          <header className="mb-10 md:mb-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#b82736] bg-[#b82736]/10 px-3 py-1 rounded-sm">{dCat || t('events.details.category')}</span>
              <div className="h-px w-6 bg-brand-ink/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/50">
                {new Date(event.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-8 text-brand-ink px-4 tracking-tight drop-shadow-sm">
              {titleStart} <span className="italic text-brand-gold">{titleEnd}</span>
            </h1>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-brand-ink leading-tight">MONGOLIAN CENTER</span>
                <span className="text-[10px] text-brand-ink/50 uppercase tracking-widest font-bold">{dLocation || t('events.vienna')} • {event.time || t('events.tba')}</span>
              </div>
            </div>
          </header>

          {/* Featured Image Slider */}
          <div className="-mx-6 w-[calc(100%+3rem)] md:mx-0 md:w-full relative aspect-[4/3] md:aspect-[2.5/1] md:rounded-[4px] overflow-hidden shadow-lg mb-12 md:mb-20 bg-brand-ink/5 border-y md:border border-brand-ink/10 group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={allImages[currentImageIndex]} 
                alt={dTitle} 
                className="w-full h-full object-cover mix-blend-multiply absolute inset-0 cursor-grab active:cursor-grabbing"
                referrerPolicy="no-referrer"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const swipe = offset.x;
                  if (swipe < -50) {
                    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                  } else if (swipe > 50) {
                    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                  }
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/20 to-transparent mix-blend-overlay pointer-events-none"></div>

            {allImages.length > 1 && (
              <>
                <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_7fr] gap-12 lg:gap-16 max-w-[1100px] mx-auto w-full px-4 md:px-0">
            {/* Left Sidebar (Registration & Meta) */}
            <aside className="flex flex-col gap-8 lg:sticky lg:top-32 h-fit text-brand-ink">
              
              {/* Registration Card */}
              <div className="bg-white p-6 rounded-2xl md:rounded-[4px] border border-brand-ink/10 shadow-sm flex flex-col items-center text-center">
                 <p className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/50 mb-2">{t('events.details.fee')}</p>
                 <p className="text-3xl md:text-4xl font-serif text-brand-ink mb-6">
                   {event.price === 0 ? 'Free' : `€${(event.price / 100).toFixed(2)}`}
                 </p>
                 {event.capacity > 0 && (
                   <span className="inline-block px-3 py-1 mb-6 rounded-sm bg-brand-ink/5 text-brand-ink/60 text-[10px] font-bold uppercase tracking-widest">
                     {event.registeredCount || 0}/{event.capacity} Spots Filled
                   </span>
                 )}
                 <button
                   onClick={handleRegister}
                   disabled={registering || (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity)}
                   className="w-full bg-brand-ink text-white py-4 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {registering ? <Loader2 className="animate-spin" size={18} /> : (event.capacity > 0 && (event.registeredCount || 0) >= event.capacity) ? 'Sold Out' : t('events.details.cta')}
                 </button>
              </div>

               {/* Event Details snippet */}
              <div className="flex flex-col gap-4 px-2">
                 <div className="flex gap-4 items-start text-brand-ink/80">
                    <Calendar size={18} className="text-brand-ink/40 mt-0.5" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#b82736]">{t('events.details.date')}</span>
                       <span className="text-sm">{new Date(event.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start text-brand-ink/80">
                    <Clock size={18} className="text-brand-ink/40 mt-0.5" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#b82736]">{t('events.details.time')}</span>
                       <span className="text-sm">{event.time || t('events.tba')}</span>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start text-brand-ink/80">
                    <MapPin size={18} className="text-brand-ink/40 mt-0.5" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#b82736]">{t('events.details.location')}</span>
                       <span className="text-sm">{dLocation || t('events.vienna')}</span>
                    </div>
                 </div>
              </div>

               {/* Share snippet */}
               <div className="flex flex-col gap-4 px-2 mt-8 mb-4 border-t border-brand-ink/10 pt-8">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/50">Share Event</span>
                 <div className="flex gap-2">
                   <button
                     onClick={() => handleShare("facebook")}
                     className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                     aria-label="Share Facebook"
                   >
                     <Facebook size={16} />
                   </button>
                   <button
                     onClick={() => handleShare("twitter")}
                     className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
                     aria-label="Share Twitter"
                   >
                     <Twitter size={16} />
                   </button>
                   <button
                     onClick={() => handleShare("linkedin")}
                     className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
                     aria-label="Share LinkedIn"
                   >
                     <Linkedin size={16} />
                   </button>
                   <button
                     onClick={handleCopyLink}
                     className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-colors"
                     aria-label="Copy Link"
                   >
                     {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                   </button>
                 </div>
               </div>

            </aside>

            {/* Content */}
            <div className="prose prose-lg md:prose-xl w-full max-w-none text-brand-ink/90 font-light leading-[1.8] prose-p:mb-8 prose-strong:font-medium prose-strong:text-brand-ink overflow-hidden">
               {/* Mobile Registration Sticky */}
              <div className="block lg:hidden w-full mb-10 pb-10 border-b border-brand-ink/10"></div> 

              {/* Mobile Share Snippet */}
              <div className="flex lg:hidden items-center justify-between border-b border-brand-ink/10 pb-10 mb-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/50">
                  Share Event
                </span>
                <div className="flex gap-2">
                  <button
                     onClick={() => handleShare("facebook")}
                     className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#1877F2] hover:text-white transition-colors"
                  >
                    <Facebook size={14} />
                  </button>
                  <button
                     onClick={() => handleShare("twitter")}
                     className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#1DA1F2] hover:text-white transition-colors"
                  >
                    <Twitter size={14} />
                  </button>
                  <button
                     onClick={() => handleShare("linkedin")}
                     className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#0A66C2] hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </button>
                  <button
                     onClick={handleCopyLink}
                     className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-brand-ink hover:text-white transition-colors"
                     aria-label="Copy Link"
                  >
                    {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                  </button>
                </div>
              </div>

              {/* Description rendering */}
              {(() => {
                const paragraphs = dDesc.split("\n").map((p: string) => p.trim()).filter(Boolean);
                return paragraphs.map((text: string, pIdx: number) => {
                  return (
                    <p
                      key={pIdx}
                      className="mb-8 font-sans text-lg md:text-xl leading-[1.8] text-brand-ink/90"
                    >
                      {text}
                    </p>
                  );
                });
              })()}

              {/* What's included block */}
              {event.whatsIncluded && event.whatsIncluded.length > 0 && (
                <div className="mt-16 mb-8">
                  <h2 className="text-2xl md:text-3xl font-serif text-brand-ink mt-16 mb-8 tracking-tight border-t border-brand-ink/10 pt-10">{t('events.details.included')}</h2>
                  <div className="grid sm:grid-cols-2 gap-4 not-prose">
                    {event.whatsIncluded.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-brand-ink/80 p-4 border border-brand-ink/10 rounded-sm">
                        <CheckCircle2 size={18} className="text-[#b82736] flex-shrink-0" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.article>

        <div className="mt-16 md:mt-24 max-w-2xl mx-auto">
          <MongolianLine className="w-full text-brand-gold/30 h-8 md:h-12" />
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
