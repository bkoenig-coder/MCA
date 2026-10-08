import { motion, AnimatePresence } from 'motion/react';
import HeroVideo from '../components/HeroVideo';
import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { ArrowRight, Calendar, Palette, Heart, Users, Shield, Sword, Clock, MapPin, Loader2, Info, Star, Handshake, Lightbulb, ArrowRightLeft, TrendingUp, Instagram, ChevronLeft, ChevronRight, Award, CheckCircle2, Landmark, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol, MongolianFormalFrame, MongolianKhasDivider, MeanderBand, EyebrowMark, SectionSeam, CloudDrift, CloudSky } from '../components/MongolianDesign';
import { db, collection, onSnapshot, query, orderBy, limit, where, handleFirestoreError, OperationType } from '../firebase';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euActiveLogo from '../assets/media/euactivelogo.png';
import amoxLogo from '../assets/media/amoxlogo.png';
import delgerLogo from '../assets/media/delgerlogo.png';
import mcaLogoWideLight from '../assets/media/mca-logo-wide-light.png';

import { Overlay } from '../components/diorama/Overlay';
import BridgeMap, { BRIDGE_DISTANCE_KM } from '../components/BridgeMap';

import LetsPlayGame from '../components/game/LetsPlayGame';
import ScriptPlaque from '../components/ScriptPlaque';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [showingPastEvents, setShowingPastEvents] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const membershipSlides = [
    {
      icon: Award,
      title: t('homeMembership.slides.professional.title'),
      benefits: [
        t('homeMembership.slides.professional.benefit1'),
        t('homeMembership.slides.professional.benefit2'),
        t('homeMembership.slides.professional.benefit3'),
        t('homeMembership.slides.professional.benefit4')
      ],
      path: "/membership/apply-professional",
      image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "text-brand-gold",
      bgClass: "bg-brand-gold",
      accentBorder: "border-brand-gold/30",
      accentBgHover: "group-hover:bg-brand-gold/30"
    },
    {
      icon: Users,
      title: t('homeMembership.slides.student.title'),
      benefits: [
        t('homeMembership.slides.student.benefit1'),
        t('homeMembership.slides.student.benefit2'),
        t('homeMembership.slides.student.benefit3'),
        t('homeMembership.slides.student.benefit4')
      ],
      path: "/membership/apply-student",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
      color: "text-blue-400",
      bgClass: "bg-blue-400",
      accentBorder: "border-blue-400/30",
      accentBgHover: "group-hover:bg-blue-400/30"
    },
    {
      icon: Handshake,
      title: t('homeMembership.slides.institutional.title'),
      benefits: [
        t('homeMembership.slides.institutional.benefit1'),
        t('homeMembership.slides.institutional.benefit2'),
        t('homeMembership.slides.institutional.benefit3'),
        t('homeMembership.slides.institutional.benefit4')
      ],
      path: "/membership/apply-institutional",
      image: "https://images.unsplash.com/photo-1571645163064-77faa9676a46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "text-emerald-400",
      bgClass: "bg-emerald-400",
      accentBorder: "border-emerald-400/30",
      accentBgHover: "group-hover:bg-emerald-400/30"
    }
  ];



  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const newsScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Upcoming events (soonest first). If there are none, fall back to the most recent past events.
    const q = query(collection(db, 'events'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const upcoming = all.filter(e => e.date >= today).sort((x, y) => (x.date > y.date ? 1 : -1));
      if (upcoming.length > 0) {
        setEvents(upcoming.slice(0, 3));
        setShowingPastEvents(false);
      } else {
        setEvents(all.slice(0, 3)); // already newest-first
        setShowingPastEvents(all.length > 0);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
      setEvents([]);
      setLoading(false);
    });

    const qNews = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(12));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      if (!snapshot.empty) {
        setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setNews([]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
      setNews([]);
    });

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(12));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      if (!snapshot.empty) {
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setGallery([]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
      setGallery([]);
    });

    return () => { unsubscribe(); unsubNews(); unsubGallery(); };
  }, []);

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[calc(100vh-7rem)] md:min-h-[600px] flex items-center overflow-hidden bg-[#050B14] group">
        <div className="absolute inset-0 z-0">
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14]/95 via-[#050B14]/50 to-transparent z-10 pointer-events-none" />
          
          {/* Background video: poster first, then a light 30-second loop */}
          <HeroVideo />
        </div>

        <Overlay activePopup={activePopup} onClose={() => setActivePopup(null)} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-20 relative py-12 md:py-0 pointer-events-none">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_300px] gap-12 lg:gap-16 items-center">
            <div className="flex flex-col">
              <div className="flex items-start gap-6 md:gap-0">
                <div className="flex-1 pointer-events-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-8 max-w-full overflow-hidden">
                      <div className="h-px w-8 sm:w-12 bg-brand-gold/40 shrink-0" />
                      <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold whitespace-nowrap">
                        {t('hero.tag')}
                      </span>
                    </div>
                    <h1 className={cn(
                      "font-serif font-normal tracking-tight text-white mb-6 md:mb-10 drop-shadow-lg",
                      "text-3xl sm:text-4xl",
                      "md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-[1.18] md:leading-[1.1] text-balance"
                    )}>
                      {t('hero.title')} <br />
                      <span className="italic text-brand-gold font-light">{t('hero.titleItalic')}</span>
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-2xl mb-8 md:mb-12 leading-relaxed font-normal pt-0 drop-shadow-md">
                      {t('hero.subtitle')}
                    </p>
                  </motion.div>
                </div>

                {/* Official Plaque - vertical Mongolian script (phone, small, beside the text) */}
                <div className="md:hidden relative flex-shrink-0 pt-8">
                  <ScriptPlaque mini />
                </div>

                {/* Official Plaque - vertical Mongolian script (tablet) */}
                <div className="hidden md:block lg:hidden relative flex-shrink-0 pt-6 ml-4">
                  <ScriptPlaque compact />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap gap-3 md:gap-4 relative z-20 pointer-events-auto"
              >
                <Link to="/events" className="btn-shimmer w-full sm:w-auto flex-1 text-center bg-brand-gold text-slate-950 px-7 py-3.5 md:py-4 rounded-lg text-[11px] md:text-xs uppercase tracking-[0.14em] font-semibold hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all shadow-lg group whitespace-nowrap flex items-center justify-center gap-2">
                  <span>{t('hero.ctaEvents')}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/membership" className="w-full sm:w-auto flex-1 text-center border border-brand-gold/60 text-white hover:text-brand-gold hover:border-brand-gold px-7 py-3.5 md:py-4 rounded-lg text-[11px] md:text-xs uppercase tracking-[0.14em] font-semibold transition-all whitespace-nowrap bg-white/10 backdrop-blur-md flex items-center justify-center">
                  {t('homeMembership.btnApply')}
                </Link>
                <Link to="/diorama" className="w-full sm:w-auto flex-1 text-center border border-white/20 text-white/90 hover:text-white hover:border-white/40 px-6 py-3.5 md:py-4 rounded-lg text-[11px] md:text-xs uppercase tracking-[0.14em] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 group whitespace-nowrap bg-white/5 backdrop-blur-md">
                  <SoyomboSymbol className="w-3.5 h-3.5 text-brand-gold group-hover:rotate-12 transition-transform duration-300" />
                  <span>{t('siteUi.home.tour')}</span>
                </Link>
              </motion.div>
            </div>

            {/* Official Plaque - vertical Mongolian script (desktop) */}
            <div className="hidden lg:flex items-center justify-center relative w-full py-4 pointer-events-none">
              <ScriptPlaque />
            </div>
          </div>
        </div>
        <MeanderBand className="absolute bottom-0 left-0 right-0 z-20 bg-brand-gold/50" />
      </section>

      {/* Bridge: Ulaanbaatar to Vienna */}
      <section className="pt-6 pb-16 md:pb-24 bg-white relative overflow-hidden">
        <CloudSky className="h-28 mb-8 md:mb-12 opacity-90" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-4 mb-3">
                <EyebrowMark />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('siteUi.home.bridge.tag')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink mb-5">
                {t('siteUi.home.bridge.titleNormal')}<span className="italic text-brand-gold">{t('siteUi.home.bridge.titleItalic')}</span>
              </h2>
              <p className="text-base md:text-lg text-brand-ink/80 leading-relaxed mb-8">
                {t('siteUi.home.bridge.desc')}
              </p>
              <div className="flex items-baseline gap-3 border-t border-slate-200 pt-6">
                <span className="text-4xl font-serif text-brand-blue">{'≈ ' + BRIDGE_DISTANCE_KM.toLocaleString('en')}</span>
                <span className="text-sm text-slate-600">{t('siteUi.home.bridge.km')}</span>
              </div>
            </motion.div>
            <div className="lg:col-span-7">
              <BridgeMap viennaLabel={t('footer.vienna')} ulaanbaatarLabel={t('footer.ulaanbaatar')} />
            </div>
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Partners Marquee Section - Corporate Refactor */}
      <section className="py-10 md:py-12 bg-white relative overflow-hidden border-y border-gray-200">
        <div className="text-center mb-6 relative z-20">
          <h3 className="text-xs md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            {t('siteUi.home.partnersTitle')}
          </h3>
          <div className="w-8 h-0.5 bg-[#760000] mx-auto mt-2.5" />
        </div>

        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-hidden relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: isMobile ? 8 : 20, ease: "linear", repeat: Infinity }}
            className="flex w-max relative z-20"
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                {[
                  { name: 'Embassy of Mongolia in Vienna', src: '/embassy logo.png', url: 'https://vienna.embassy.mn/' },
                  { name: 'Deutschothek Sprachschule', src: deutschotekLogo, url: 'https://deutschothek.com/' },
                  { name: 'Verein für aktiv Leben und Bildung', src: euActiveLogo, url: 'https://www.euactive.org/' },
                  { name: 'Verein der mongolischen StudentInnen in Österreich', src: amoxLogo, url: 'https://www.facebook.com/MongolianStudentAssociationInAustria' },
                  { name: 'Gmax Mongolischer Kinder-und Jugendverein', src: '/gmax logo.jpg', url: 'https://www.facebook.com/gmax.gmax.9406' },
                  { name: 'Delger Mongolian Placement', src: delgerLogo, url: 'https://www.delger-placement.at/' }
                ].map((partner, idx) => (
                  <a 
                    key={`${groupIndex}-${idx}`} 
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="flex flex-col items-center justify-center gap-2.5 group cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center h-14 md:h-16 min-w-[150px] md:min-w-[180px] group-hover:-translate-y-0.5 transition-transform duration-300 will-change-transform">
                      <img 
                        src={partner.src} 
                        alt={partner.name} 
                        loading="lazy"
                        className="h-full w-auto max-h-[56px] md:max-h-[64px] object-contain transition-all duration-300" 
                      />
                    </div>
                    <span className="font-sans font-medium text-[11px] md:text-[11px] tracking-widest uppercase text-center text-gray-500 group-hover:text-[#760000] transition-colors duration-300 max-w-[140px] md:max-w-[180px] truncate">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionSeam />
      {/* Membership Highlights CTA Section - Simplified NGO grid */}
      <section className="py-10 md:py-14 bg-white relative overflow-hidden border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-2">
                <EyebrowMark />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('homeMembership.tag')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-brand-ink mb-2 leading-tight">
                {t('homeMembership.titleNormal')}<span className="italic text-brand-gold">{t('homeMembership.titleItalic')}</span>
              </h2>
              <p className="text-sm md:text-base text-brand-ink/80 leading-relaxed">
                {t('homeMembership.desc')}
              </p>
            </div>
            <Link to="/membership" className="group shrink-0 inline-flex items-center justify-center gap-3 bg-brand-ink text-white px-6 py-3 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-brand-blue transition-colors duration-300">
              {t('homeMembership.btnExplore')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {membershipSlides.map((slide, i) => {
              const Icon = slide.icon;
              return (
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={slide.path}
                    className="group flex items-center gap-4 bg-white border border-slate-200 hover:border-brand-blue/40 rounded-xl px-5 py-4 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-serif text-brand-ink leading-tight">{slide.title}</h3>
                      <p className="text-sm text-slate-500 truncate">{slide.benefits[0]}</p>
                    </div>
                    <ArrowRight size={16} className="text-brand-blue shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {news.length > 0 && (<>
      <SectionSeam />
      {/* Featured News Carousel */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <CloudDrift variant="b" className="top-8 right-[4%] w-36 md:w-60 opacity-[0.2]" delay={2} duration={30} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('news.ourVoice')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink">
              {(() => {
                const parts = t('news.featuredNews').split(' ');
                const last = parts.pop();
                const first = parts.join(' ');
                return (
                  <>
                    {first} <span className="italic text-brand-gold">{last}</span>
                  </>
                );
              })()}
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/news" className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-brand-ink hover:text-brand-blue transition-colors flex items-center gap-2 border-b border-brand-ink/10 pb-1">{t('news.allNews')} <ArrowRight size={12}/></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div 
            ref={newsScrollRef}
            className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {news.map((item, index) => {
              const lang = i18n.language;
              const dTitle = lang === 'mn' ? (item.titleMn || item.title) : lang === 'de' ? (item.titleDe || item.title) : lang === 'tr' ? (item.titleTr || item.titleEn || item.title) : (item.titleEn || item.title);
              const dContent = lang === 'mn' ? (item.contentMn || item.content) : lang === 'de' ? (item.contentDe || item.content) : lang === 'tr' ? (item.contentTr || item.contentEn || item.content) : (item.contentEn || item.content);
              return (
              <motion.div 
                key={item.id} 
                className="w-[85vw] md:w-[350px] shrink-0 flex"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                <Link to={`/news/${item.slug || item.id}`} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-ink">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={dTitle} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <span className="text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold mb-3">{t('news.featuredTag')}</span>
                      <h3 className="text-xl font-serif text-brand-ink mb-3 line-clamp-2 leading-snug">{dTitle}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">{item.excerpt || dContent}</p>
                      <span className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink group-hover:text-brand-blue transition-colors">
                        {t('news.readStory')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
              </motion.div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
             <button onClick={() => scrollLeft(newsScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={() => scrollRight(newsScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </section>
      </>)}

      {gallery.length > 0 && (<>
      <SectionSeam />
      {/* Featured Gallery Carousel */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('gallery.ourVision')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink">
              {(() => {
                const parts = t('gallery.featuredGallery').split(' ');
                const last = parts.pop();
                const first = parts.join(' ');
                return (
                  <>
                    {first} <span className="italic text-brand-gold">{last}</span>
                  </>
                );
              })()}
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6">
              <Link to="/gallery" className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-brand-ink hover:text-brand-blue transition-colors flex items-center gap-2 border-b border-brand-ink/10 pb-1">{t('gallery.allGallery')} <ArrowRight size={12}/></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div 
            ref={galleryScrollRef}
            className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {gallery.map((item, index) => {
              const lang = i18n.language;
              const dTitle = lang === 'mn' ? (item.titleMn || item.title) : lang === 'de' ? (item.titleDe || item.title) : lang === 'tr' ? (item.titleTr || item.titleEn || item.title) : (item.titleEn || item.title);
              return (
              <motion.div 
                key={item.id} 
                className="min-w-[85vw] md:min-w-[350px] shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                  <Link to={`/gallery/${item.id}`} className="group relative rounded-2xl overflow-hidden h-[450px] block bg-brand-ink shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_60px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:ring-white/20 transition-all duration-300">
                    {/* Background Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                    {item.imageUrl && (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={item.imageUrl} alt={dTitle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                    
                    {/* Subtle Border Glow */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-colors duration-300 pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-serif text-white mb-2 line-clamp-2 drop-shadow-md">{dTitle}</h3>
                      <div className="flex items-center gap-2 text-brand-gold font-bold text-[11px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 drop-shadow-sm">{t('gallery.viewCapture')} <ArrowRight size={12}/></div>
                    </div>
                  </Link>
              </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-4">
             <button onClick={() => scrollLeft(galleryScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={() => scrollRight(galleryScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </section>
      </>)}

      {(loading || events.length > 0) && (
        <>
        <SectionSeam />
        {/* Featured Events Preview - Dynamic List */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <EyebrowMark />
                  <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{showingPastEvents ? t('siteUi.home.pastEvents') : t('highlight.tag')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink">
                  {t('highlight.title')} <span className="italic text-brand-gold">{t('highlight.titleItalic')}</span>
                </h2>
              </div>
              <Link to="/events" className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-brand-ink hover:text-brand-blue transition-colors flex items-center gap-2 border-b border-brand-ink/10 pb-1">
                {t('highlight.cta')} <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20 min-h-[200px]">
                {/* Spinner removed */}
              </div>
            ) : (
              <div className="relative">
                <div 
                  ref={eventsScrollRef}
                  className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar mt-6 md:mt-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {events.map((event, index) => {
                    const lang = i18n.language;
                    const dTitle = lang === 'mn' ? (event.titleMn || event.title) : lang === 'de' ? (event.titleDe || event.title) : lang === 'tr' ? (event.titleTr || event.titleEn || event.title) : (event.titleEn || event.title);
                    const dDesc = lang === 'mn' ? (event.descriptionMn || event.description) : lang === 'de' ? (event.descriptionDe || event.description) : lang === 'tr' ? (event.descriptionTr || event.descriptionEn || event.description) : (event.descriptionEn || event.description);
                    const dLocation = lang === 'mn' ? (event.locationMn || event.location) : lang === 'de' ? (event.locationDe || event.location) : lang === 'tr' ? (event.locationTr || event.locationEn || event.location) : (event.locationEn || event.location);
                    const dCat = lang === 'mn' ? (event.categoryMn || event.category) : lang === 'de' ? (event.categoryDe || event.category) : lang === 'tr' ? (event.categoryTr || event.categoryEn || event.category) : (event.categoryEn || event.category);

                    return (
                    <motion.div 
                      key={event.id} 
                      className="w-[85vw] md:w-auto min-w-0 md:basis-[calc((100%-3rem)/3)] md:grow shrink-0 flex"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    >
                        <Link to={`/events/${event.id}`} className="group flex flex-col h-full w-full bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300">
                          <div className="relative aspect-[16/10] overflow-hidden bg-brand-ink">
                            {event.imageUrl && (
                              <img src={event.imageUrl} alt={dTitle} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                            )}
                            <div className="absolute top-4 left-4 bg-white text-brand-ink rounded-lg shadow-sm px-3 py-2 flex flex-col items-center min-w-[52px] leading-none">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-gold">
                                {new Date(event.date).toLocaleDateString(t('common.locale'), { month: 'short' })}
                              </span>
                              <span className="text-xl font-serif font-semibold mt-1">{new Date(event.date).getDate()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col flex-1 p-6">
                            <span className="text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold mb-3">{dCat || t('events.defaultCategory')}</span>
                            <h3 className="text-xl font-serif text-brand-ink mb-3 line-clamp-2 leading-snug">{dTitle}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5">{dDesc}</p>
                            <div className="flex flex-col gap-1.5 text-[13px] text-slate-500 mb-6">
                              <div className="flex items-center gap-2"><Clock size={14} className="shrink-0 text-brand-blue" /> {event.time || t('events.tba')}</div>
                              <div className="flex items-center gap-2 min-w-0"><MapPin size={14} className="shrink-0 text-brand-blue" /> <span className="truncate">{dLocation || t('events.vienna')}</span></div>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink group-hover:text-brand-blue transition-colors">
                                {t('events.viewDetails')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="font-serif text-lg text-brand-ink">
                                {event.price === 0 ? t('membershipPage.tiers.free') : `€${(event.price / 100).toFixed(2)}`}
                              </span>
                            </div>
                          </div>
                        </Link>
                    </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button onClick={() => scrollLeft(eventsScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => scrollRight(eventsScrollRef)} className="w-12 h-12 rounded-full border border-brand-ink/20 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors duration-300">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        </>
      )}

      <SectionSeam />
      {/* Pillars Section - Redesigned for Prestige & Impact */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <CloudDrift variant="a" className="bottom-10 left-[3%] w-36 md:w-64 opacity-[0.2]" duration={26} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('siteUi.home.foundation.tag')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink">
              {t('siteUi.home.foundation.titleNormal')}<span className="italic text-brand-gold">{t('siteUi.home.foundation.titleItalic')}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-0 border-0 md:border border-brand-ink/5 rounded-2xl md:rounded-2xl overflow-hidden md:shadow-lg">
            {[
              {
                title: t('pillars.community.title'),
                desc: t('pillars.community.desc'),
                image: "https://images.unsplash.com/photo-1749704492960-c17ed9b91db5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                number: "01",
                link: "/events",
                accent: "bg-brand-gold"
              },
              {
                title: t('pillars.arts.title'),
                desc: t('pillars.arts.desc'),
                image: "https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=1000&auto=format&fit=crop",
                number: "02",
                link: "/gallery",
                accent: "bg-brand-indigo"
              },
              {
                title: t('pillars.impact.title'),
                desc: t('pillars.impact.desc'),
                image: "https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                number: "03",
                link: "/impact",
                accent: "bg-brand-gold"
              }
            ].map((pillar, idx) => (
              <Link
                key={idx}
                to={pillar.link}
                className="group flex flex-col justify-between bg-white border border-brand-ink/5 md:border-r md:border-y-0 md:border-l-0 last:border-r-0 p-8 md:p-12 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative block min-h-[380px]"
              >
                <div>
                  <span className="font-serif text-5xl md:text-6xl text-brand-gold/30 group-hover:text-brand-gold transition-colors duration-300 font-bold block mb-6">
                    {pillar.number}
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-serif text-brand-ink mb-4 font-normal">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-brand-ink/70 font-normal leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-brand-ink/5 text-xs uppercase tracking-widest font-bold text-brand-ink group-hover:text-brand-blue transition-colors duration-300">
                  <span>{t('siteUi.home.foundation.learnMore')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <SectionSeam />
      {/* Key Metrics / Impact Section */}
      <section className="py-16 md:py-24 bg-white border-y border-brand-ink/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: t('siteUi.home.stats.yearLabel'), value: '2026', desc: t('siteUi.home.stats.yearDesc') },
              { label: t('siteUi.home.stats.membersLabel'), value: '100+', desc: t('siteUi.home.stats.membersDesc') },
              { label: t('siteUi.home.stats.partnersLabel'), value: '5+', desc: t('siteUi.home.stats.partnersDesc') },
              { label: t('siteUi.home.stats.projectsLabel'), value: '4+', desc: t('siteUi.home.stats.projectsDesc') }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center md:text-left flex flex-col items-center md:items-start"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-gold font-bold mb-2">
                  {stat.value}
                </span>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-ink mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-brand-ink/50 font-normal leading-relaxed max-w-[200px]">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Impact CTA - Immersive & Urgent */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Accents */}
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand-ink rounded-2xl md:rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-lg relative md:transform-gpu md:will-change-transform"
          >
            {/* Decorative Symbol Overlay */}


            <div className="lg:w-3/5 p-6 md:p-20 lg:p-28 flex flex-col justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex items-center gap-4 mb-8 md:mb-12"
              >
                <EyebrowMark />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">
                  {t('nav.impact')}
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 md:mb-10 leading-[1.1] tracking-tight transition-all duration-500 hover:text-brand-gold hover:drop-shadow-lg">
                {t('impactCta.title')}
              </h2>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-lg md:text-xl text-white/75 mb-10 md:mb-12 font-normal leading-relaxed max-w-2xl"
              >
                {t('impactCta.desc')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Link 
                  to="/impact" 
                  className="group w-full sm:w-fit inline-flex items-center justify-center gap-6 bg-brand-gold text-brand-ink px-8 py-4 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-white transition-all duration-500 shadow-lg shadow-brand-gold/20"
                >
                  {t('impactCta.cta')}
                  <div className="w-8 h-8 rounded-full bg-brand-ink/10 flex items-center justify-center group-hover:bg-brand-ink group-hover:text-white transition-all">
                    <Heart size={14} fill="currentColor" />
                  </div>
                </Link>
              </motion.div>
            </div>

            <div className="lg:w-2/5 relative min-h-[400px] lg:min-h-full overflow-hidden">
              <motion.div
                initial={{ scale: 1.3, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src="https://plus.unsplash.com/premium_photo-1734713079348-ea48690b11b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt={t('siteUi.home.impactAlt')} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/40 md:mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-ink via-brand-ink/40 to-transparent" />
              </motion.div>
              
              {/* Floating Stat Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="absolute bottom-10 right-10 left-10 lg:left-auto lg:w-80 bg-[#151a25]/90 md:bg-white/10 md:backdrop-blur-md border border-white/10 p-8 rounded-2xl text-white z-20 shadow-xl md:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-ink shadow-lg">
                    <Users size={20} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold">{t('siteUi.home.reach.label')}</span>
                </div>
                <div className="font-serif text-5xl mb-4 font-bold">+500</div>
                <p className="text-sm text-white/70 font-normal leading-relaxed">{t('siteUi.home.reach.text')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <SectionSeam />
{/* Partnership invitation */}
      <section className="relative overflow-hidden bg-[#0A1128] text-white py-20 md:py-28">
        {/* Gold frame and meander borders */}
        <MeanderBand className="absolute top-0 inset-x-0 bg-brand-gold/40" />
        <MeanderBand className="absolute bottom-0 inset-x-0 bg-brand-gold/40" />
        <div aria-hidden="true" className="absolute inset-x-4 md:inset-x-10 top-8 bottom-8 border border-brand-gold/25 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('collab.tag')}</span>
              <EyebrowMark />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight text-white mb-5">
              {t('collab.titleNormal')}<span className="italic text-brand-gold">{t('collab.titleItalic')}</span>
            </h2>
            <p className="text-base md:text-lg text-white/75 leading-relaxed">{t('collab.desc')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12 md:mt-14">
            {[
              { key: 'institutions', icon: Landmark, to: '/contact' },
              { key: 'businesses', icon: Briefcase, to: '/membership' },
              { key: 'individuals', icon: Users, to: '/membership' },
            ].map(({ key, icon: Icon, to }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <Link
                  to={to}
                  className="group flex flex-col h-full rounded-xl border border-white/10 bg-white/[0.04] p-7 hover:border-brand-gold/50 hover:bg-white/[0.07] transition-colors duration-300"
                >
                  <Icon className="w-7 h-7 text-brand-gold mb-5" />
                  <h3 className="text-2xl font-serif font-medium text-white mb-2">{t(`collab.${key}.title`)}</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-6">{t(`collab.${key}.text`)}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold">
                    {t('collab.learnMore')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-shimmer inline-flex items-center justify-center gap-2 bg-brand-gold text-slate-950 px-8 py-4 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-amber-400 transition-colors">
              {t('collab.ctaPartner')} <ArrowRight size={14} />
            </Link>
            <Link to="/membership" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors">
              {t('collab.ctaMember')}
            </Link>
          </div>
        </div>
      </section>

          </div>
  );
}
