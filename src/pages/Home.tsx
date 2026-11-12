import { motion } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Award, Users, Handshake, Clock, MapPin, ChevronLeft, ChevronRight, Heart, Landmark, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db, collection, onSnapshot, query, orderBy, limit, handleFirestoreError, OperationType } from '../firebase';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euActiveLogo from '../assets/media/euactivelogo.png';
import amoxLogo from '../assets/media/amoxlogo.png';
import delgerLogo from '../assets/media/delgerlogo.png';

import HeroVideo from '../components/HeroVideo';
import BridgeMap, { BRIDGE_DISTANCE_KM } from '../components/BridgeMap';
import ScriptPlaque from '../components/ScriptPlaque';
import GameBanner from '../components/GameBanner';

const EASE = [0.22, 1, 0.36, 1] as const;

const container = 'max-w-7xl mx-auto px-6 lg:px-8';
const button = 'inline-flex items-center justify-center gap-2 rounded-lg text-[15px] font-medium whitespace-nowrap';
const textLink = 'group inline-flex items-center gap-2 text-[15px] font-medium text-brand-ink hover:text-brand-blue transition-colors duration-150';
const card = 'group flex flex-col h-full w-full overflow-hidden rounded-xl border border-brand-line bg-brand-cream transition-colors duration-150 hover:border-brand-ink/25';

const partners: Array<{ name: string; src: string; url: string }> = [
  { name: 'Embassy of Mongolia in Vienna', src: '/embassy logo.png', url: 'https://vienna.embassy.mn/' },
  { name: 'Deutschothek Sprachschule', src: deutschotekLogo, url: 'https://deutschothek.com/' },
  { name: 'Verein für aktiv Leben und Bildung', src: euActiveLogo, url: 'https://www.euactive.org/' },
  { name: 'Verein der mongolischen StudentInnen in Österreich', src: amoxLogo, url: 'https://www.facebook.com/MongolianStudentAssociationInAustria' },
  { name: 'Gmax Mongolischer Kinder-und Jugendverein', src: '/gmax logo.jpg', url: 'https://www.facebook.com/gmax.gmax.9406' },
  { name: 'Delger Mongolian Placement', src: delgerLogo, url: 'https://www.delger-placement.at/' },
  { name: 'ISCA – International Sport and Culture Association', src: '/media/isca-logo.svg', url: 'https://www.isca.org/' },
];

const Arrow = () => (
  <ArrowRight size={16} strokeWidth={1.5} className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
);

/** A section's label, title and, on the right, its one link or control. */
function SectionHead({ label, title, children, dark = false }: { label?: string; title: React.ReactNode; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-x-8 gap-y-4 mb-10">
      <div className="max-w-3xl">
        {label && <p className={`text-sm mb-2 ${dark ? 'text-brand-felt-soft' : 'text-brand-ink-mute'}`}>{label}</p>}
        <h2 className={`font-serif text-3xl md:text-4xl leading-[1.15] text-balance ${dark ? 'text-brand-felt' : 'text-brand-ink'}`}>{title}</h2>
      </div>
      {children && <div className="flex items-center gap-4 shrink-0">{children}</div>}
    </div>
  );
}

