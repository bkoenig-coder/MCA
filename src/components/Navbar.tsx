import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn, LogOut, User as UserIcon, ChevronDown, Calendar, ArrowRight, Info, Newspaper, Image as ImageIcon, Heart, Mail, Compass, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, logOut, db, collection, query, where, orderBy, onSnapshot, handleFirestoreError, OperationType } from '../firebase';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol } from './MongolianDesign';
import mcaLogo from '../assets/media/mcalogo-1.png';

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
          'transition-all duration-300 px-4 md:px-6 py-4 md:py-8 relative z-[120] w-full',
          isOpen ? 'bg-white border-b-0' : (scrolled || nextEvent ? 'bg-white py-3 md:py-4 shadow-sm border-b border-brand-ink/5' : 'bg-white'),
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
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center w-full min-h-[80px] relative z-[120]">
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
            <div className="flex justify-center z-50">
              <Link to="/" className="flex items-center gap-4 md:gap-6 group">
                <div className="relative">
                  <div className="w-14 h-14 md:w-20 md:h-20 border border-[#C5A059]/20 rounded-full flex items-center justify-center transition-all duration-1000 group-hover:border-[#C5A059] group-hover:rotate-[360deg] bg-white backdrop-blur-sm shadow-sm overflow-hidden p-1">
                    <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -inset-2 border border-[#C5A059]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-[Arial] font-bold italic text-xl md:text-3xl leading-none tracking-tight uppercase transition-colors duration-300 text-brand-ink no-underline"
                  )}>
                    {t('nav.mongolian')} <span className="text-[#ffa700] border-[#ff0000]">{t('nav.center')}</span>
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
                    onClick={async () => {
                      try {
                        await signInWithGoogle();
                      } catch (error: any) {
                        if (error?.code === 'auth/popup-blocked') {
                          toast.error('Login popup blocked by your browser. Please allow popups or open the app in a new tab.');
                        } else if (error?.code !== 'auth/popup-closed-by-user') {
                          toast.error(`Sign in failed: ${error.message || 'Unknown error. Try opening in a new tab.'}`);
                        }
                      }
                    }}
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
          <div className="grid lg:hidden grid-cols-[1fr_auto_1fr] items-center w-full relative z-[120]">
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
              <Link to="/" className="flex items-center gap-3 group ml-[42px]">
                <div className="w-12 h-12 border border-[#C5A059]/20 rounded-full flex items-center justify-center bg-white backdrop-blur-sm shadow-sm overflow-hidden p-1">
                  <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-[Arial] font-bold italic text-lg leading-none tracking-tight uppercase transition-colors duration-300 text-brand-ink no-underline"
                  )}>
                    {t('nav.mongolian')} <span className="text-[#ffa700] border-[#ff0000]">{t('nav.center')}</span>
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
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 min-h-screen w-full bg-white z-[110] flex flex-col pt-[90px] md:pt-[110px] overflow-y-auto"
              style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            >
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-24 flex flex-col justify-between pb-12 relative h-full min-h-[min-content]">
                {/* Subtle Decorative Accents */}
                <div className="absolute top-0 right-12 opacity-[0.03] pointer-events-none hidden md:block">
                  <svg width='800' height='800' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg' className="-mt-32">
                    <g fill='none' stroke='#040A1A' strokeWidth='0.5'>
                      <path d='M10,0 V10 H0 M40,10 H30 V0 M30,40 V30 H40 M0,30 H10 V40'/>
                      <rect x='10' y='10' width='20' height='20'/>
                      <rect x='15' y='15' width='10' height='10'/>
                    </g>
                  </svg>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-12 md:gap-24 relative z-10 w-full mt-4 md:mt-8">
                  {/* Left Column: Primary Navigation Links */}
                  <nav className="flex-1 flex flex-col justify-start">
                    {navItems.map((item, idx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            'group flex items-center w-max transition-all duration-300 relative py-2 lg:py-3',
                            isActive ? 'text-brand-gold' : 'text-brand-ink/90 hover:text-brand-gold md:hover:translate-x-6'
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-[60px] uppercase tracking-[-0.03em] leading-[1.1]">
                            {item.name}
                          </span>
                          {item.path === '/events' && (
                            <span className="ml-4 md:ml-6 flex-shrink-0 text-[9px] md:text-xs bg-brand-gold text-brand-ink px-2 md:px-3 py-1 -mt-4 md:-mt-8 uppercase tracking-[0.2em] font-sans font-bold shadow-md transform rotate-[4deg]">
                              UPCOMING
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Right Column: Information & Secondary Utilities */}
                  <div className="w-full md:w-80 lg:w-96 flex flex-col gap-8 md:gap-12 pb-8">
                    {/* User Profile / Login Block */}
                    <div className="flex flex-col gap-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/40 border-b border-brand-ink/10 pb-3">
                        {user ? 'YOUR PROFILE' : 'MEMBERSHIP'}
                      </div>
                      
                      {user ? (
                        <div className="flex flex-col gap-6">
                          <Link 
                            to="/profile" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 group transition-colors"
                          >
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-brand-gold/30 shadow-sm" />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-gold border-2 border-brand-gold/30 shadow-sm">
                                <UserIcon size={24} />
                              </div>
                            )}
                            <div className="flex flex-col text-left">
                              <span className="font-serif text-lg text-brand-ink group-hover:text-brand-gold transition-colors">{user.displayName}</span>
                              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-ink/50 font-bold mt-1">{t('nav.member')}</span>
                            </div>
                          </Link>
                          
                          <button 
                            onClick={() => { logOut(); setIsOpen(false); }} 
                            className="flex items-center justify-center gap-2 px-6 py-4 w-full md:w-auto rounded-xl text-white bg-brand-ink text-[11px] font-bold uppercase tracking-[0.2em] shadow-md hover:bg-black transition-all hover:-translate-y-0.5"
                          >
                            <LogOut size={16} />
                            <span>{t('nav.signOut')}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <p className="text-sm font-serif text-brand-ink/70">Join our community to engage with events and connect to Mongolian culture.</p>
                          <button
                            onClick={async () => {
                              try {
                                await signInWithGoogle();
                                setIsOpen(false);
                              } catch (error: any) {
                                if (error?.code === 'auth/popup-blocked') {
                                  toast.error('Login popup blocked by your browser. Please allow popups or open the app in a new tab.');
                                } else if (error?.code !== 'auth/popup-closed-by-user') {
                                  toast.error(`Sign in failed: ${error.message || 'Unknown error. Try opening in a new tab.'}`);
                                }
                              }
                            }}
                            className="w-full bg-brand-ink text-white hover:bg-brand-gold px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(4,10,26,0.1)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <LogIn size={18} />
                            {t('nav.signIn')}
                          </button>
                        </div>
                      )}
                    </div>
                
                    {/* Socials Block */}
                    <div className="flex flex-col gap-6">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/40 border-b border-brand-ink/10 pb-3">
                        CONNECT
                      </div>
                      <div className="flex flex-col gap-4 text-brand-ink/70 text-sm font-sans font-bold uppercase tracking-[0.1em]">
                        <a href="https://www.instagram.com/mncenteraustria/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors cursor-pointer w-max flex items-center gap-2 group">
                          <ArrowRight size={14} className="text-brand-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                          Instagram
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61568045031863" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors cursor-pointer w-max flex items-center gap-2 group">
                          <ArrowRight size={14} className="text-brand-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                          Facebook
                        </a>
                        <a href="https://www.linkedin.com/company/mongolian-center-in-austria/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors cursor-pointer w-max flex items-center gap-2 group">
                          <ArrowRight size={14} className="text-brand-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                          LinkedIn
                        </a>
                      </div>
                    </div>

                    {/* Bottom Established Stamp */}
                    <div className="mt-8 pt-8 border-t border-brand-ink/10 text-[9px] uppercase tracking-[0.4em] font-bold text-brand-ink/30">
                      ESTABLISHED 2026 • VIENNA, AUSTRIA
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
