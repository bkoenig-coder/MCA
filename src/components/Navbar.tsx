import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn, LogOut, User as UserIcon, ChevronDown, Calendar, ArrowRight, Info, Newspaper, Image as ImageIcon, Heart, Mail, Compass, Shield, Award } from 'lucide-react';
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
  const { user, profile } = useAuth();
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
    { name: t('nav.membership', { defaultValue: 'Membership' }), path: '/membership', icon: Award },
    { name: t('nav.news'), path: '/news', icon: Newspaper },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.impact'), path: '/impact', icon: Heart },
    { name: t('nav.contact'), path: '/contact', icon: Mail },
    { name: 'Explore 3D Diorama', path: '/diorama', icon: Compass },
  ];

  const isSuperAdmin = user?.email?.toLowerCase() === 'emeraldtorstein@gmail.com';
  const isAdminUser = isSuperAdmin || user?.email?.toLowerCase() === 'batmunkh.unen@gmail.com' || profile?.role === 'admin';
  const isEditor = isAdminUser || profile?.role === 'moderator';

  if (isEditor) {
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
            className="bg-[#0A1128] text-white py-1.5 md:py-2 overflow-hidden border-b border-white/10 shadow-sm"
          >
            <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(10)].map((_, i) => (
                <Link 
                  key={i}
                  to={`/events/${nextEvent.id}`}
                  className="flex items-center gap-8 px-8 group transition-all duration-500"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={12} className="opacity-80 text-brand-gold" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">
                      {t('events.nextUpcoming')}: <span className="text-white/90 italic">{nextEvent.title}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-80">
                      {new Date(nextEvent.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform text-brand-gold" />
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/20 mx-4" />
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
                    {t('nav.mongolian')} <span className="text-[#ffa700]">{t('nav.center')}</span>
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
              <Link to="/" className="flex items-center gap-3 group lg:hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#C5A059]/20 rounded-full flex items-center justify-center bg-white backdrop-blur-sm shadow-sm overflow-hidden p-1 flex-shrink-0">
                  <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className={cn(
                    "font-[Arial] font-bold italic text-[15px] sm:text-lg leading-tight tracking-tight uppercase transition-colors duration-300 text-brand-ink no-underline flex flex-col"
                  )}>
                    <span>{t('nav.mongolian')}</span>
                    <span className="text-[#ffa700]">{t('nav.center')}</span>
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
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 min-h-screen w-full bg-white/95 z-[110] flex flex-col pt-[110px] sm:pt-[120px] md:pt-[140px]"
              style={{ willChange: 'opacity' }}
            >
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 sm:px-8 md:px-16 flex flex-col justify-between pb-6 md:pb-8 h-full min-h-[min-content] relative">
                
                {/* Decorative Line */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 bottom-0 left-1/2 w-px bg-brand-ink/5 origin-top"
                />

                <div className="flex-1 flex flex-col items-center justify-center relative w-full my-auto">
                  <nav className="flex flex-col items-center justify-center w-full gap-2 md:gap-4">
                    {navItems.map((item, idx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <div key={item.path} className="overflow-hidden py-1 px-4 md:px-8">
                          <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.7, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <Link
                              to={item.path}
                              className={cn(
                                'group flex items-center justify-center w-max mx-auto relative transition-colors duration-500',
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className={cn(
                                "font-[Arial] font-bold italic text-3xl sm:text-4xl md:text-5xl lg:text-[60px] tracking-tight leading-none group-hover:text-[#C5A059] transition-all duration-500 uppercase",
                                isActive ? "text-[#C5A059] translate-x-2" : "text-brand-ink"
                              )}>
                                {item.name}
                              </span>
                              {item.path === '/events' && (
                                <span className="absolute top-0 -right-6 md:top-1 md:-right-10 flex-shrink-0 text-[7px] md:text-[9px] bg-brand-gold text-brand-ink px-2 md:px-2.5 py-0.5 md:py-1 uppercase tracking-[0.2em] font-sans font-bold shadow-sm transform rotate-[4deg]">
                                  UPCOMING
                                </span>
                              )}
                              {item.path === '/membership' && (
                                <span className="absolute top-0 -right-6 md:top-1 md:-right-10 flex-shrink-0 text-[7px] md:text-[9px] bg-sky-500 text-white px-2 md:px-2.5 py-0.5 md:py-1 uppercase tracking-[0.2em] font-sans font-bold shadow-sm transform -rotate-[4deg] whitespace-nowrap">
                                  BECOME A MEMBER
                                </span>
                              )}
                            </Link>
                          </motion.div>
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-0 mt-5 md:mt-6 pt-5 border-t border-brand-ink/10 relative z-10"
                >
                  {/* Left: Socials */}
                  <div className="flex flex-col gap-3 items-center md:items-start">
                     <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">Connect</span>
                     <div className="flex gap-6 text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-brand-ink/70">
                        <a href="https://www.instagram.com/mncenteraustria/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Instagram</a>
                        <a href="https://www.facebook.com/profile.php?id=61568045031863" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Facebook</a>
                        <a href="https://www.linkedin.com/company/mongolian-center-in-austria/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">LinkedIn</a>
                     </div>
                  </div>

                  {/* Center: Established */}
                  <div className="flex flex-col justify-end items-center text-[9px] uppercase tracking-[0.4em] font-bold text-brand-ink/30 order-last md:order-none">
                     ESTABLISHED 2026<br/>VIENNA, AUSTRIA
                  </div>

                  {/* Right: User */}
                  <div className="flex flex-col gap-3 items-center md:items-end">
                     <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">Membership</span>
                     {user ? (
                       <div className="flex items-center gap-3">
                          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex flex-col text-right group">
                            <span className="font-serif text-sm text-brand-ink group-hover:text-brand-gold transition-colors">{user.displayName}</span>
                          </Link>
                          <div className="w-px h-4 bg-brand-ink/20 mx-1" />
                          <button onClick={() => { logOut(); setIsOpen(false); }} className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/50 hover:text-brand-ink transition-colors flex items-center gap-1.5">
                            <LogOut size={12} /> Sign Out
                          </button>
                       </div>
                     ) : (
                       <button
                         onClick={async () => {
                            try {
                              await signInWithGoogle();
                              setIsOpen(false);
                            } catch (error: any) {
                              if (error?.code !== 'auth/popup-closed-by-user') {
                                toast.error('Login failed, try opening in a new tab.');
                              }
                            }
                         }}
                         className="flex items-center gap-2 text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-brand-ink hover:text-brand-gold transition-colors"
                       >
                         <LogIn size={14} /> Member Access
                       </button>
                     )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-brand-ink/5">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#0A1128] origin-left w-full"
            style={{ scaleX }}
          />
          
          {/* Running Horse Figure */}
          <motion.div
            className="absolute top-[1px] z-50 pointer-events-none text-[#0A1128]"
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
                width="14" 
                height="14" 
                viewBox="0 0 512 512" 
                fill="currentColor"
                className="-mt-2"
              >
                <path d="M258.962 29.14c-3.21.063-6.68 1.158-10.303 3.4c-5.798 3.584-11.47 10.14-14.872 18.715c-3.4 8.575-3.767 17.236-2.004 23.82c1.763 6.585 5.248 10.765 9.83 12.583s9.986 1.165 15.784-2.42c5.797-3.586 11.467-10.143 14.87-18.717c3.4-8.573 3.767-17.235 2.005-23.82c-1.763-6.584-5.25-10.764-9.832-12.58a14 14 0 0 0-5.478-.98zm83.428 36.012c-8.823 13.437-17.545 27.577-36.268 45.2l-1.615 1.52l-2.137.596c-9.165 2.554-19 3.7-28.863 4.48c-.54 5.822-1.76 11.47-3.492 16.946c14.814.187 28.827-.778 41.297-4.62c18.26-17.188 36.623-35.375 44.685-56.7zm-133.135 31.58q-.258-.001-.527.02c-1.248.117-2.846.825-5.022 2.126c-11.898 12.29-14.007 33.196-.867 57.082c5.73 10.42 18.094 18.277 33.66 23.58c13.165 4.485 28.138 7.013 41.808 8.51l3.71-13.443c-6.24-1.808-14.008-3.65-22.142-6.082c-11.813-3.53-24.576-8.437-34.355-18.432l-.343-.35l-.303-.388c-5.047-6.43-5.557-13.842-5.6-22.496c-.037-7.045.813-15.254 2.02-24.023c-3.345-2.203-6.258-4.21-8.39-5.088c-1.395-.575-2.445-1.008-3.65-1.018zm29.242 12.676c-.806 6.653-1.25 12.573-1.226 17.36c.035 6.717 1.526 10.814 1.69 11.21c1.988 1.936 4.304 3.67 6.87 5.24c4.536-8.52 8.03-16.96 9.363-25.23zm202.955 36.5c-38.698.407-97.748 25.527-127.31 46.75l21.93 26.664c23.08-25.157 50.67-42.282 78.29-49.248c28.02-7.068 56.45-3.25 78.33 13.597c1.784-1.8 2.504-3.56 2.694-5.432c.305-3.01-.998-7.446-4.865-12.283c-7.734-9.675-24.947-19.342-45.388-20.008q-1.805-.059-3.68-.04zm-259.16 8.734c-6.568 16.39-10.208 33.35-7.805 47.883c2.263 13.104 8.145 17.46 18.125 21.94c9.99 4.483 23.807 7.117 36.907 14.036l6.466 3.417l-2.022 7.03c-5.67 19.72-14.65 38.776-28.312 56.41c8.66 10.85 24.016 19.95 40.84 29.016l6.138-10.893l-17.434-29.078l4.14-4.914c10.787-12.804 16.836-38.882 20.882-55.754c-7.692-7.7-25.79-16.08-42.803-28.55l-6.36-4.66l3.784-6.917c.52-.952 1.076-1.906 1.62-2.86c-12.188-5.97-22.86-14.237-29.39-26.11a97 97 0 0 1-4.778-9.995zm260.135 29.922c-7.587-.093-15.517.908-23.664 2.963c-26.07 6.576-53.767 24.346-75.986 51.377l-6.952 8.457l-33.34-40.54c-1.77.288-3.426.55-5.21.842c9.908 16.11 16.95 31.17 25.693 40.888c5.715 6.352 11.743 10.584 20.38 12.742c8.025 2.006 18.66 2.104 33.263-1.126c-2.695-7.855-2.26-16.004-.318-23.077c2.52-9.172 7.08-17.28 10.78-24.534l16.035 8.184c-2.167 4.244-4.322 8.392-6.112 12.324c5.102-.272 13.1-.745 20.61-1.246c8.984-.6 14.34-.982 17.38-1.197c1.703-3.57 3.562-6.718 5.905-9.497c3.513-4.17 8.686-7.383 14.256-8.108a28.4 28.4 0 0 1 4.13-.234c6.8.114 13.423 2.692 21.293 6.686c1.867-6.108 3.71-12.142 5.54-18.045c-12.05-11.18-27.044-16.652-43.683-16.856zM277.92 210.86c-4.448.743-8.952 1.51-13.448 2.27c5.022 3.758 9.534 8.032 13.05 13.293l2.204 3.297l-.948 3.852c-3.357 13.658-7.853 41.85-21.802 62.15l16.474 27.48l-14.802 26.26c6.94-1.8 13.538-4.246 19.607-7.447l11-5.8l2.074 12.26c5.978 35.36-13.102 68.48-22.475 99.294c6.508 9.05 12.247 14.98 17.275 20.388c4.097 4.407 8.004 9.006 10.654 14.683h28.254c-1.863-9.857-5.227-15.497-17.834-26.75l-5.578-4.98l3.87-6.396c15.287-25.248 24.903-82.92 28.925-111.46l.92-6.526l6.503-1.092c10.253-1.72 16.833-5.857 22.162-11.826s9.233-14.076 12.258-23.29c1.334-4.067 2.448-8.31 3.478-12.62c-16.163 3.494-29.45 3.68-40.754.855c-12.36-3.088-21.957-9.893-29.4-18.164c-12.948-14.39-20.65-32.733-31.665-49.73zm-108.337 19.524c-14.047 2.79-27.408 5.57-39.43 8.29c-12.594 4.275-20.655 10.807-26.92 19.765c-6.32 9.03-10.644 20.798-14.083 34.75c-6.85 27.778-10.026 63.737-23.073 100.858l-17.465 65.434c3.948 3.74 7.722 6.273 11.717 9.855c3.488 3.13 6.69 7.757 8.58 13.504h23.447c.593-9.5-2.71-19.834-10.856-26.5l-5.18-4.235l26.142-62.953l5.35-.537c21.24-2.133 40.548-26.11 51.19-40.262l3.75-4.982l5.982 1.758c22.6 6.637 49.11 10.156 73.326 7.377c-21.107-11.086-43.545-22.54-55.405-43.017l-3.175-5.483l4.09-4.84c12.58-14.873 20.877-30.868 26.6-47.8c-8.712-3.39-18.953-6.002-28.93-10.48c-5.508-2.472-10.967-5.897-15.657-10.5zm288.38.46a3 3 0 0 0-.493.02c-1.118.146-1.406.185-2.817 1.858c-1.352 1.604-3.214 4.944-5.216 9.785c-1.614 5.982-.063 10.297 4.242 15.903c2.565 3.34 6.158 6.746 10.16 10.117c4.106-10.06 7.79-20.716 11.25-31.467c-9.026-4.414-14.86-6.17-17.128-6.217zm-340.25 13.26c-.02 0-.32.076-.358.08c.37.02.43-.086.36-.08zm313.353 4.83c-4.126.288-5.917.422-12.262.845c-10.82.72-21.303 1.44-26.12 1.497c.313 2.1 1.08 4.127 2.41 6.265l.532.854l.33.95c.627 1.807 1.2 3.502 1.744 5.15c2.49 4.435 9.938 11.22 20.264 16.535c10.333 5.317 23.014 9.548 34.29 11.682a162 162 0 0 0 3.876-7.19c-5.863-4.615-11.877-9.832-16.727-16.148c-4.34-5.652-7.67-12.72-8.337-20.44m-347.57 7.306c-5.687 2.507-11.285 5.163-16.114 7.74c-6.134 3.273-10.633 6.54-12.37 8.03c-4.556 15.79-6.52 30.088-11.78 44.884c-4.72 13.276-12.487 26.58-26.66 40.11c11.624 10 23.234 16.21 37.47 15.316c8.202-29.22 11.38-58.08 17.63-83.44c2.888-11.71 6.472-22.743 11.825-32.64zm320.41 37.61c.224 5.742-.135 11.87-.944 19.608c-.05 6.863 3.644 11.33 9.248 12.71c5.623 1.388 14.58-.295 24.822-12.622l.204-.244l.22-.23a82 82 0 0 0 3.836-4.324c-10.776-2.654-21.76-6.668-31.562-11.71a138 138 0 0 1-5.825-3.19zm-27.463 33.017c-6.36 6.718-14.816 11.936-25.082 14.857c-.01.077-.026.17-.037.248l15.336 17.203l-8.665 25.655l-14.53 3.216c-1.706 8.07-3.678 16.264-5.95 24.278c.423.08.85.17 1.27.246c10.442 1.892 19.172 1.915 26.915-1.684c17.515-18.86 28.118-31.565 31.95-53.44c-1.87-7.903-10.127-20.008-19.666-29.138c-.512-.49-1.026-.967-1.54-1.44zm-210.993 42.66c-5.333 6.792-12.013 14.51-20.16 21.164c16.307 31.444 34.568 62.892 57.48 92.173h26.753c-28.96-35.58-47.84-75.123-64.073-113.336z" />
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
