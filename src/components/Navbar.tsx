import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn, LogOut, User as UserIcon, ChevronDown, Calendar, ArrowRight, Info, Newspaper, Image as ImageIcon, Heart, Mail, Compass, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, logOut, db, collection, query, where, orderBy, onSnapshot, handleFirestoreError, OperationType } from '../firebase';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol } from './MongolianDesign';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇦🇹' },
  { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
];

const MongolianFlagBanner = ({ className }: { className?: string }) => (
  <div className={cn("relative w-10 md:w-12 drop-shadow-md", className)}>
    {/* Wooden rod */}
    <div className="absolute top-0 left-[-15%] right-[-15%] h-1.5 bg-[#8B4513] rounded-sm z-10 shadow-sm">
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#DAA520] rounded-l-sm" />
      <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#DAA520] rounded-r-sm" />
    </div>
    {/* Flag body */}
    <svg viewBox="0 0 60 100" className="w-full pt-1">
      <path d="M0,0 L60,0 L60,85 L30,100 L0,85 Z" fill="#0066B3" />
      <path d="M0,0 L20,0 L20,90 L0,80 Z" fill="#DA2032" />
      <path d="M40,0 L60,0 L60,80 L40,90 Z" fill="#DA2032" />
      {/* Soyombo symbol simplified */}
      <g fill="#F8CC1B" transform="translate(4, 10) scale(0.6)">
        {/* Flame */}
        <path d="M10,0 Q15,5 10,10 Q5,5 10,0" />
        {/* Sun and Moon */}
        <circle cx="10" cy="14" r="3" />
        <path d="M7,18 A4,4 0 0,0 13,18 A3,3 0 0,1 7,18" />
        {/* Triangles and rectangles */}
        <polygon points="5,22 15,22 10,27" />
        <rect x="4" y="28" width="12" height="2" />
        <rect x="4" y="31" width="12" height="2" />
        <circle cx="10" cy="38" r="4" fill="none" stroke="#F8CC1B" strokeWidth="1.5" />
        <rect x="4" y="44" width="12" height="2" />
        <rect x="4" y="47" width="12" height="2" />
        <polygon points="5,54 15,54 10,49" />
        {/* Vertical bars */}
        <rect x="1" y="20" width="2" height="36" />
        <rect x="17" y="20" width="2" height="36" />
      </g>
    </svg>
  </div>
);

