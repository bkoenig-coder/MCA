import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User as UserIcon, ChevronDown, Calendar, ArrowRight, Info, Newspaper, Image as ImageIcon, Heart, Mail, Compass, Shield, Award, Linkedin, Instagram, Facebook, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, logOut, db, collection, query, where, orderBy, onSnapshot, handleFirestoreError, OperationType } from '../firebase';
import { useTranslation } from 'react-i18next';
import { AlkhanBorder } from './MongolianDesign';
import { CloudDrift } from './CuteClouds';
import BridgeMap from './BridgeMap';
import WavingBoy from './WavingBoy';
import mcaLogoWide from '../assets/media/mca-logo-wide.png';
import GB from 'country-flag-icons/react/3x2/GB';
import AT from 'country-flag-icons/react/3x2/AT';
import MN from 'country-flag-icons/react/3x2/MN';
import TR from 'country-flag-icons/react/3x2/TR';

const languages = [
  { code: 'en', name: 'English', Flag: GB },
  { code: 'de', name: 'Deutsch', Flag: AT },
  { code: 'mn', name: 'Монгол', Flag: MN },
  { code: 'tr', name: 'Türkçe', Flag: TR },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
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
    { name: t('nav.membership'), path: '/membership', icon: Award },
    { name: t('nav.news'), path: '/news', icon: Newspaper },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.impact'), path: '/impact', icon: Heart },
    { name: t('nav.contact'), path: '/contact', icon: Mail },
    { name: t('nav.heritage'), path: '/heritage', icon: Compass },
    { name: t('nav.careers'), path: '/careers', icon: Briefcase },
  ];

  const isSuperAdmin = user?.email?.toLowerCase() === 'emeraldtorstein@gmail.com';
  const isAdminUser = isSuperAdmin || user?.email?.toLowerCase() === 'batmunkh.unen@gmail.com' || profile?.role === 'admin';
  const isEditor = isAdminUser || profile?.role === 'moderator';

  if (isEditor) {
    navItems.push({ name: t('nav.admin'), path: '/admin', icon: Shield });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
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
      setNextEvent(null);
    });

    return () => {
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

  const lang = i18n.language || 'mn';
  const currentLang = languages.find(l => lang.startsWith(l.code)) || languages[0];
  const cycleLanguage = () => {
    const currentIndex = languages.findIndex(l => lang.startsWith(l.code));
    i18n.changeLanguage(languages[currentIndex !== -1 ? (currentIndex + 1) % languages.length : 0].code);
  };

  const signIn = async (after?: () => void) => {
    try {
      await signInWithGoogle();
      after?.();
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        toast.error(t('siteUi.nav.loginFailed'));
      }
    }
  };

  // The event title in the visitor's language, falling back the same way the event pages do
  const eventTitle = nextEvent && (
    lang.startsWith('mn') ? (nextEvent.titleMn || nextEvent.title)
      : lang.startsWith('de') ? (nextEvent.titleDe || nextEvent.title)
      : lang.startsWith('tr') ? (nextEvent.titleTr || nextEvent.titleEn || nextEvent.title)
      : (nextEvent.titleEn || nextEvent.title)
  );

  const linkClass = (isActive: boolean) => cn(
    'relative py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150',
    isActive ? 'text-brand-ink' : 'text-brand-ink-soft hover:text-brand-ink'
  );

  const DesktopLink = ({ item }: { item: { name: string; path: string }; key?: string }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link to={item.path} aria-current={isActive ? 'page' : undefined} className={linkClass(isActive)}>
        {item.name}
        {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-brand-blue" />}
      </Link>
    );
  };

  return (
    // The header lies over the page without taking space in it. Its strip scrolls away with the page
    // and the bar below it sticks to the top, so nothing has to resize or animate while scrolling.
    <header ref={menuRef} className="absolute inset-0 z-[100] pointer-events-none">
      {/* Top strip: the next event on the left, language and sign-in on the right */}
      <div className={cn(
        'relative z-[130] h-10 bg-brand-indigo text-brand-felt-soft text-[13px] pointer-events-auto',
        !nextEvent && 'hidden sm:block'
      )}>
        <div className="max-w-[1600px] w-full h-full mx-auto px-4 md:px-10 2xl:px-16 flex items-center justify-between gap-6">
          <div className="min-w-0">
            {nextEvent ? (
              <Link to={`/events/${nextEvent.id}`} className="group flex items-center gap-2 min-w-0 hover:text-brand-felt transition-colors duration-150">
                <Calendar size={16} strokeWidth={1.5} className="shrink-0" />
                <span className="shrink-0">{t('events.nextUpcoming')}</span>
                <span className="truncate text-brand-felt">{eventTitle}</span>
                <span className="shrink-0 tabular hidden md:inline">
                  {new Date(nextEvent.date).toLocaleDateString(t('common.locale'), { day: 'numeric', month: 'long' })}
                </span>
                <ArrowRight size={16} strokeWidth={1.5} className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <span>{t('siteUi.nav.bannerLabel')}</span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-5 shrink-0">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-label={t('siteUi.nav.selectLanguage')}
                aria-expanded={isLangOpen}
                className="flex items-center gap-2 py-1 hover:text-brand-felt"
              >
                <currentLang.Flag className="w-5 h-auto rounded-[2px]" aria-hidden="true" />
                <span>{currentLang.name}</span>
                <ChevronDown size={16} strokeWidth={1.5} className={cn('transition-transform duration-150', isLangOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute right-0 mt-2 w-44 p-1 bg-brand-cream text-brand-ink rounded-lg border border-brand-line shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50"
                  >
                    {languages.map((l) => {
                      const active = lang.startsWith(l.code);
                      return (
                        <button
                          key={l.code}
                          onClick={() => {
                            i18n.changeLanguage(l.code);
                            setIsLangOpen(false);
                          }}
                          aria-current={active ? 'true' : undefined}
                          className={cn(
                            'w-full h-9 flex items-center gap-2.5 px-2.5 rounded-md text-sm text-left',
                            active ? 'bg-brand-sand text-brand-ink' : 'text-brand-ink-soft hover:bg-brand-sand/60 hover:text-brand-ink'
                          )}
                        >
                          <l.Flag className="w-5 h-auto rounded-[2px]" aria-hidden="true" />
                          <span>{l.name}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span aria-hidden="true" className="h-4 w-px bg-brand-line-dark" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 hover:text-brand-felt transition-colors duration-150">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon size={16} strokeWidth={1.5} />
                  )}
                  <span className="truncate max-w-[120px]">{user.displayName || t('nav.member')}</span>
                </Link>
                <button onClick={() => logOut()} aria-label={t('siteUi.nav.logOut')} className="hover:text-brand-felt">
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                aria-label={t('siteUi.nav.memberPortalAria')}
                className="flex items-center gap-2 hover:text-brand-felt"
              >
                <LogIn size={16} strokeWidth={1.5} />
                <span>{t('siteUi.nav.memberPortal')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <nav
        className={cn(
          'sticky top-0 w-full px-4 md:px-10 2xl:px-16 py-3 bg-brand-cream pointer-events-auto',
          isOpen ? 'z-[155]' : 'z-[120]'
        )}
      >
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between relative xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-0">

          {/* Left links (desktop) */}
          <div className="hidden xl:flex items-center justify-end gap-8 pr-12">
            {navItems.filter(item => ['/about', '/events', '/membership', '/news'].includes(item.path)).map((item) => (
              <DesktopLink key={item.path} item={item} />
            ))}
          </div>

          {/* The logo already carries the organisation's name */}
          <Link to="/" aria-label={t('siteUi.nav.homeAria')} className="flex-shrink-0 z-10 absolute left-1/2 -translate-x-1/2 xl:static xl:left-auto xl:translate-x-0">
            <img
              src={mcaLogoWide}
              alt={t('siteUi.org.name')}
              className="h-11 sm:h-12 xl:h-14 w-auto object-contain select-none"
            />
          </Link>

          {/* Right links and the menu button (desktop) */}
          <div className="hidden xl:flex items-center gap-8 pl-12 min-w-0">
            {navItems.filter(item => ['/gallery', '/impact', '/contact', '/heritage'].includes(item.path)).map((item) => (
              <DesktopLink key={item.path} item={item} />
            ))}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('siteUi.nav.closeMenu') : t('siteUi.nav.openMenu')}
              aria-expanded={isOpen}
              className="ml-auto h-9 flex items-center gap-2 px-3.5 rounded-lg bg-brand-ink text-white text-sm font-medium hover:bg-brand-blue"
            >
              {isOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
              <span>{isOpen ? t('siteUi.nav.close') : t('siteUi.nav.menu')}</span>
            </button>
          </div>

          {/* Mobile: language, profile, menu */}
          <div className="xl:hidden flex items-center gap-2 z-10 ml-auto">
            <button
              onClick={cycleLanguage}
              aria-label={t('siteUi.nav.switchLanguage')}
              className="w-10 h-10 rounded-lg border border-brand-line bg-brand-cream flex items-center justify-center"
            >
              <currentLang.Flag className="w-5 h-auto rounded-[2px]" aria-hidden="true" />
            </button>

            {user && (
              <Link to="/profile" aria-label={t('siteUi.nav.viewProfile')} className="w-10 h-10 rounded-lg border border-brand-line bg-brand-cream flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} strokeWidth={1.5} className="text-brand-ink-soft" />
                )}
              </Link>
            )}

            <button
              className="w-10 h-10 rounded-lg bg-brand-ink text-white flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('siteUi.nav.closeMenu') : t('siteUi.nav.openMenu')}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>

        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="fixed inset-0 h-screen w-full bg-brand-paper z-[130] flex flex-col overflow-hidden"
            >
              {/* Header of the open menu */}
              <div className="w-full bg-brand-cream py-3 shrink-0 relative z-20">
                <div className="max-w-[1600px] w-full mx-auto px-4 md:px-10 2xl:px-16 flex items-center justify-between relative">
                  <img src={mcaLogoWide} alt={t('siteUi.org.name')} className="h-10 sm:h-12 w-auto object-contain" />

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={cycleLanguage}
                      className="w-10 h-10 rounded-lg border border-brand-line bg-brand-cream flex items-center justify-center"
                      aria-label={t('siteUi.nav.changeLanguage')}
                    >
                      <currentLang.Flag className="w-5 h-auto rounded-[2px]" aria-hidden="true" />
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label={t('siteUi.nav.closeMenu')}
                      className="h-10 flex items-center gap-2 px-3.5 rounded-lg bg-brand-ink text-white text-sm font-medium hover:bg-brand-blue"
                    >
                      <X size={16} strokeWidth={1.5} />
                      <span className="hidden min-[400px]:inline">{t('siteUi.nav.close')}</span>
                    </button>
                  </div>
                </div>
              </div>

              <AlkhanBorder className="shrink-0" />

              <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 2xl:px-16 flex flex-col justify-between pb-6 h-full min-h-0 relative z-10 pt-6 sm:pt-8">

                {/* Scrollable menu content */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-8 lg:gap-16 pb-6">

                  {/* Left column: links */}
                  <div className="flex flex-col justify-start lg:border-r border-brand-line lg:pr-12 text-left">
                    <span className="text-sm text-brand-ink-mute mb-2 block">
                      {t('footer.navTitle')}
                    </span>
                    <nav className="flex flex-col">
                      {navItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        const note = item.path === '/events' ? t('siteUi.nav.badgeUpcoming')
                          : item.path === '/membership' ? t('siteUi.nav.badgeJoin')
                          : item.path === '/impact' ? t('siteUi.nav.badgeGive')
                          : null;
                        return (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(idx, 6) * 0.04, ease: EASE }}
                          >
                            <Link
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              aria-current={isActive ? 'page' : undefined}
                              className="group flex items-center justify-between gap-4 w-full h-12 sm:h-14 border-b border-brand-line"
                            >
                              <span className="flex items-baseline gap-4 min-w-0">
                                <span className="w-6 shrink-0 text-sm tabular text-brand-ink-mute">{String(idx + 1).padStart(2, '0')}</span>
                                <span className={cn(
                                  'font-serif text-xl sm:text-2xl leading-none truncate transition-colors duration-150',
                                  isActive ? 'text-brand-blue' : 'text-brand-ink group-hover:text-brand-blue'
                                )}>
                                  {item.name}
                                </span>
                              </span>
                              <span className="flex items-center gap-3 shrink-0 text-sm text-brand-ink-mute">
                                {note && <span>{note}</span>}
                                <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Right column: the map, a short message and a hello */}
                  <div className="flex flex-col gap-6 lg:pl-4">
                    {/* A cloud sits right above the map */}
                    <div aria-hidden="true" className="relative h-14 -mb-4">
                      <CloudDrift variant="c" className="top-0 right-2 w-40 md:w-52 opacity-[0.75]" duration={26} />
                    </div>
                    <div className="w-full rounded-xl border border-brand-line bg-brand-cream px-6 py-5">
                      <BridgeMap viennaLabel={t('footer.vienna')} ulaanbaatarLabel={t('footer.ulaanbaatar')} />
                    </div>

                    <div className="flex items-end justify-between gap-6">
                      <div className="max-w-xl">
                        <h2 className="font-serif text-2xl sm:text-3xl text-brand-ink leading-tight mb-3">
                          {t('siteUi.nav.featuredTitle')}
                        </h2>
                        <p className="text-sm sm:text-base text-brand-ink-soft leading-relaxed">
                          {t('siteUi.nav.featuredDesc')}
                        </p>
                      </div>

                      <div className="hidden sm:flex items-end gap-2 shrink-0">
                        <span className="mb-24 rounded-xl rounded-br-sm bg-brand-cream border border-brand-line px-4 py-2 text-sm text-brand-ink">
                          {t('siteUi.nav.hello')}
                        </span>
                        <WavingBoy className="h-40 lg:h-48 w-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom bar: who it is for, social links, sign-in */}
                <div className="w-full pt-4 border-t border-brand-line flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 text-sm text-brand-ink-soft">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                    <Link to="/membership/apply-student" onClick={() => setIsOpen(false)} className="hover:text-brand-ink transition-colors duration-150">{t('siteUi.nav.forStudents')}</Link>
                    <Link to="/membership/apply-professional" onClick={() => setIsOpen(false)} className="hover:text-brand-ink transition-colors duration-150">{t('siteUi.nav.forCompanies')}</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-brand-ink transition-colors duration-150">{t('siteUi.nav.forInstitutions')}</Link>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5">
                    <div className="flex gap-4 items-center text-brand-ink-mute">
                      <a href="https://www.linkedin.com/company/mongolian-center-in-austria/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-brand-ink transition-colors duration-150">
                        <Linkedin size={18} strokeWidth={1.5} />
                      </a>
                      <a href="https://www.instagram.com/mncenteraustria/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-ink transition-colors duration-150">
                        <Instagram size={18} strokeWidth={1.5} />
                      </a>
                      <a href="https://www.facebook.com/profile.php?id=61568045031863" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand-ink transition-colors duration-150">
                        <Facebook size={18} strokeWidth={1.5} />
                      </a>
                    </div>

                    <span aria-hidden="true" className="h-4 w-px bg-brand-line hidden sm:block" />

                    {user ? (
                      <div className="flex items-center gap-3">
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="text-brand-ink hover:text-brand-blue transition-colors duration-150">
                          {user.displayName}
                        </Link>
                        <span aria-hidden="true" className="h-4 w-px bg-brand-line" />
                        <button onClick={() => { logOut(); setIsOpen(false); }} className="hover:text-brand-ink">
                          {t('nav.signOut')}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => signIn(() => setIsOpen(false))} className="flex items-center gap-2 text-brand-ink hover:text-brand-blue">
                        <LogIn size={16} strokeWidth={1.5} /> {t('siteUi.nav.memberAccess')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The painted border along the lower edge of the bar */}
        <AlkhanBorder className="absolute top-full left-0 right-0 pointer-events-none" />

        {/* Reading progress: a line, and a horse that crosses the page as you scroll */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5">
          <motion.div className="absolute inset-0 bg-brand-blue origin-left" style={{ scaleX }} />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 z-50 pointer-events-none text-brand-ink"
            style={{ left: horseX, x: '-100%' }}
          >
            <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="block">
              <path d="M258.962 29.14c-3.21.063-6.68 1.158-10.303 3.4c-5.798 3.584-11.47 10.14-14.872 18.715c-3.4 8.575-3.767 17.236-2.004 23.82c1.763 6.585 5.248 10.765 9.83 12.583s9.986 1.165 15.784-2.42c5.797-3.586 11.467-10.143 14.87-18.717c3.4-8.573 3.767-17.235 2.005-23.82c-1.763-6.584-5.25-10.764-9.832-12.58a14 14 0 0 0-5.478-.98zm83.428 36.012c-8.823 13.437-17.545 27.577-36.268 45.2l-1.615 1.52l-2.137.596c-9.165 2.554-19 3.7-28.863 4.48c-.54 5.822-1.76 11.47-3.492 16.946c14.814.187 28.827-.778 41.297-4.62c18.26-17.188 36.623-35.375 44.685-56.7zm-133.135 31.58q-.258-.001-.527.02c-1.248.117-2.846.825-5.022 2.126c-11.898 12.29-14.007 33.196-.867 57.082c5.73 10.42 18.094 18.277 33.66 23.58c13.165 4.485 28.138 7.013 41.808 8.51l3.71-13.443c-6.24-1.808-14.008-3.65-22.142-6.082c-11.813-3.53-24.576-8.437-34.355-18.432l-.343-.35l-.303-.388c-5.047-6.43-5.557-13.842-5.6-22.496c-.037-7.045.813-15.254 2.02-24.023c-3.345-2.203-6.258-4.21-8.39-5.088c-1.395-.575-2.445-1.008-3.65-1.018zm29.242 12.676c-.806 6.653-1.25 12.573-1.226 17.36c.035 6.717 1.526 10.814 1.69 11.21c1.988 1.936 4.304 3.67 6.87 5.24c4.536-8.52 8.03-16.96 9.363-25.23zm202.955 36.5c-38.698.407-97.748 25.527-127.31 46.75l21.93 26.664c23.08-25.157 50.67-42.282 78.29-49.248c28.02-7.068 56.45-3.25 78.33 13.597c1.784-1.8 2.504-3.56 2.694-5.432c.305-3.01-.998-7.446-4.865-12.283c-7.734-9.675-24.947-19.342-45.388-20.008q-1.805-.059-3.68-.04zm-259.16 8.734c-6.568 16.39-10.208 33.35-7.805 47.883c2.263 13.104 8.145 17.46 18.125 21.94c9.99 4.483 23.807 7.117 36.907 14.036l6.466 3.417l-2.022 7.03c-5.67 19.72-14.65 38.776-28.312 56.41c8.66 10.85 24.016 19.95 40.84 29.016l6.138-10.893l-17.434-29.078l4.14-4.914c10.787-12.804 16.836-38.882 20.882-55.754c-7.692-7.7-25.79-16.08-42.803-28.55l-6.36-4.66l3.784-6.917c.52-.952 1.076-1.906 1.62-2.86c-12.188-5.97-22.86-14.237-29.39-26.11a97 97 0 0 1-4.778-9.995zm260.135 29.922c-7.587-.093-15.517.908-23.664 2.963c-26.07 6.576-53.767 24.346-75.986 51.377l-6.952 8.457l-33.34-40.54c-1.77.288-3.426.55-5.21.842c9.908 16.11 16.95 31.17 25.693 40.888c5.715 6.352 11.743 10.584 20.38 12.742c8.025 2.006 18.66 2.104 33.263-1.126c-2.695-7.855-2.26-16.004-.318-23.077c2.52-9.172 7.08-17.28 10.78-24.534l16.035 8.184c-2.167 4.244-4.322 8.392-6.112 12.324c5.102-.272 13.1-.745 20.61-1.246c8.984-.6 14.34-.982 17.38-1.197c1.703-3.57 3.562-6.718 5.905-9.497c3.513-4.17 8.686-7.383 14.256-8.108a28.4 28.4 0 0 1 4.13-.234c6.8.114 13.423 2.692 21.293 6.686c1.867-6.108 3.71-12.142 5.54-18.045c-12.05-11.18-27.044-16.652-43.683-16.856zM277.92 210.86c-4.448.743-8.952 1.51-13.448 2.27c5.022 3.758 9.534 8.032 13.05 13.293l2.204 3.297l-.948 3.852c-3.357 13.658-7.853 41.85-21.802 62.15l16.474 27.48l-14.802 26.26c6.94-1.8 13.538-4.246 19.607-7.447l11-5.8l2.074 12.26c5.978 35.36-13.102 68.48-22.475 99.294c6.508 9.05 12.247 14.98 17.275 20.388c4.097 4.407 8.004 9.006 10.654 14.683h28.254c-1.863-9.857-5.227-15.497-17.834-26.75l-5.578-4.98l3.87-6.396c15.287-25.248 24.903-82.92 28.925-111.46l.92-6.526l6.503-1.092c10.253-1.72 16.833-5.857 22.162-11.826s9.233-14.076 12.258-23.29c1.334-4.067 2.448-8.31 3.478-12.62c-16.163 3.494-29.45 3.68-40.754.855c-12.36-3.088-21.957-9.893-29.4-18.164c-12.948-14.39-20.65-32.733-31.665-49.73zm-108.337 19.524c-14.047 2.79-27.408 5.57-39.43 8.29c-12.594 4.275-20.655 10.807-26.92 19.765c-6.32 9.03-10.644 20.798-14.083 34.75c-6.85 27.778-10.026 63.737-23.073 100.858l-17.465 65.434c3.948 3.74 7.722 6.273 11.717 9.855c3.488 3.13 6.69 7.757 8.58 13.504h23.447c.593-9.5-2.71-19.834-10.856-26.5l-5.18-4.235l26.142-62.953l5.35-.537c21.24-2.133 40.548-26.11 51.19-40.262l3.75-4.982l5.982 1.758c22.6 6.637 49.11 10.156 73.326 7.377c-21.107-11.086-43.545-22.54-55.405-43.017l-3.175-5.483l4.09-4.84c12.58-14.873 20.877-30.868 26.6-47.8c-8.712-3.39-18.953-6.002-28.93-10.48c-5.508-2.472-10.967-5.897-15.657-10.5zm288.38.46a3 3 0 0 0-.493.02c-1.118.146-1.406.185-2.817 1.858c-1.352 1.604-3.214 4.944-5.216 9.785c-1.614 5.982-.063 10.297 4.242 15.903c2.565 3.34 6.158 6.746 10.16 10.117c4.106-10.06 7.79-20.716 11.25-31.467c-9.026-4.414-14.86-6.17-17.128-6.217zm-340.25 13.26c-.02 0-.32.076-.358.08c.37.02.43-.086.36-.08zm313.353 4.83c-4.126.288-5.917.422-12.262.845c-10.82.72-21.303 1.44-26.12 1.497c.313 2.1 1.08 4.127 2.41 6.265l.532.854l.33.95c.627 1.807 1.2 3.502 1.744 5.15c2.49 4.435 9.938 11.22 20.264 16.535c10.333 5.317 23.014 9.548 34.29 11.682a162 162 0 0 0 3.876-7.19c-5.863-4.615-11.877-9.832-16.727-16.148c-4.34-5.652-7.67-12.72-8.337-20.44m-347.57 7.306c-5.687 2.507-11.285 5.163-16.114 7.74c-6.134 3.273-10.633 6.54-12.37 8.03c-4.556 15.79-6.52 30.088-11.78 44.884c-4.72 13.276-12.487 26.58-26.66 40.11c11.624 10 23.234 16.21 37.47 15.316c8.202-29.22 11.38-58.08 17.63-83.44c2.888-11.71 6.472-22.743 11.825-32.64zm320.41 37.61c.224 5.742-.135 11.87-.944 19.608c-.05 6.863 3.644 11.33 9.248 12.71c5.623 1.388 14.58-.295 24.822-12.622l.204-.244l.22-.23a82 82 0 0 0 3.836-4.324c-10.776-2.654-21.76-6.668-31.562-11.71a138 138 0 0 1-5.825-3.19zm-27.463 33.017c-6.36 6.718-14.816 11.936-25.082 14.857c-.01.077-.026.17-.037.248l15.336 17.203l-8.665 25.655l-14.53 3.216c-1.706 8.07-3.678 16.264-5.95 24.278c.423.08.85.17 1.27.246c10.442 1.892 19.172 1.915 26.915-1.684c17.515-18.86 28.118-31.565 31.95-53.44c-1.87-7.903-10.127-20.008-19.666-29.138c-.512-.49-1.026-.967-1.54-1.44zm-210.993 42.66c-5.333 6.792-12.013 14.51-20.16 21.164c16.307 31.444 34.568 62.892 57.48 92.173h26.753c-28.96-35.58-47.84-75.123-64.073-113.336z" />
            </svg>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