/** Previous and next for a row that scrolls sideways. */
function ScrollButtons({ target, labels }: { target: React.RefObject<HTMLDivElement | null>; labels: [string, string] }) {
  const by = (dx: number) => target.current?.scrollBy({ left: dx, behavior: 'smooth' });
  const cls = 'w-10 h-10 rounded-lg border border-brand-line flex items-center justify-center text-brand-ink-soft hover:text-brand-ink hover:bg-brand-cream';
  return (
    <div className="hidden sm:flex gap-2">
      <button type="button" onClick={() => by(-400)} aria-label={labels[0]} className={cls}>
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button type="button" onClick={() => by(400)} aria-label={labels[1]} className={cls}>
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [showingPastEvents, setShowingPastEvents] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const newsScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const locale = t('common.locale');
  const lang = i18n.language || 'mn';
  // A field in the visitor's language, with the same fallbacks the detail pages use
  const pick = (item: any, field: string): string => {
    if (lang.startsWith('mn')) return item[`${field}Mn`] || item[field];
    if (lang.startsWith('de')) return item[`${field}De`] || item[field];
    if (lang.startsWith('tr')) return item[`${field}Tr`] || item[`${field}En`] || item[field];
    return item[`${field}En`] || item[field];
  };
  const price = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  const scrollLabels: [string, string] = [t('siteUi.home.scrollPrev'), t('siteUi.home.scrollNext')];

  const membershipTypes = [
    { icon: Award, title: t('homeMembership.slides.professional.title'), note: t('homeMembership.slides.professional.benefit1'), path: '/membership/apply-professional' },
    { icon: Users, title: t('homeMembership.slides.student.title'), note: t('homeMembership.slides.student.benefit1'), path: '/membership/apply-student' },
    { icon: Handshake, title: t('homeMembership.slides.institutional.title'), note: t('homeMembership.slides.institutional.benefit1'), path: '/membership/apply-institutional' },
  ];

  const pillars = [
    { title: t('pillars.community.title'), desc: t('pillars.community.desc'), link: '/events' },
    { title: t('pillars.arts.title'), desc: t('pillars.arts.desc'), link: '/gallery' },
    { title: t('pillars.impact.title'), desc: t('pillars.impact.desc'), link: '/impact' },
  ];

  const stats = [
    { label: t('siteUi.home.stats.yearLabel'), value: '2026', desc: t('siteUi.home.stats.yearDesc') },
    { label: t('siteUi.home.stats.membersLabel'), value: '100+', desc: t('siteUi.home.stats.membersDesc') },
    { label: t('siteUi.home.stats.partnersLabel'), value: '5+', desc: t('siteUi.home.stats.partnersDesc') },
    { label: t('siteUi.home.stats.projectsLabel'), value: '4+', desc: t('siteUi.home.stats.projectsDesc') },
  ];

  const audiences = [
    { key: 'institutions', icon: Landmark, to: '/contact' },
    { key: 'businesses', icon: Briefcase, to: '/membership' },
    { key: 'individuals', icon: Users, to: '/membership' },
  ];

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
      setNews(snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
      setNews([]);
    });

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(12));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
      setGallery([]);
    });

    return () => { unsubscribe(); unsubNews(); unsubGallery(); };
  }, []);

  return (
    <div>

      {/* Hero: steppe footage, the name of the centre, and its name board in Mongol bichig */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-indigo pt-32 xl:pt-[8.75rem]">
        <div className="absolute inset-0 -z-10">
          <HeroVideo />
          {/* A step of the same dark tone behind the text, so it stays readable over any frame */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo/90 via-brand-indigo/60 to-brand-indigo/15" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`${container} w-full py-12 lg:py-16 grid grid-cols-[minmax(0,1fr)_auto] items-start lg:items-center gap-x-5 md:gap-x-12 lg:gap-x-20`}
        >
          <div className="min-w-0">
            <p className="text-[15px] text-brand-felt-soft mb-4 md:mb-5">{t('hero.tag')}</p>
            <h1
              lang={lang}
              // German compounds are longer than a phone is wide, so only German may break inside a word
              className={`max-w-3xl font-serif text-white text-[2rem] leading-[1.1] sm:text-5xl sm:leading-[1.06] lg:text-6xl xl:text-[4.25rem] tracking-[-0.02em] text-balance break-words ${lang.startsWith('de') ? 'hyphens-auto' : ''}`}
            >
              {t('hero.title')} {t('hero.titleItalic')}
            </h1>
            <p className="mt-5 md:mt-6 max-w-xl text-base md:text-lg leading-relaxed text-brand-felt/85">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/events" className={`${button} group h-12 px-5 bg-brand-felt text-brand-ink hover:bg-white`}>
                {t('hero.ctaEvents')} <Arrow />
              </Link>
              <Link to="/membership" className={`${button} h-12 px-5 border border-white/35 text-white hover:bg-white/10`}>
                {t('homeMembership.btnApply')}
              </Link>
            </div>
          </div>

          <ScriptPlaque />
        </motion.div>
      </section>

      {/* Bridge: Ulaanbaatar to Vienna */}
      <section className="py-20 md:py-28">
        <div className={`${container} grid lg:grid-cols-12 gap-12 lg:gap-16 items-center`}>
          <div className="lg:col-span-5">
            <p className="text-sm text-brand-ink-mute mb-2">{t('siteUi.home.bridge.tag')}</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.12] text-brand-ink text-balance mb-5">
              {t('siteUi.home.bridge.titleNormal')}{t('siteUi.home.bridge.titleItalic')}
            </h2>
            <p className="text-lg text-brand-ink-soft leading-relaxed mb-8">
              {t('siteUi.home.bridge.desc')}
            </p>
            <div className="flex items-baseline gap-3 border-t border-brand-line pt-6">
              <span className="font-serif text-4xl text-brand-ink tabular">{'≈ ' + BRIDGE_DISTANCE_KM.toLocaleString(locale)}</span>
              <span className="text-sm text-brand-ink-mute">{t('siteUi.home.bridge.km')}</span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <BridgeMap viennaLabel={t('footer.vienna')} ulaanbaatarLabel={t('footer.ulaanbaatar')} />
          </div>
        </div>
      </section>

      {/* Steppe Runner */}
      <GameBanner />

      {/* Partners */}
      <section className="mt-6 md:mt-14 py-12 md:py-16 bg-white border-y border-brand-line">
        <div className={container}>
          <h2 className="font-sans text-sm text-brand-ink-mute tracking-normal mb-8">{t('siteUi.home.partnersTitle')}</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-x-6 gap-y-10">
            {partners.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-start gap-3 text-brand-ink-soft hover:text-brand-ink transition-colors duration-150"
                >
                  <img src={partner.src} alt="" loading="lazy" className="h-14 w-auto max-w-full object-contain" />
                  <span className="text-[13px] leading-snug">{partner.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Membership */}
      <section className="py-20 md:py-28">
        <div className={container}>
          <SectionHead label={t('homeMembership.tag')} title={<>{t('homeMembership.titleNormal')}{t('homeMembership.titleItalic')}</>}>
            <Link to="/membership" className={`${button} group h-11 px-5 bg-brand-blue text-white hover:bg-brand-blue-deep`}>
              {t('homeMembership.btnExplore')} <Arrow />
            </Link>
          </SectionHead>
          <p className="-mt-4 mb-10 max-w-2xl text-lg text-brand-ink-soft leading-relaxed">
            {t('homeMembership.desc')}
          </p>

          <ul className="grid md:grid-cols-3 gap-4">
            {membershipTypes.map(({ icon: Icon, title, note, path }) => (
              <li key={path}>
                <Link to={path} className="group flex items-center gap-4 h-20 px-5 rounded-xl border border-brand-line bg-brand-cream transition-colors duration-150 hover:border-brand-ink/25">
                  <Icon size={18} strokeWidth={1.5} className="shrink-0 text-brand-ink-mute" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-brand-ink truncate">{title}</span>
                    <span className="block text-sm text-brand-ink-mute truncate">{note}</span>
                  </span>
                  <span className="text-brand-ink-mute group-hover:text-brand-ink transition-colors duration-150"><Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="py-20 md:py-28 border-t border-brand-line">
          <div className={container}>
            <SectionHead title={t('news.featuredNews')}>
              <Link to="/news" className={textLink}>{t('news.allNews')} <Arrow /></Link>
              <ScrollButtons target={newsScrollRef} labels={scrollLabels} />
            </SectionHead>

            <div ref={newsScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6 lg:-mx-8 lg:px-8 scroll-px-6 lg:scroll-px-8 snap-x">
              {news.map((item) => {
                const title = pick(item, 'title');
                const date: Date | null = item.createdAt?.toDate?.() ?? null;
                return (
                  <div key={item.id} className="w-[85vw] sm:w-[352px] shrink-0 flex snap-start">
                    <Link to={`/news/${item.slug || item.id}`} className={card}>
                      <div className="relative shrink-0 aspect-[16/10] overflow-hidden bg-brand-sand">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        {date && !isNaN(date.getTime()) && (
                          <time dateTime={date.toISOString()} className="text-[13px] text-brand-ink-mute tabular mb-2">
                            {date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                          </time>
                        )}
                        <h3 className="font-serif text-xl leading-snug text-brand-ink line-clamp-2 mb-3">{title}</h3>
                        <p className="text-[15px] text-brand-ink-soft leading-relaxed line-clamp-3 mb-6">{item.excerpt || pick(item, 'content')}</p>
                        <span className="mt-auto inline-flex items-center gap-2 text-[15px] font-medium text-brand-ink group-hover:text-brand-blue transition-colors duration-150">
                          {t('news.readStory')} <Arrow />
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-28 border-t border-brand-line">
          <div className={container}>
            <SectionHead title={t('gallery.featuredGallery')}>
              <Link to="/gallery" className={textLink}>{t('gallery.allGallery')} <Arrow /></Link>
              <ScrollButtons target={galleryScrollRef} labels={scrollLabels} />
            </SectionHead>

            <div ref={galleryScrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6 lg:-mx-8 lg:px-8 scroll-px-6 lg:scroll-px-8 snap-x">
              {gallery.map((item) => {
                const title = pick(item, 'title');
                return (
                  <Link key={item.id} to={`/gallery/${item.id}`} className="group w-[85vw] sm:w-[352px] shrink-0 snap-start">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-sand">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="flex items-baseline justify-between gap-4 mt-4">
                      <h3 className="font-serif text-xl leading-snug text-brand-ink line-clamp-2 group-hover:text-brand-blue transition-colors duration-150">{title}</h3>
                      <span className="shrink-0 inline-flex items-center gap-2 text-sm text-brand-ink-mute">{t('gallery.viewCapture')} <Arrow /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {(loading || events.length > 0) && (
        <section className="py-20 md:py-28 border-t border-brand-line">
          <div className={container}>
            <SectionHead title={showingPastEvents ? t('siteUi.home.pastEvents') : t('siteUi.home.upcomingEvents')}>
              <Link to="/events" className={textLink}>{t('highlight.cta')} <Arrow /></Link>
            </SectionHead>

            {loading ? (
              <div className="min-h-[420px]" />
            ) : (
              <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x">
                {events.map((event) => {
                  const title = pick(event, 'title');
                  const day = new Date(event.date);
                  return (
                    <div key={event.id} className="w-[85vw] md:w-auto shrink-0 flex snap-start">
                      <Link to={`/events/${event.id}`} className={card}>
                        <div className="relative shrink-0 aspect-[16/10] overflow-hidden bg-brand-sand">
                          {event.imageUrl && (
                            <img src={event.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                          )}
                          <time dateTime={event.date} className="absolute top-4 left-4 w-14 py-2 rounded-lg bg-brand-cream text-brand-ink flex flex-col items-center leading-none">
                            <span className="text-xs text-brand-ink-mute">{day.toLocaleDateString(locale, { month: 'short' })}</span>
                            <span className="mt-1 font-serif text-xl tabular">{day.getDate()}</span>
                          </time>
                        </div>
                        <div className="flex flex-col flex-1 p-6">
                          <p className="text-[13px] text-brand-ink-mute mb-2">{pick(event, 'category') || t('events.defaultCategory')}</p>
                          <h3 className="font-serif text-xl leading-snug text-brand-ink line-clamp-2 mb-3">{title}</h3>
                          <p className="text-[15px] text-brand-ink-soft leading-relaxed line-clamp-2 mb-5">{pick(event, 'description')}</p>
                          <ul className="flex flex-col gap-2 text-sm text-brand-ink-soft mb-6">
                            <li className="flex items-center gap-2 tabular">
                              <Clock size={16} strokeWidth={1.5} className="shrink-0 text-brand-ink-mute" /> {event.time || t('events.tba')}
                            </li>
                            <li className="flex items-center gap-2 min-w-0">
                              <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-brand-ink-mute" /> <span className="truncate">{pick(event, 'location') || t('events.vienna')}</span>
                            </li>
                          </ul>
                          <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-brand-line">
                            <span className="inline-flex items-center gap-2 text-[15px] font-medium text-brand-ink group-hover:text-brand-blue transition-colors duration-150">
                              {t('events.viewDetails')} <Arrow />
                            </span>
                            <span className="text-[15px] text-brand-ink tabular">
                              {event.price === 0 ? t('membershipPage.tiers.free') : price.format(event.price / 100)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* The three pillars, and the centre in figures */}
      <section className="py-20 md:py-28 border-t border-brand-line">
        <div className={container}>
          <SectionHead title={<>{t('siteUi.home.foundation.titleNormal')}{t('siteUi.home.foundation.titleItalic')}</>} />

          <ol className="grid md:grid-cols-3 border-t border-brand-line md:divide-x divide-brand-line">
            {pillars.map((pillar, idx) => (
              <li key={pillar.link} className="border-b border-brand-line md:px-8 md:first:pl-0 md:last:pr-0">
                <Link to={pillar.link} className="group flex flex-col h-full py-8">
                  <span className="text-sm text-brand-ink-mute tabular mb-6">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="font-serif text-2xl leading-snug text-brand-ink mb-3">{pillar.title}</h3>
                  <p className="text-[15px] text-brand-ink-soft leading-relaxed mb-8">{pillar.desc}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[15px] font-medium text-brand-ink group-hover:text-brand-blue transition-colors duration-150">
                    {t('siteUi.home.foundation.learnMore')} <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-3 text-[15px] font-medium text-brand-ink">{stat.label}</dt>
                <dd className="order-1 font-serif text-5xl leading-none text-brand-ink tabular">{stat.value}</dd>
                <dd className="order-3 mt-1 text-sm text-brand-ink-mute leading-relaxed max-w-[15rem]">{stat.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Support the work */}
      <section className="pb-20 md:pb-28">
        <div className={container}>
          <div className="grid lg:grid-cols-5 overflow-hidden rounded-2xl bg-brand-indigo">
            <div className="lg:col-span-3 p-8 md:p-14 lg:p-16">
              <p className="text-sm text-brand-felt-soft mb-2">{t('nav.impact')}</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.12] text-brand-felt text-balance mb-5">
                {t('impactCta.title')}
              </h2>
              <p className="max-w-xl text-lg text-brand-felt-soft leading-relaxed">
                {t('impactCta.desc')}
              </p>

              <dl className="flex items-center gap-5 my-10 py-6 border-y border-brand-line-dark">
                <dd className="font-serif text-5xl leading-none text-brand-felt tabular">500+</dd>
                <div>
                  <dt className="text-[15px] font-medium text-brand-felt">{t('siteUi.home.reach.label')}</dt>
                  <dd className="mt-1 max-w-md text-sm text-brand-felt-soft leading-relaxed">{t('siteUi.home.reach.text')}</dd>
                </div>
              </dl>

              <Link to="/impact" className={`${button} h-12 px-5 bg-brand-felt text-brand-ink hover:bg-white`}>
                <Heart size={16} strokeWidth={1.5} /> {t('impactCta.cta')}
              </Link>
            </div>

            <div className="lg:col-span-2 relative min-h-[280px]">
              <img
                src="/media/heritage-stage.jpg"
                alt={t('heritagePage.showcase.stage.title')}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-[46%_50%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership invitation */}
      <section className="bg-brand-indigo py-20 md:py-28">
        <div className={container}>
          <SectionHead dark label={t('collab.tag')} title={<>{t('collab.titleNormal')}{t('collab.titleItalic')}</>} />
          <p className="-mt-4 mb-12 max-w-2xl text-lg text-brand-felt-soft leading-relaxed">{t('collab.desc')}</p>

          <ul className="grid md:grid-cols-3 border-t border-brand-line-dark md:divide-x divide-brand-line-dark">
            {audiences.map(({ key, icon: Icon, to }) => (
              <li key={key} className="border-b border-brand-line-dark md:px-8 md:first:pl-0 md:last:pr-0">
                <Link to={to} className="group flex flex-col h-full py-8">
                  <Icon size={18} strokeWidth={1.5} className="text-brand-felt-soft mb-6" />
                  <h3 className="font-serif text-2xl leading-snug text-brand-felt mb-3">{t(`collab.${key}.title`)}</h3>
                  <p className="text-[15px] text-brand-felt-soft leading-relaxed mb-8">{t(`collab.${key}.text`)}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[15px] font-medium text-brand-sky">
                    {t('collab.learnMore')} <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link to="/contact" className={`${button} group h-12 px-5 bg-brand-felt text-brand-ink hover:bg-white`}>
              {t('collab.ctaPartner')} <Arrow />
            </Link>
            <Link to="/membership" className={`${button} h-12 px-5 border border-white/35 text-white hover:bg-white/10`}>
              {t('collab.ctaMember')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