const AustrianFlagBanner = ({ className }: { className?: string }) => (
  <div className={cn("relative w-10 md:w-12 drop-shadow-md", className)}>
    {/* Wooden rod */}
    <div className="absolute top-0 left-[-15%] right-[-15%] h-1.5 bg-[#8B4513] rounded-sm z-10 shadow-sm">
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#DAA520] rounded-l-sm" />
      <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#DAA520] rounded-r-sm" />
    </div>
    {/* Flag body */}
    <svg viewBox="0 0 60 100" className="w-full pt-1">
      <path d="M0,0 L60,0 L60,85 L30,100 L0,85 Z" fill="#FFFFFF" />
      <path d="M0,0 L20,0 L20,95 L0,85 Z" fill="#ED2939" />
      <path d="M40,0 L60,0 L60,85 L40,95 Z" fill="#ED2939" />
    </svg>
  </div>
);

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const location = useLocation();
  const { user } = useAuth();
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const horseX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const navItems = [
    { name: t('nav.about'), path: '/about', icon: Info },
    { name: t('nav.events'), path: '/events', icon: Calendar },
    { name: t('nav.news'), path: '/news', icon: Newspaper },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.impact'), path: '/impact', icon: Heart },
    { name: t('nav.contact'), path: '/contact', icon: Mail },
    { name: 'Explore 3D Diorama', path: '/diorama', icon: Compass },
  ];

  if (user?.email === 'emeraldtorstein@gmail.com') {
    navItems.push({ name: t('nav.admin'), path: '/admin', icon: Shield });
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);

    // Fetch next event
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'events'), 
      where('date', '>=', today),
      orderBy('date', 'asc')
    );
    const unsubscribeEvents = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setNextEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setNextEvent(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      unsubscribeEvents();
    };
  }, []);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header ref={menuRef} className="fixed top-0 left-0 right-0 z-[100]">
      {/* Top Banner */}
      <AnimatePresence>
        {nextEvent && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-brand-gold text-brand-ink py-1.5 md:py-2 overflow-hidden border-b border-brand-ink/5 shadow-sm"
          >
            <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(10)].map((_, i) => (
                <Link 
                  key={i}
                  to={`/events/${nextEvent.id}`}
                  className="flex items-center gap-8 px-8 group transition-all duration-500"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={12} className="opacity-60" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">
                      {t('events.nextUpcoming')}: <span className="text-brand-ink/80 italic">{nextEvent.title}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">
                      {new Date(nextEvent.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="w-1 h-1 rounded-full bg-brand-ink/20 mx-4" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={cn(
          'transition-all duration-300 px-4 md:px-6 py-4 md:py-8 relative',
          isOpen ? 'bg-white' : (scrolled || nextEvent ? 'bg-white/95 backdrop-blur-3xl py-3 md:py-4 shadow-sm border-b border-brand-ink/5' : 'bg-transparent'),
          nextEvent && !scrolled && !isOpen && 'py-4 md:py-6'
        )}
      >
        {/* Left Flag */}
        <div className="absolute top-0 left-2 md:left-4 lg:left-6 z-0 lg:z-50 pointer-events-none">
          <AustrianFlagBanner className="w-3 md:w-5 lg:w-6" />
        </div>
        
        {/* Right Flag */}
        <div className="absolute top-0 right-2 md:right-4 lg:right-6 z-0 lg:z-50 pointer-events-none">
          <MongolianFlagBanner className="w-3 md:w-5 lg:w-6" />
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-16 relative">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between w-full min-h-[80px] relative">
            {/* Left Nav */}
            <div className="flex items-center justify-start gap-8 xl:gap-12 pl-4 z-10">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:text-[#C5A059] text-brand-ink"
                )}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
                <span>{isOpen ? t('common.close', 'CLOSE') : 'MENU'}</span>
              </button>
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center w-max">
              <Link to="/" className="flex items-center gap-4 md:gap-6 group">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 border border-[#C5A059]/20 rounded-full flex items-center justify-center text-[#ffa800] transition-all duration-1000 group-hover:border-[#C5A059] group-hover:rotate-[360deg] bg-white/10 backdrop-blur-sm shadow-sm">
                    <UlziiSymbol className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="absolute -inset-2 border border-[#C5A059]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-serif text-xl md:text-3xl leading-none font-light tracking-tight uppercase transition-colors duration-300 text-brand-ink"
                  )}>
                    {t('nav.mongolian')} <span className="italic text-[#ffa700] border-[#ff0000]">{t('nav.center')}</span>
                  </span>
                  <span className={cn(
                    "text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold mt-1.5 md:mt-2 transition-colors duration-300 text-[#ffbc00] opacity-70"
                  )}>{t('nav.location')}</span>
                </div>
              </Link>
            </div>

            {/* Right Nav + Auth */}
            <div className="flex items-center justify-end gap-8 xl:gap-12 pr-4 z-10">
              <div className="flex items-center gap-6">
                {/* Language Switcher */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className={cn(
                      "flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors text-brand-ink/40 hover:text-[#C5A059]"
                    )}
                  >
                    <span className="opacity-50 hidden md:inline">{currentLang.flag}</span>
                    <span>{currentLang.code}</span>
                    <ChevronDown size={12} className={cn('transition-transform opacity-30', isLangOpen && 'rotate-180')} />
                  </button>
                  
                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-6 w-48 bg-white rounded-3xl shadow-2xl border border-brand-ink/5 overflow-hidden z-50 p-2"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              i18n.changeLanguage(lang.code);
                              setIsLangOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-brand-paper transition-all duration-300',
                              i18n.language === lang.code ? 'text-brand-gold font-bold bg-brand-paper/50' : 'text-brand-ink/60'
                            )}
                          >
                            <span>{lang.name}</span>
                            <span className="opacity-50 grayscale hover:grayscale-0 transition-all">{lang.flag}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {user ? (
                  <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-3 group/profile">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-[#C5A059]/20 p-0.5 shadow-sm group-hover/profile:border-[#C5A059] transition-colors" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20 group-hover/profile:border-[#C5A059] transition-colors">
                          <UserIcon size={14} />
                        </div>
                      )}
                    </Link>
                    <button 
                      onClick={() => logOut()}
                      className={cn(
                        "transition-colors text-brand-ink/20 hover:text-[#C5A059]"
                      )}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => signInWithGoogle()}
                    className={cn(
                      "text-[10px] uppercase tracking-[0.3em] font-bold px-6 py-2.5 rounded-full transition-all duration-500 shadow-sm whitespace-nowrap text-white bg-brand-ink hover:bg-[#C5A059]"
                    )}
                  >
                    {t('nav.signIn')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="grid lg:hidden grid-cols-[1fr_auto_1fr] items-center w-full">
            {/* Mobile Toggle */}
            <div className="flex justify-start">
              <button 
                className={cn(
                  "p-1.5 md:p-2 transition-colors duration-300 text-brand-ink"
                )} 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Logo */}
            <div className="flex justify-center z-50">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 border border-[#C5A059]/20 rounded-full flex items-center justify-center text-[#ffa800] bg-white/10 backdrop-blur-sm shadow-sm">
                  <UlziiSymbol className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-serif text-lg leading-none font-light tracking-tight uppercase transition-colors duration-300 text-brand-ink"
                  )}>
                    {t('nav.mongolian')} <span className="italic text-[#ffa700] border-[#ff0000]">{t('nav.center')}</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Lang */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const nextLang = languages[(languages.findIndex(l => l.code === i18n.language) + 1) % languages.length];
                  i18n.changeLanguage(nextLang.code);
                }}
                className={cn(
                  "w-9 h-9 rounded-full border flex items-center justify-center text-base transition-colors duration-300 bg-white/50 text-brand-ink border-brand-ink/10"
                )}
              >
                {currentLang.flag}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-2 right-2 md:left-8 md:right-8 lg:left-16 lg:right-16 mt-2 md:mt-4 bg-[#4A0E0E] rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-[#C5A059]/40 z-[110] p-1.5 md:p-3 max-h-[calc(100vh-100px)] overflow-y-auto transform-gpu"
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            >
              {/* The Repeating Ulzii Border Layer */}
              <div 
                className="w-full min-h-full rounded-[1.25rem] md:rounded-[1.5rem] p-2 md:p-4 transform-gpu"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C5A059' stroke-width='1.5' opacity='0.6'%3E%3Cpath d='M10,0 V10 H0 M40,10 H30 V0 M30,40 V30 H40 M0,30 H10 V40'/%3E%3Crect x='10' y='10' width='20' height='20'/%3E%3Crect x='15' y='15' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat'
                }}
              >
                {/* The Inner Felt Layer */}
                <div 
                  className="relative w-full h-full bg-[#721414] rounded-xl flex flex-col p-4 md:p-10 lg:p-12 shadow-[inset_0_0_40px_rgba(74,14,14,0.8)] border border-[#C5A059]/20 transform-gpu"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
                  }}
                >
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 w-4 h-4 md:w-8 md:h-8 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 w-4 h-4 md:w-8 md:h-8 border-t-2 border-r-2 border-[#C5A059]/40 rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-4 h-4 md:w-8 md:h-8 border-b-2 border-l-2 border-[#C5A059]/40 rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-4 h-4 md:w-8 md:h-8 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-lg pointer-events-none" />

                  <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 w-full relative z-10">
                    {navItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            'text-sm md:text-lg font-serif font-medium tracking-wide transition-all duration-300 p-3 md:p-5 flex items-center justify-between group rounded-xl border',
                            isActive 
                              ? 'text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/30 shadow-[inset_0_0_20px_rgba(197,160,89,0.1)]' 
                              : 'text-white/90 border-white/5 bg-white/5 hover:border-[#C5A059]/40 hover:bg-[#C5A059]/10 hover:text-[#C5A059] hover:shadow-[inset_0_0_20px_rgba(197,160,89,0.05)]'
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="flex items-center gap-3 md:gap-4">
                            {Icon && <Icon size={18} className={cn("transition-colors md:w-5 md:h-5", isActive ? "text-[#C5A059]" : "text-[#C5A059]/60 group-hover:text-[#C5A059]")} />}
                            {item.name}
                            {item.path === '/events' && (
                              <span className="text-[8px] md:text-[9px] bg-[#C5A059] text-[#4A0E0E] px-2 py-0.5 md:px-2.5 md:py-1 rounded-sm tracking-widest font-sans font-bold shadow-sm ml-2 md:ml-3">
                                UPCOMING
                              </span>
                            )}
                          </span>
                          <ArrowRight size={14} className={cn("transition-all md:w-4 md:h-4", isActive ? "opacity-100 translate-x-0 text-[#C5A059]" : "opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-[#C5A059]")} />
                        </Link>
                      );
                    })}
                  </nav>
                  
                  <div className="mt-6 md:mt-10 pt-6 md:pt-8 relative flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 z-10">
                    {/* Ornate Divider */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rotate-45 border border-[#C5A059]/40 bg-[#721414]" />

                    {user ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 md:gap-4 group p-2 md:p-3 -mx-2 md:-mx-3 rounded-xl hover:bg-white/5 transition-colors w-full sm:w-auto border border-transparent hover:border-[#C5A059]/20"
                        >
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#C5A059]/40 shadow-md" />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#4A0E0E] flex items-center justify-center text-[#C5A059] border-2 border-[#C5A059]/40 shadow-md">
                              <UserIcon size={18} className="md:w-5 md:h-5" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-serif text-sm md:text-base text-white group-hover:text-[#C5A059] transition-colors">{user.displayName}</span>
                            <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">{t('nav.member')}</span>
                          </div>
                        </Link>
                        <button 
                          onClick={() => { logOut(); setIsOpen(false); }} 
                          className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 w-full sm:w-auto rounded-xl text-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-[#4A0E0E] hover:text-white transition-all border border-transparent hover:border-[#C5A059]/30"
                        >
                          <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
                          <span>{t('nav.signOut')}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#4A0E0E] px-6 md:px-8 py-3 md:py-4 rounded-xl text-center text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 md:gap-3 shadow-[0_4px_15px_rgba(197,160,89,0.3)] hover:shadow-[0_6px_20px_rgba(197,160,89,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <LogIn size={16} className="md:w-[18px] md:h-[18px]" />
                        {t('nav.signIn')}
                      </button>
                    )}
                    
                    <div className="flex sm:hidden w-full items-center justify-center gap-6 text-[#C5A059]/60 text-[10px] uppercase tracking-[0.2em] font-medium pt-4 border-t border-[#C5A059]/10">
                      <span className="hover:text-[#C5A059] transition-colors cursor-pointer">Instagram</span>
                      <span className="hover:text-[#C5A059] transition-colors cursor-pointer">Facebook</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-[#C5A059]/60 text-[10px] uppercase tracking-[0.2em] font-medium">
                      <span className="hover:text-[#C5A059] transition-colors cursor-pointer">Instagram</span>
                      <span className="hover:text-[#C5A059] transition-colors cursor-pointer">Facebook</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-brand-ink/5">
          <motion.div
            className="absolute top-0 left-0 h-full bg-brand-gold origin-left w-full"
            style={{ scaleX }}
          />
          
          {/* Running Horse Figure */}
          <motion.div
            className="absolute top-[1px] z-50 pointer-events-none text-brand-gold"
            style={{ 
              left: horseX,
              x: '-50%'
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -1, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 0.35, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <svg 
                width="8" 
                height="8" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19.5,10c-0.3,0-0.6,0.1-0.9,0.2c-0.2-0.8-0.9-1.4-1.7-1.4c-0.4,0-0.7,0.1-1,0.3c-0.3-0.5-0.8-0.8-1.4-0.8 c-0.2,0-0.4,0-0.6,0.1c-0.4-1.1-1.4-1.9-2.6-1.9c-0.3,0-0.6,0.1-0.9,0.2c-0.2-0.8-0.9-1.4-1.7-1.4c-1,0-1.8,0.8-1.8,1.8 c0,0.1,0,0.2,0,0.3c-0.5,0.3-0.8,0.8-0.8,1.4c0,0.3,0.1,0.6,0.2,0.9c-0.8,0.2-1.4,0.9-1.4,1.7c0,0.4,0.1,0.7,0.3,1 c-0.5,0.3-0.8,0.8-0.8,1.4c0,0.2,0,0.4,0.1,0.6c-1.1,0.4-1.9,1.4-1.9,2.6c0,0.3,0.1,0.6,0.2,0.9c-0.8,0.2-1.4,0.9-1.4,1.7 c0,1,0.8,1.8,1.8,1.8c0.1,0,0.2,0,0.3,0c0.3,0.5,0.8,0.8,1.4,0.8c0.3,0,0.6-0.1,0.9-0.2c0.2,0.8,0.9,1.4,1.7,1.4 c0.4,0,0.7-0.1,1-0.3c0.3,0.5,0.8,0.8,1.4,0.8c0.2,0,0.4,0,0.6-0.1c0.4,1.1,1.4,1.9,2.6,1.9c0.3,0,0.6-0.1,0.9-0.2 c0.2,0.8,0.9,1.4,1.7,1.4c1,0,1.8-0.8,1.8-1.8c0-0.1,0-0.2,0-0.3c0.5-0.3,0.8-0.8,0.8-1.4c0-0.3-0.1-0.6-0.2-0.9 c0.8-0.2,1.4-0.9,1.4-1.7c0-0.4-0.1-0.7-0.3-1c0.5-0.3,0.8-0.8,0.8-1.4c0-0.2,0-0.4-0.1-0.6c1.1-0.4,1.9-1.4,1.9-2.6 c0-0.3-0.1-0.6-0.2-0.9c0.8-0.2,1.4-0.9,1.4-1.7C21.3,10.8,20.5,10,19.5,10z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </nav>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
}
