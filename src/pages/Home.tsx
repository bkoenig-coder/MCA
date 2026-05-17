import { motion, AnimatePresence } from 'motion/react';
import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { ArrowRight, Calendar, Palette, Heart, Users, Shield, Sword, Clock, MapPin, Loader2, Info, Star, Handshake, Lightbulb, ArrowRightLeft, TrendingUp, Instagram, ChevronLeft, ChevronRight, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol } from '../components/MongolianDesign';
import { db, collection, onSnapshot, query, orderBy, limit, where, handleFirestoreError, OperationType } from '../firebase';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euActiveLogo from '../assets/media/euactivelogo.png';
import amoxLogo from '../assets/media/amoxlogo.png';
import mcaLogo from '../assets/media/mcalogo-1.png';

import { Overlay } from '../components/diorama/Overlay';

// Removed lazy loading
import HeroCanvas from '../components/diorama/HeroCanvas';
import LetsPlayGame from '../components/game/LetsPlayGame';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMembershipIndex, setActiveMembershipIndex] = useState(0);

  const membershipSlides = [
    {
      icon: Award,
      title: "Professional Community",
      benefits: [
        "International network access",
        "Exclusive event invitations",
        "Priority forum registration",
        "Cultural & professional exchange"
      ],
      path: "/membership/apply-professional",
      color: "text-brand-gold",
      bgClass: "bg-brand-gold",
      accentBorder: "border-brand-gold/30",
      accentBgHover: "group-hover:bg-brand-gold/30"
    },
    {
      icon: Users,
      title: "Student Membership",
      benefits: [
        "Access to junior network",
        "Mentorship opportunities",
        "Discounted event tickets",
        "Career development support"
      ],
      path: "/membership/apply-student",
      color: "text-blue-400",
      bgClass: "bg-blue-400",
      accentBorder: "border-blue-400/30",
      accentBgHover: "group-hover:bg-blue-400/30"
    },
    {
      icon: Handshake,
      title: "Institutional Partner",
      benefits: [
        "Brand visibility",
        "Bespoke B2B introductions",
        "Co-hosting opportunities",
        "Strategic advisory access"
      ],
      path: "/membership/apply-institutional",
      color: "text-emerald-400",
      bgClass: "bg-emerald-400",
      accentBorder: "border-emerald-400/30",
      accentBgHover: "group-hover:bg-emerald-400/30"
    }
  ];

  const handleNextMembership = () => {
    setActiveMembershipIndex((prev) => (prev + 1) % membershipSlides.length);
  };

  const handlePrevMembership = () => {
    setActiveMembershipIndex((prev) => (prev - 1 + membershipSlides.length) % membershipSlides.length);
  };

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
    const q = query(collection(db, 'events'), where('date', '>=', today), orderBy('date', 'asc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
      setLoading(false);
    });

    const qNews = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(12));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(12));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
    });

    return () => { unsubscribe(); unsubNews(); unsubGallery(); };
  }, []);

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[95vh] flex items-center px-6 overflow-hidden bg-[#0A1128] group">
        <div className="absolute inset-0 z-0">
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128]/90 via-[#0A1128]/40 to-transparent z-10 pointer-events-none" />
          
          <div className="w-full h-full absolute inset-0 opacity-80 md:opacity-100 transition-opacity duration-1000 group-hover:opacity-100 pointer-events-none">
            {/* Optimized Canvas for performance: limited DPR, no pointer events, no controls */}
            <HeroCanvas />
          </div>
        </div>

        <Overlay activePopup={activePopup} onClose={() => setActivePopup(null)} />

        <div className="max-w-7xl mx-auto w-full z-20 relative py-20 md:py-0 pointer-events-none">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col">
              <div className="flex items-start gap-6 md:gap-0">
                <div className="flex-1 pointer-events-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <div className="h-px w-12 bg-brand-gold/40 -mt-[52px]" />
                      <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold -mt-[52px]">
                        {t('hero.tag')}
                      </span>
                    </div>
                    <h1 className={cn(
                      "font-serif font-normal mb-8 md:mb-10 tracking-tight text-white md:whitespace-nowrap -mt-[26px] md:mt-0 drop-shadow-lg",
                      "text-[30px] leading-[36px] -mr-[74px]",
                      "md:text-5xl lg:text-6xl xl:text-[80px] md:leading-[1.1] md:mr-0"
                    )}>
                      {t('hero.title')} <br />
                      <span className="italic text-brand-gold font-light">{t('hero.titleItalic')}</span>
                    </h1>
                    <p className="text-[12px] md:text-base lg:text-lg text-white/80 max-w-2xl mb-10 md:mb-12 leading-relaxed font-normal -mr-[39px] md:mr-0 -mt-[6px] md:mt-0 pt-0 drop-shadow-md">
                      {t('hero.subtitle')}
                    </p>
                  </motion.div>
                </div>

                {/* Official Plaque - Vertical Mongolian Script Style (Mobile) */}
                <div className="lg:hidden relative flex-shrink-0 pt-12 -z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: 1, 
                      y: [0, -8, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative flex flex-col items-center p-4 py-8 border-2 border-brand-gold/50 bg-[#151a25]/90 md:bg-[#151a25]/80 md:backdrop-blur-xl rounded shadow-lg md:shadow-xl overflow-hidden min-w-[100px] -mt-[60px] ml-[23px] -mr-[15px] h-fit min-h-[450px]"
                  >
                    <div className="flex flex-col items-center relative z-10">
                      
                      <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="px-3 py-1 border border-brand-gold/40 rounded-sm bg-[#151a25]/90">
                          <span className="text-[6px] uppercase tracking-[0.4em] text-brand-gold font-bold whitespace-nowrap">Est. 2026</span>
                        </div>
                        <div className="h-8 w-px bg-brand-gold/40" />
                      </div>

                      <h2 
                        className="text-6xl md:text-7xl font-serif text-brand-gold text-center tracking-tighter leading-none relative drop-shadow-md"
                        style={{ writingMode: 'vertical-lr' }}
                      >
                        <span className="relative z-10">ᠮᠣᠩᠣᠯ ᠲᠥᠸ</span>
                        {/* Text Shimmer Effect */}
                        <motion.div 
                          animate={{ top: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent pointer-events-none z-20"
                        />
                      </h2>

                      <div className="flex flex-col items-center gap-3 mt-4">
                        <div className="h-8 w-px bg-brand-gold/40" />
                        <div className="px-3 py-1 border-2 border-brand-gold/60 rounded-sm bg-[#151a25]/90">
                          <span className="text-[8px] uppercase tracking-[0.4em] text-brand-gold font-bold">Official</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap gap-3 md:gap-4 -mt-[28px] relative z-20 pointer-events-auto"
              >
                <Link to="/events" className="w-full sm:w-auto flex-1 text-center bg-brand-ink text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-gold transition-all shadow-xl group whitespace-nowrap border border-white/10">
                  {t('hero.ctaEvents')}
                </Link>
                <Link to="/diorama" className="w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-brand-gold to-amber-600 text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all shadow-xl flex items-center justify-center gap-2 group border border-amber-400/30 whitespace-nowrap flex">
                  <SoyomboSymbol className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-12 transition-transform duration-300" />
                 {t('Full Screen 3D')}
                </Link>
                <Link to="/membership" className="w-full sm:w-auto flex-1 text-center border border-white/20 px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:border-brand-gold text-white hover:text-brand-gold transition-all whitespace-nowrap bg-white/10 md:bg-white/5 md:backdrop-blur-sm">
                  Become a Member
                </Link>
              </motion.div>
            </div>

            {/* Official Plaque - Vertical Mongolian Script Style (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative min-h-[600px] w-full py-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -12, 0],
                  rotateZ: [0, 0.5, 0, -0.5, 0]
                }}
                transition={{ 
                  opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative flex flex-col items-center p-10 py-20 border-2 border-brand-gold/60 bg-[#151a25]/90 md:bg-[#151a25]/80 md:backdrop-blur-xl rounded-sm shadow-2xl md:shadow-[0_50px_90px_-20px_rgba(0,0,0,0.5)] group overflow-hidden min-w-[280px] h-fit mt-16 pointer-events-auto"
              >
                {/* Upgraded Stable Glow Effect */}
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.2),transparent_70%)] pointer-events-none"
                />
                
                {/* Secondary Pulsing Rim Light */}
                <motion.div 
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute inset-0 border-4 border-brand-gold/30 rounded-sm pointer-events-none"
                />

                {/* Dynamic Light Sweep */}
                <motion.div 
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none z-10"
                />

                <div className="flex flex-col items-center relative z-10">
                  
                  {/* Horizontal Established Text with Border */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="px-4 py-1.5 border border-brand-gold/40 rounded-sm bg-[#151a25]/90">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Established 2026</span>
                    </div>
                    <div className="h-12 w-px bg-brand-gold/40" />
                  </div>

                  {/* Main Vertical Title with Shimmer */}
                  <div className="relative">
                    <h2 
                      className="text-6xl md:text-9xl lg:text-[180px] font-serif text-brand-gold text-center tracking-tighter leading-none select-none relative z-10 drop-shadow-2xl"
                      style={{ writingMode: 'vertical-lr' }}
                    >
                      ᠮᠣᠩᠣᠯ ᠲᠥᠸ
                    </h2>
                    {/* Text Light Sweep */}
                    <motion.div 
                      animate={{ top: ['-100%', '200%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent pointer-events-none z-20"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  </div>
                  
                  {/* Bottom Accents and Seal */}
                  <div className="flex flex-col items-center gap-5 mt-4">
                    <div className="h-12 w-px bg-brand-gold/40" />
                    <div className="px-6 py-2 border-2 border-brand-gold/60 rounded-sm bg-[#151a25]/90">
                      <span className="text-xs uppercase tracking-[0.6em] text-brand-gold font-bold">Official</span>
                    </div>
                  </div>
                </div>

                {/* Modern Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee Section - Corporate Refactor */}
      <section className="py-10 md:py-12 bg-gray-50 relative overflow-hidden border-y border-gray-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-white/80 blur-[100px] rounded-full pointer-events-none z-0 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none z-0 -translate-y-1/2" />
        <div className="text-center mb-10 relative z-20">
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Our partners & sponsors
          </h3>
          <div className="w-12 h-0.5 bg-[#760000] mx-auto mt-4" />
        </div>

        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-hidden relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: isMobile ? 8 : 20, ease: "linear", repeat: Infinity }}
            className="flex w-max relative z-20"
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                {[
                  { name: 'Deutschothek Sprachschule', src: deutschotekLogo, url: 'https://deutschothek.com/' },
                  { name: 'Verein für aktiv Leben und Bildung', src: euActiveLogo, url: 'https://www.euactive.org/' },
                  { name: 'Verein der mongolischen StudentInnen in Österreich', src: amoxLogo, url: 'https://www.facebook.com/MongolianStudentAssociationInAustria' },
                  { name: 'Become a partner.', src: mcaLogo, url: '/contact' },
                ].map((partner, idx) => (
                  <a 
                    key={`${groupIndex}-${idx}`} 
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-4 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105"
                  >
                    <div className="flex items-center justify-center h-12 md:h-16 min-w-[140px] md:min-w-[160px] group-hover:-translate-y-1 transition-transform duration-500 will-change-transform">
                      <img 
                        src={partner.src} 
                        alt={partner.name} 
                        loading="lazy"
                        className="h-full w-auto object-contain" 
                      />
                    </div>
                    <span className="font-sans font-semibold text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap text-black transition-colors duration-500 group-hover:text-brand-gold">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Membership Highlights CTA Section */}
      <section className="py-24 md:py-32 px-6 bg-brand-ink relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold drop-shadow-sm">Official Membership</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-[1.1] drop-shadow-lg">
              Become a <span className="italic text-brand-gold">Member</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12 max-w-lg">
              Join a growing platform connecting Austria and Mongolia. Gain access to a premium network, exclusive cultural events, and high-level bilateral opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link to="/membership" className="group inline-flex items-center justify-center gap-4 bg-brand-gold text-brand-ink px-8 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-700 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto">
                Explore Benefits
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 w-full lg:w-auto relative"
          >
            {/* Elegant glassmorphism card stack */}
            <div className="relative w-full max-w-md mx-auto mt-8 lg:mt-0">
              {/* Back card 1 */}
              <div className="absolute inset-0 bg-brand-gold/10 border border-brand-gold/20 rounded-[32px] transform rotate-[8deg] translate-x-4 translate-y-2 blur-[1px] transition-transform duration-700 hover:rotate-[12deg] pointer-events-none" />
              
              {/* Back card 2 */}
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[32px] transform -rotate-[4deg] -translate-x-2 translate-y-4 transition-transform duration-700 hover:-rotate-[6deg] pointer-events-none" />
              
              {/* Main Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMembershipIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={membershipSlides[activeMembershipIndex].path} className="relative block bg-white/10 backdrop-blur-xl border border-white/20 p-10 md:p-12 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden group hover:bg-white/[0.15] transition-all duration-700">
                    <div className={cn("absolute top-0 right-0 w-40 h-40 rounded-full blur-[50px] -mr-16 -mt-16 transition-colors duration-700 opacity-20", membershipSlides[activeMembershipIndex].bgClass, membershipSlides[activeMembershipIndex].accentBgHover)} />
                    
                    {/* Noise overlay for glass effect */}
                    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                    <div className="relative z-10">
                      <div className={cn("w-14 h-14 bg-brand-ink/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 transition-colors duration-500", "group-hover:" + membershipSlides[activeMembershipIndex].accentBorder)}>
                        {React.createElement(membershipSlides[activeMembershipIndex].icon, { 
                          size: 24, 
                          className: membershipSlides[activeMembershipIndex].color 
                        })}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-serif mb-4 drop-shadow-md text-white">{membershipSlides[activeMembershipIndex].title}</h3>
                      
                      <ul className="space-y-4 mb-10">
                        {membershipSlides[activeMembershipIndex].benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <CheckCircle2 size={18} className={cn("shrink-0 mt-0.5 opacity-90", membershipSlides[activeMembershipIndex].color)} />
                            <span className="text-white/80 font-light text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-8 border-t border-white/10 flex items-center justify-between group-hover:border-white/20 transition-colors duration-500">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/50 group-hover:text-white transition-colors duration-500">Apply Now</span>
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 bg-white/10 group-hover:scale-110", "group-hover:" + membershipSlides[activeMembershipIndex].bgClass)}>
                          <ArrowRight size={16} className="text-white transition-colors duration-500" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  onClick={handlePrevMembership}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                  aria-label="Previous membership tier"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {membershipSlides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveMembershipIndex(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i === activeMembershipIndex ? "bg-brand-gold w-4" : "bg-white/20 hover:bg-white/40"
                      )}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNextMembership}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                  aria-label="Next membership tier"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured News Carousel */}
      <section className="py-24 bg-brand-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/80 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-brand-gold">Our Voice</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-brand-ink">
              Featured <span className="italic text-brand-gold">News</span>
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/news" className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink hover:text-brand-gold transition-colors flex items-center gap-2 border-b border-brand-ink/10 pb-1">All News <ArrowRight size={12}/></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div 
            ref={newsScrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {news.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="min-w-[85vw] md:min-w-[350px] snap-center shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                  <Link to={`/news/${item.id}`} className="group relative rounded-3xl overflow-hidden h-[450px] block bg-brand-ink shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_60px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:ring-white/20 transition-all duration-300">
                    {/* Background Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                    {item.imageUrl && (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
                    
                    {/* Subtle Border Glow */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-colors duration-300 pointer-events-none" />

                    {/* Glassmorphism Tag */}
                    <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl px-4 py-1.5 rounded-full z-10">
                      <span className="text-[9px] uppercase font-bold text-white drop-shadow-sm tracking-widest">Featured</span>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl md:text-2xl font-serif text-white mb-4 line-clamp-2 md:leading-tight drop-shadow-lg">{item.title}</h3>
                      <p className="text-brand-paper/80 font-light text-sm line-clamp-2 mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300">{item.excerpt || item.content}</p>
                      <div className="flex items-center gap-2 text-brand-gold font-bold text-[9px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 drop-shadow-sm">Read Story <ArrowRight size={12}/></div>
                    </div>
                  </Link>
              </motion.div>
            ))}
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

      {/* Featured Gallery Carousel */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-paper/80 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-brand-gold">Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-brand-ink">
              Featured <span className="italic text-brand-gold">Gallery</span>
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6">
              <Link to="/gallery" className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink hover:text-brand-gold transition-colors flex items-center gap-2 border-b border-brand-ink/10 pb-1">All Gallery <ArrowRight size={12}/></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div 
            ref={galleryScrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {gallery.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="min-w-[85vw] md:min-w-[350px] snap-center shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                  <Link to={`/gallery/${item.id}`} className="group relative rounded-3xl overflow-hidden h-[450px] block bg-brand-ink shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_60px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:ring-white/20 transition-all duration-300">
                    {/* Background Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                    {item.imageUrl && (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                    
                    {/* Subtle Border Glow */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-colors duration-300 pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-serif text-white mb-2 line-clamp-2 drop-shadow-md">{item.title}</h3>
                      <div className="flex items-center gap-2 text-brand-gold font-bold text-[9px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 drop-shadow-sm">View Capture <ArrowRight size={12}/></div>
                    </div>
                  </Link>
              </motion.div>
            ))}
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

      {/* Featured Events Preview - Dynamic List */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-white/80 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16 -mt-[40px] md:-mt-[40px]">
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="h-px w-8 md:w-12 bg-brand-gold/40" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('highlight.tag')}</span>
              <div className="h-px w-8 md:w-12 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-brand-ink mb-6 md:mb-8">
              {t('highlight.title')} <br className="hidden md:block"/>
              <span className="italic text-brand-gold"> {t('highlight.titleItalic')}</span>
            </h2>
            <Link to="/events" className="inline-flex items-center gap-3 md:gap-4 text-brand-ink font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] group">
              {t('highlight.cta')}
              <div className="w-8 h-8 md:w-12 md:h-12 border border-brand-ink/10 rounded-full flex items-center justify-center group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 -mt-[30px] md:-mt-[50px] min-h-[200px]">
              {/* Spinner removed */}
            </div>
          ) : (
            <div className="relative">
              <div 
                ref={eventsScrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar -mt-[30px] md:-mt-[20px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {events.map((event, index) => {
                  const lang = i18n.language;
                  const dTitle = lang === 'mn' ? (event.titleMn || event.title) : lang === 'de' ? (event.titleDe || event.title) : (event.titleEn || event.title);
                  const dDesc = lang === 'mn' ? (event.descriptionMn || event.description) : lang === 'de' ? (event.descriptionDe || event.description) : (event.descriptionEn || event.description);
                  const dLocation = lang === 'mn' ? (event.locationMn || event.location) : lang === 'de' ? (event.locationDe || event.location) : (event.locationEn || event.location);
                  const dCat = lang === 'mn' ? (event.categoryMn || event.category) : lang === 'de' ? (event.categoryDe || event.category) : (event.categoryEn || event.category);

                  return (
                  <motion.div 
                    key={event.id} 
                    className="min-w-[85vw] md:min-w-[350px] snap-center shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  >
                      <Link to={`/events/${event.id}`} className="group relative rounded-3xl overflow-hidden h-[450px] block bg-brand-ink shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_60px_-20px_rgba(0,0,0,0.25)] ring-1 ring-black/5 hover:ring-white/20 transition-all duration-300">
                        {/* Background Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                        <motion.img 
                          initial={{ scale: 1.1, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          src={event.imageUrl} alt={dTitle} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
                        
                        {/* Subtle Border Glow */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-colors duration-300 pointer-events-none" />
                        
                        {/* Floating Date Badge */}
                        <div className="absolute top-6 left-6 bg-brand-gold text-brand-ink px-4 py-2 rounded-xl shadow-md flex flex-col items-center min-w-[56px] z-10 transition-transform duration-300">
                          <span className="text-[9px] uppercase tracking-widest font-bold">
                            {new Date(event.date).toLocaleDateString(t('common.locale'), { month: 'short' })}
                          </span>
                          <span className="text-xl font-serif font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>

                        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl px-3 py-1 rounded-full z-10">
                          <span className="text-[8px] uppercase font-bold text-white tracking-widest drop-shadow-sm">{dCat || t('events.defaultCategory')}</span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-brand-gold mb-2">
                             <Star size={10} className="w-[10px] h-[10px]" fill="currentColor" />
                             <span className="text-[8px] uppercase tracking-widest font-bold drop-shadow-sm">Featured Event</span>
                          </div>
                          <h3 className="text-2xl font-serif text-white mb-2 line-clamp-2 drop-shadow-lg">{dTitle}</h3>
                          <p className="text-brand-paper/80 font-light text-sm line-clamp-2 mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">{dDesc}</p>
                          
                          <div className="flex items-center gap-4 text-brand-paper/80 mb-6 text-[9px] uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-1.5"><Clock size={10}/> {event.time || t('events.tba')}</div>
                            <div className="flex items-center gap-1.5 truncate"><MapPin size={10}/> {dLocation || t('events.vienna')}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-brand-gold font-bold text-[9px] uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 drop-shadow-sm">
                              {t('events.viewDetails')} <ArrowRight size={12}/>
                            </div>
                            <span className="font-serif text-lg text-white font-bold drop-shadow-md">
                              {event.price === 0 ? 'Free' : `€${(event.price / 100).toFixed(2)}`}
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

      {/* Pillars Section - Redesigned for Prestige & Impact */}
      <section className="py-24 md:py-40 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-paper/80 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-[90px] md:mb-[90px] -mt-[80px]"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">Our Foundation</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight text-brand-ink">
              The Three <span className="italic text-brand-gold">Pillars</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-0 border-0 md:border border-brand-ink/5 rounded-3xl md:rounded-[60px] overflow-hidden md:shadow-2xl">
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
                className="group relative h-[400px] md:h-[600px] overflow-hidden border-r last:border-r-0 border-brand-ink/5 rounded-3xl md:rounded-none block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className="h-full w-full"
                >
                  <img 
                    src={pillar.image} 
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/70 group-hover:bg-brand-ink/30 transition-all duration-700" />
                  
                  {/* Hover Accent Line */}
                  <div className={cn("absolute top-0 left-0 right-0 h-0 group-hover:h-2 transition-all duration-500 z-20", pillar.accent)} />

                  <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-between text-white z-10">
                    <div className="flex justify-between items-start">
                      <span className="font-serif text-6xl md:text-9xl opacity-20 group-hover:opacity-100 group-hover:text-brand-gold transition-all duration-700 font-black">{pillar.number}</span>
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl md:text-6xl font-serif mb-6 md:mb-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">{pillar.title}</h3>
                      <p className="text-lg md:text-xl text-white/60 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-12 group-hover:translate-y-0 transition-all duration-700 delay-100 max-w-md font-light">
                        {pillar.desc}
                      </p>
                      <div className="mt-10 h-px w-0 group-hover:w-full bg-brand-gold/50 transition-all duration-1000 delay-200" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mini-Game Section - Let's Play */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-4">
              Experience the <span className="italic text-brand-gold">Steppe</span>
            </h2>
            <p className="text-brand-ink/60 max-w-2xl mx-auto font-light leading-relaxed text-lg">
              Take a moment to enjoy a lightweight, culturally immersive endless runner. Collect artifacts and explore the infinite Mongolian landscapes.
            </p>
          </div>
          <LetsPlayGame />
        </div>
      </section>

      {/* Impact CTA - Immersive & Urgent */}
      <section className="py-24 md:py-48 px-6 bg-white relative overflow-hidden">
        {/* Subtle Background Accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-paper/80 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-paper/50 -skew-x-12 translate-x-1/2 z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand-ink rounded-[60px] md:rounded-[100px] overflow-hidden flex flex-col lg:flex-row shadow-2xl md:shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] relative md:transform-gpu md:will-change-transform"
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
                <div className="h-px w-12 bg-brand-gold/40" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-bold text-brand-gold">
                  Donation
                </span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 md:mb-14 leading-[0.9] tracking-tight transition-all duration-500 hover:text-brand-gold hover:drop-shadow-lg">
                {t('impactCta.title')}
              </h2>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-xl md:text-2xl text-white/50 mb-12 md:mb-16 font-light leading-relaxed max-w-2xl italic"
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
                  className="group w-full sm:w-fit inline-flex items-center justify-center gap-6 bg-brand-gold text-brand-ink px-14 py-7 rounded-full text-xs uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 shadow-2xl shadow-brand-gold/20"
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
                  alt="Impact" 
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
                className="absolute bottom-10 right-10 left-10 lg:left-auto lg:w-80 bg-[#151a25]/90 md:bg-white/10 md:backdrop-blur-md border border-white/10 p-10 rounded-[40px] text-white z-20 shadow-xl md:shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-ink shadow-lg">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Community Reach</span>
                </div>
                <div className="font-serif text-5xl mb-4 font-bold">5,000+</div>
                <p className="text-sm text-white/70 font-light leading-relaxed">Lives touched through our cultural and social initiatives in 2024. Your support makes this possible.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
{/* Legacy Section - Immersive Heritage */}
      <section className="py-24 md:py-40 px-4 md:px-6 bg-[#050507] text-white relative overflow-hidden flex items-center min-h-[90vh]">
        {/* Cinematic Atmospheric Background */}
        <div className="absolute inset-0 z-0">
           {/* Slowly shifting traditional motifs */}

           <div className="absolute bottom-0 left-0 opacity-[0.02] pointer-events-none -translate-x-1/4 translate-y-1/3">
             <MongolianLine className="w-full text-brand-gold" />
           </div>

          {/* Cinematic Pan Image */}
          <motion.div 
            animate={{ scale: [1.05, 1.15] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            className="absolute inset-0 opacity-[0.25]"
          >
            <img 
              src="https://images.unsplash.com/photo-1684814833784-c9c8cdba1d20?q=80&w=2000&auto=format&fit=crop" 
              alt="Ulaanbaatar Cinematic" 
              className="w-full h-full object-cover grayscale md:mix-blend-overlay opacity-50 md:opacity-100"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Deep Vignette & Studio Lighting FX */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#050507] via-transparent to-[#050507]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] hidden md:block blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
          <div className="text-center mb-20 md:mb-32 w-full">
            {/* Elegant Floating Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-12"
            >
              <div className="absolute inset-0 bg-brand-gold rounded-full blur-[20px] opacity-20 animate-pulse" />
              <div className="relative w-full h-full border border-white/10 rounded-full flex items-center justify-center bg-black/80 md:bg-black/50 md:backdrop-blur-md overflow-hidden p-3 shadow-xl md:shadow-2xl">
                <img src={mcaLogo} alt="MCA Logo" loading="lazy" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-brand-gold/50 to-transparent" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl lg:text-[85px] font-serif font-light mb-8 md:mb-12 tracking-tight leading-[1.1] relative"
            >
              <span className="text-white/90 drop-shadow-lg">{t('legacy.title')}</span> <br />
              <span className="block mt-4 italic text-brand-gold font-medium tracking-normal drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">{t('legacy.titleItalic')}</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-2xl text-white/60 font-serif leading-relaxed max-w-4xl mx-auto italic font-light px-4 md:px-0"
            >
              {t('legacy.quote')}
            </motion.p>
          </div>
          
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {[
              { label: t('legacy.archery'), value: t('legacy.tradition'), icon: <Handshake className="w-7 h-7 md:w-9 md:h-9" /> },
              { label: t('legacy.horsemanship'), value: t('legacy.freedom'), icon: <Lightbulb className="w-7 h-7 md:w-9 md:h-9" /> },
              { label: t('legacy.wrestling'), value: t('legacy.strength'), icon: <ArrowRightLeft className="w-7 h-7 md:w-9 md:h-9" /> },
              { label: t('legacy.wisdom'), value: t('legacy.heritage'), icon: <TrendingUp className="w-7 h-7 md:w-9 md:h-9" /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center group cursor-pointer p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 mb-6 md:mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-brand-gold/40 group-hover:text-brand-gold group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-700 z-10">
                  <div className="absolute inset-0 rounded-full bg-brand-gold/5 scale-0 group-hover:scale-100 transition-transform duration-700" />
                  <div className="relative z-10">{item.icon}</div>
                </div>
                
                <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/40 group-hover:text-brand-gold/80 font-semibold mb-3 transition-colors duration-700 relative z-10">{item.label}</span>
                <span className="font-serif text-xl md:text-3xl text-white/80 group-hover:text-white transition-colors duration-700 font-medium relative z-10">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

          </div>
  );
}
