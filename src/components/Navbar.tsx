import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn, LogOut, User as UserIcon, ChevronDown, Calendar, ArrowRight, Info, Newspaper, Image as ImageIcon, Heart, Mail, Compass, Shield, Award, ChevronRight, Linkedin, Instagram, Facebook, ArrowLeft, ChevronLeft } from 'lucide-react';
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

const BilateralFlagBadge = () => (
  <div className="flex items-center relative h-5 select-none pr-1.5 flex-shrink-0">
    <svg viewBox="0 0 68 32" className="w-14 h-[26px] md:w-16 md:h-[30px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
      <defs>
        {/* Metallic Gold Gradient */}
        <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#F3E5AB" />
        </linearGradient>
        {/* Clips to keep flag content within circles */}
        <clipPath id="circle-clip-at">
          <circle cx="16" cy="16" r="12.5" />
        </clipPath>
        <clipPath id="circle-clip-mn">
          <circle cx="42" cy="16" r="12.5" />
        </clipPath>
      </defs>
      
      {/* LEFT CIRCLE: AUSTRIA */}
      <g>
        {/* Shadow / Border background for Austria */}
        <circle cx="16" cy="16" r="14" fill="url(#gold-metal)" />
        <circle cx="16" cy="16" r="12.5" fill="#FFFFFF" />
        {/* Austria Flag Structure (Horizontal Red - White - Red) */}
        <g clipPath="url(#circle-clip-at)">
          {/* Top Red */}
          <rect x="2" y="2.5" width="28" height="9" fill="#ED2939" />
          {/* Middle White */}
          <rect x="2" y="11.5" width="28" height="9" fill="#FFFFFF" />
          {/* Bottom Red */}
          <rect x="2" y="20.5" width="28" height="9" fill="#ED2939" />
        </g>
        {/* Inner gold rim overlay */}
        <circle cx="16" cy="16" r="12.5" fill="none" stroke="url(#gold-metal)" strokeWidth="0.75" opacity="0.8" />
      </g>

      {/* RIGHT CIRCLE: MONGOLIA (Overlaps Austria slightly for harmony) */}
      <g>
        {/* Shadow / Border background for Mongolia */}
        <circle cx="42" cy="16" r="14" fill="url(#gold-metal)" />
        <circle cx="42" cy="16" r="12.5" fill="#0066B3" />
        {/* Mongolia Flag Structure (Vertical Red - Blue - Red) */}
        <g clipPath="url(#circle-clip-mn)">
          {/* Left Red */}
          <rect x="28" y="2.5" width="9.33" height="27" fill="#DA2032" />
          {/* Middle Blue */}
          <rect x="37.33" y="2.5" width="9.33" height="27" fill="#0066B3" />
          {/* Right Red */}
          <rect x="46.66" y="2.5" width="9.33" height="27" fill="#DA2032" />
          
          {/* High-fidelity miniature Soyombo symbol in the left red stripe */}
          <g fill="#F8CC1B" transform="translate(29.6, 6) scale(0.25)">
            {/* Flame */}
            <path d="M10,0 C11.5,2 12,4 10.5,6.5 C12.5,4.5 13.5,6 12,8.5 C15,7.5 14.5,10 10,11 C5.5,10 5,7.5 8,8.5 C6.5,6 7.5,4.5 9.5,6.5 C8,4 8.5,2 10,0 Z" />
            {/* Sun/Moon */}
            <circle cx="10" cy="14" r="3" />
            <path d="M7,18 A4,4 0 0,0 13,18 A3,3 0 0,1 7,18" />
            {/* Triangle & rects */}
            <polygon points="3,20 17,20 10,25" />
            <rect x="3" y="27" width="14" height="2.5" />
            {/* Yin-Yang */}
            <circle cx="10" cy="38" r="4.5" fill="none" stroke="#F8CC1B" strokeWidth="1.2" />
            <path d="M 5.5,38 A 4.5,4.5 0 0,1 14.5,38 A 2.25,2.25 0 0,1 10,38 A 2.25,2.25 0 0,0 5.5,38 Z" fill="#F8CC1B" />
            
            <rect x="3" y="46.5" width="14" height="2.5" />
            <polygon points="3,51 17,51 10,56" />
            <rect x="1" y="20" width="2" height="36" />
            <rect x="17" y="20" width="2" height="36" />
          </g>
        </g>
        {/* Inner gold rim overlay */}
        <circle cx="42" cy="16" r="12.5" fill="none" stroke="url(#gold-metal)" strokeWidth="0.75" opacity="0.8" />
      </g>
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentLang = languages.find(l => i18n.language?.startsWith(l.code)) || languages[0];

  return (
    <header ref={menuRef} className="fixed top-0 left-0 right-0 z-[100]">
      {/* Top Banner */}
      <AnimatePresence>
        {nextEvent && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[#0A1128] py-2 overflow-hidden border-b border-[#AA7C11]/30 relative z-[120] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            style={{
              backgroundImage: 'linear-gradient(135deg, #AA7C11 0%, #D4AF37 25%, #FFF2B2 50%, #E6C280 75%, #AA7C11 100%)',
            }}
          >
            {/* Shimmer overlay for gold texture depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/5 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/35" />
            
            <div className="flex whitespace-nowrap animate-marquee relative z-10">
              {[...Array(10)].map((_, i) => (
                <Link 
                  key={i}
                  to={`/events/${nextEvent.id}`}
                  className="flex items-center gap-8 px-8 group transition-all duration-500 text-[#0A1128] hover:text-[#0A1128]/80"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={12} className="text-[#0A1128] opacity-90" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#0A1128]/90">
                      {t('events.nextUpcoming')}: <span className="text-black font-black italic">{nextEvent.title}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#0A1128]/80">
                      {new Date(nextEvent.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <ArrowRight size={10} className="group-hover:translate-x-1.5 transition-transform text-[#0A1128]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A1128]/60 mx-4" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Utility Bar (Mobile & Desktop) */}
      <div className={cn(
        "bg-[#0A1128] text-white/80 transition-all duration-500 border-b border-white/5 relative z-[130] overflow-visible",
        scrolled ? "h-0 opacity-0 pointer-events-none overflow-hidden" : "h-9 flex items-center"
      )}>
        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-16 flex items-center justify-between h-full text-[9px] uppercase tracking-[0.18em] font-sans font-bold select-none min-w-0">
          {/* Left: Embassy Flags & Organization details */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-white/75 min-w-0">
            <div className="flex items-center flex-shrink-0">
              <BilateralFlagBadge />
            </div>
            <span className="h-3 w-px bg-white/10 flex-shrink-0" />
            <span className="text-[7.5px] min-[360px]:text-[8px] sm:text-[8.5px] font-medium text-white/70 tracking-[0.05em] sm:tracking-[0.18em] uppercase truncate">
              Austrian-Mongolian Center in Vienna, MCA Cultural and Business HUB
            </span>
          </div>

          {/* Right: Language Selector and Sign In */}
          <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
            {/* Language Selection Trigger */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-white/85 hover:text-[#C5A059] transition-all py-1"
              >
                <span>{currentLang.flag}</span>
                <span className="font-extrabold text-[9px]">{currentLang.code}</span>
                <ChevronDown size={10} className={cn('transition-all text-[#C5A059] opacity-70', isLangOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 bg-[#0A1128]/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 overflow-hidden z-50 p-1.5"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3.5 py-2.5 rounded text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all text-left',
                          i18n.language?.startsWith(lang.code) ? 'text-[#C5A059] font-black bg-white/10' : 'text-white/70'
                        )}
                      >
                        <span>{lang.name}</span>
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="h-3 w-px bg-white/10" />

            {/* Portal Sign-in inline trigger */}
            <div>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 text-white/85 hover:text-[#C5A059] transition-all">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-4.5 h-4.5 rounded-full border border-[#C5A059]/40 p-0.5" />
                    ) : (
                      <UserIcon size={11} className="text-[#C5A059]" />
                    )}
                    <span className="text-[9px] normal-case truncate max-w-[80px]">{user.displayName || 'Member'}</span>
                  </Link>
                  <button onClick={() => logOut()} className="text-white/40 hover:text-red-400 transition-all">
                    <LogOut size={11} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (error: any) {
                      if (error?.code !== 'auth/popup-closed-by-user') {
                        toast.error('Login failed, retry opening in new tab.');
                      }
                    }
                  }}
                  className="flex items-center gap-1.5 text-white/85 hover:text-[#C5A059] transition-all font-bold text-[9px]"
                >
                  <LogIn size={10} className="text-[#C5A059]" />
                  <span>Member Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav
        className={cn(
          'transition-all duration-500 px-4 md:px-16 relative w-full bg-white',
          isOpen ? 'z-[155]' : 'z-[120]',
          scrolled 
            ? 'py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border-b border-brand-gold/15 bg-white/95 backdrop-blur-md' 
            : 'py-5 border-b border-[#0F0F0F]/5',
          isOpen && 'border-b-0 bg-white'
        )}
      >
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between relative">
          
          {/* Left: Organization Branding */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0 z-10">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C5A059]/30 rounded-full flex items-center justify-center transition-all duration-[750ms] group-hover:border-[#C5A059] group-hover:rotate-[360deg] bg-white shadow-sm overflow-hidden p-1">
                <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="flex flex-col select-none">
              <h1 className="font-serif font-black text-sm md:text-lg tracking-[0.05em] leading-none uppercase text-[#0066B3] m-0">
                {t('nav.mongolian')} <span className="text-[#DA2032] font-black tracking-[0.04em]">{t('nav.center')}</span>
              </h1>
              <span className="font-serif text-[7.5px] md:text-[8.5px] uppercase tracking-[0.35em] font-extrabold text-[#C5A059] mt-1 transition-colors duration-300">
                {t('nav.location')}
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop only) */}
          <div className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 mx-4">
            {navItems.filter(item => item.path !== '/admin' && item.path !== '/diorama').map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group text-[9px] xl:text-[10px] uppercase tracking-[0.18em] font-sans font-black transition-all duration-300 relative py-2",
                    isActive ? "text-[#0066B3]" : "text-slate-600 hover:text-[#0066B3] hover:translate-y-[-0.5px]"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive ? (
                    <motion.div
                      layoutId="activeSubNavTab"
                      className="absolute bottom-[-1px] left-0.5 right-0.5 h-[2px] bg-[#0066B3] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066B3]/40 scale-0 group-hover:scale-100 transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Trigger Group (Desktop only) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/membership"
              className="text-[9px] uppercase tracking-[0.15em] font-extrabold px-5 py-3 rounded border border-[#0A1128] hover:bg-[#0A1128] hover:text-white transition-all duration-300 shadow-sm hover:shadow active:scale-95"
            >
              Become a Member
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex items-center gap-2.5 text-[9px] uppercase tracking-[0.15em] font-extrabold transition-all duration-300 py-3 px-5 rounded bg-[#0A1128] border border-[#0A1128] text-white hover:bg-neutral-800 hover:border-neutral-800 shadow-sm active:scale-95"
              )}
            >
              {isOpen ? <X size={12} className="text-[#C5A059]" /> : <Menu size={12} className="text-[#C5A059]" />}
              <span>{isOpen ? t('common.close', 'CLOSE') : 'DIRECTORY'}</span>
            </button>
          </div>

          {/* Mobile Layout Actions Row */}
          <div className="lg:hidden flex items-center gap-3 z-10">
            {/* Lang cycler flag */}
            <button
              onClick={() => {
                const currentIndex = languages.findIndex(l => i18n.language?.startsWith(l.code));
                const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % languages.length : 0;
                const nextLang = languages[nextIndex];
                i18n.changeLanguage(nextLang.code);
              }}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-all duration-300 bg-brand-paper hover:bg-white text-brand-ink border-brand-ink/10 shadow-sm active:scale-90"
            >
              {currentLang.flag}
            </button>

            {/* Profile Avatar Trigger */}
            {user && (
              <Link to="/profile" className="w-9 h-9 rounded-full border border-[#C5A059]/30 p-0.5 bg-white flex items-center justify-center shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon size={12} className="text-[#C5A059]" />
                )}
              </Link>
            )}

            {/* Burger Trigger */}
            <button 
              className="p-2.5 transition-all duration-300 text-white rounded bg-[#0A1128] hover:bg-neutral-800 active:scale-95 flex items-center justify-center shadow-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={16} className="text-[#C5A059]" /> : <Menu size={16} className="text-[#C5A059]" />}
            </button>
          </div>

        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 h-screen w-full bg-slate-50/98 z-[130] flex flex-col overflow-hidden"
              style={{ willChange: 'opacity' }}
            >
              {/* Executive Top Header inside open Menu Overlay */}
              <div className="w-full bg-white border-b border-brand-ink/10 py-2.5 sm:py-3 shrink-0 relative z-20 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between select-none min-w-0">
                  {/* Branding Info */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 mr-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 border border-[#C5A059]/30 rounded-full flex items-center justify-center bg-white p-0.5 flex-shrink-0">
                      <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-serif font-black text-[10px] sm:text-xs md:text-sm tracking-[0.05em] leading-none uppercase text-[#0066B3] truncate">
                        {t('nav.mongolian')} <span className="text-[#DA2032] font-black tracking-[0.04em]">{t('nav.center')}</span>
                      </span>
                      <span className="font-serif text-[6.5px] sm:text-[7.5px] md:text-[8px] uppercase tracking-[0.25em] font-extrabold text-[#C5A059] mt-0.5 truncate">
                        {t('nav.location')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Mobile language picker inside opened overlay */}
                    <button
                      onClick={() => {
                        const currentIndex = languages.findIndex(l => i18n.language?.startsWith(l.code));
                        const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % languages.length : 0;
                        const nextLang = languages[nextIndex];
                        i18n.changeLanguage(nextLang.code);
                      }}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all duration-300 bg-[#0A1128]/5 hover:bg-[#0A1128]/10 text-brand-ink border-brand-ink/5 shadow-sm active:scale-90"
                      title="Change Language"
                    >
                      {currentLang.flag}
                    </button>

                    {/* Redundant, Beautiful Back Trigger */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-sans font-black text-white bg-[#0A1128] hover:bg-[#0066B3] transition-all py-2 px-3 sm:px-4.5 rounded shadow-sm hover:shadow active:scale-95"
                    >
                      <X size={13} className="text-[#C5A059]" />
                      <span className="hidden min-[400px]:inline">CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Background Cultural Emblem Accent */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 flex items-center justify-center">
                <div className="absolute right-[-10%] bottom-[-10%] text-brand-gold/15 transition-transform duration-1000 rotate-[15deg]">
                  <UlziiSymbol className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-brand-gold/10" />
                </div>
              </div>
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 flex flex-col justify-between pb-4 sm:pb-8 h-full min-h-0 relative z-10 pt-3 sm:pt-6">
                
                {/* Scrollable menu content grid */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-6 lg:gap-16 pt-2 pb-4">
                  
                  {/* Left Column: Menu Links */}
                  <div className="flex flex-col justify-start lg:border-r border-brand-ink/10 lg:pr-12 text-left">
                     <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#C5A059] mb-3 lg:mb-4 block">
                        {t('footer.navTitle', 'Navigation')}
                     </span>
                     <nav className="flex flex-col">
                       {navItems.map((item, idx) => {
                         const isActive = location.pathname === item.path;
                         return (
                           <div key={item.path} className="overflow-hidden">
                             <motion.div
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               exit={{ opacity: 0, x: -15 }}
                               transition={{ duration: 0.4, delay: 0.05 + idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                             >
                               <Link
                                 to={item.path}
                                 onClick={() => setIsOpen(false)}
                                 className="group flex items-center justify-between w-full relative py-2 sm:py-3.5 border-b border-brand-ink/5 hover:bg-[#0A1128]/5 px-2 rounded-md transition-all"
                               >
                                 <div className="flex items-center gap-3.5">
                                   <item.icon 
                                     size={15} 
                                     className={cn(
                                       "transition-colors duration-300",
                                       isActive ? "text-[#0066B3]" : "text-[#0A1128]/40 group-hover:text-[#0066B3]"
                                     )} 
                                   />
                                   <span className={cn(
                                     "font-sans font-extrabold text-[#0A1128] text-xs sm:text-sm tracking-[0.05em] leading-none transition-all duration-300 uppercase",
                                     isActive ? "text-[#0066B3] translate-x-1" : "text-brand-ink group-hover:text-[#0066B3] group-hover:translate-x-1"
                                   )}>
                                     {item.name}
                                   </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   {item.path === '/events' && (
                                     <span className="text-[7.5px] bg-[#C5A059] text-white px-1.5 py-0.5 uppercase tracking-[0.12em] font-sans font-black shadow-sm transform rotate-[2deg]">
                                       UPCOMING
                                     </span>
                                   )}
                                   {item.path === '/membership' && (
                                     <span className="text-[7.5px] bg-[#0A1128] text-white px-1.5 py-0.5 uppercase tracking-[0.12em] font-sans font-black shadow-sm transform -rotate-[2deg] whitespace-nowrap">
                                        JOIN
                                     </span>
                                   )}
                                   {item.path === '/impact' && (
                                     <span className="text-[7.5px] bg-[#DA2032] text-white px-1.5 py-0.5 uppercase tracking-[0.12em] font-sans font-black shadow-sm transform rotate-[2deg] whitespace-nowrap">
                                        GIVE
                                      </span>
                                   )}
                                   <ChevronRight 
                                     size={14} 
                                     className={cn(
                                       "transition-all duration-300 opacity-20",
                                       isActive ? "text-[#0066B3] translate-x-0 opacity-100" : "text-brand-ink/30 group-hover:text-[#0066B3] group-hover:translate-x-1 group-hover:opacity-100"
                                     )}
                                   />
                                 </div>
                               </Link>
                             </motion.div>
                           </div>
                         );
                       })}
                     </nav>
                  </div>

                  {/* Right Column: Featured Promotion Content */}
                  <div className="flex flex-col justify-between lg:pl-4 border-t lg:border-t-0 border-brand-ink/10 pt-6 lg:pt-0 mt-6 lg:mt-0">
                     <div className="flex flex-col">
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="mb-3"
                        >
                          <span className="bg-[#0A1128] text-white px-2.5 py-1 rounded-md text-[9px] uppercase tracking-[0.18em] font-sans font-black shadow-sm inline-block">
                            {t('nav.featured.badge', 'Connecting cultures,')}
                          </span>
                        </motion.div>
                        
                        <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-brand-ink font-light leading-tight tracking-tight mb-3"
                        >
                          {t('nav.featured.title', 'We major in connection')}
                        </motion.h2>

                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="font-sans text-xs sm:text-[13px] text-brand-ink/70 max-w-xl leading-relaxed mb-4"
                        >
                          {t('nav.featured.desc', "We're dedicated to helping you discover new opportunities, bridging cultural insights with professional success.")}
                        </motion.p>
                     </div>

                     <motion.div
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.8, delay: 0.4 }}
                       className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-brand-ink/5 mt-auto max-h-[160px] sm:max-h-[220px] md:max-h-[260px] aspect-[16/10] sm:aspect-[21/9]"
                     >
                       <img 
                         src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop" 
                         alt="Hands On Practice" 
                         className="w-full h-full object-cover select-none pointer-events-none hover:scale-[1.02] transition-transform duration-700"
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                     </motion.div>
                  </div>
                </div>

                {/* Footer Bar: DePaul inspired links & social icons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-full pt-3 sm:pt-5 border-t border-brand-ink/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 relative z-10 shrink-0 mt-2 sm:mt-4"
                >
                  {/* Left: Quick Portal links */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-brand-ink/60">
                     <Link to="/membership/apply-student" onClick={() => setIsOpen(false)} className="hover:text-[#0066B3] transition-colors">FOR STUDENTS</Link>
                     <Link to="/membership/apply-professional" onClick={() => setIsOpen(false)} className="hover:text-[#0066B3] transition-colors">FOR COMPANIES</Link>
                     <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#0066B3] transition-colors">FOR INSTITUTIONS</Link>
                  </div>

                  {/* Right: Social icons & Sign in */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5">
                     <div className="flex gap-4 items-center">
                        <a href="https://www.linkedin.com/company/mongolian-center-in-austria/" target="_blank" rel="noopener noreferrer" className="text-brand-ink/50 hover:text-brand-gold transition-colors">
                           <Linkedin size={14} />
                        </a>
                        <a href="https://www.instagram.com/mncenteraustria/" target="_blank" rel="noopener noreferrer" className="text-brand-ink/50 hover:text-brand-gold transition-colors">
                           <Instagram size={14} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61568045031863" target="_blank" rel="noopener noreferrer" className="text-brand-ink/50 hover:text-brand-gold transition-colors">
                           <Facebook size={14} />
                        </a>
                     </div>
                     
                     <div className="h-3 w-px bg-brand-ink/10 hidden sm:block" />

                     <div>
                        {user ? (
                          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em]">
                             <Link to="/profile" onClick={() => setIsOpen(false)} className="text-brand-ink hover:text-brand-gold transition-colors">
                               {user.displayName}
                             </Link>
                             <div className="h-2 w-px bg-brand-ink/20" />
                             <button onClick={() => { logOut(); setIsOpen(false); }} className="text-brand-ink/50 hover:text-brand-gold transition-colors">
                               Sign Out
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
                            className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-ink hover:text-brand-gold transition-colors flex items-center gap-1.5"
                          >
                            <LogIn size={11} /> Member Access
                          </button>
                        )}
                     </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold/10">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#C5A059] origin-left w-full"
            style={{ scaleX }}
          />
          
          {/* Running Horse Figure */}
          <motion.div
            className="absolute top-[-4.5px] z-50 pointer-events-none text-[#C5A059]"
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
