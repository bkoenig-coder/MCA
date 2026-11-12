import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlkhanBorder } from './MongolianDesign';
import mcaLogoWide from '../assets/media/mca-logo-wide.png';

const socialLinks = [
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/mncenteraustria/' },
  { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61568045031863' },
  { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/company/mongolian-center-in-austria/' },
];

const linkClass = 'text-brand-ink-soft hover:text-brand-ink transition-colors duration-150';

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/events', label: t('nav.events') },
    { to: '/news', label: t('nav.news') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/impact', label: t('nav.impact') },
    { to: '/partners', label: t('partnersPage.navLabel') },
    { to: '/careers', label: t('nav.careers') },
    { to: '/game', label: t('heritagePage.game.title') },
    { to: '/diorama', label: t('siteUi.home.tour') },
  ];

  const legalLinks = [
    { to: '/privacy', label: t('footer.privacy') },
    { to: '/terms', label: t('footer.terms') },
    { to: '/imprint', label: t('footer.imprint') },
    { to: '/governance', label: t('footer.governance') },
  ];

  return (
    <footer className="bg-brand-sand">
      {/* The lower edge of the page carries the same painted border as the top */}
      <AlkhanBorder />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Who we are */}
          <div className="lg:col-span-5">
            <Link to="/" aria-label={t('nav.home')} className="inline-block mb-6">
              <img src={mcaLogoWide} alt={t('siteUi.org.name')} className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-[15px] text-brand-ink-soft leading-relaxed max-w-sm mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-brand-line flex items-center justify-center text-brand-ink-soft hover:text-brand-ink hover:bg-brand-cream transition-colors duration-150"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-[1fr_1fr_minmax(0,1.5fr)] gap-x-8 gap-y-12 text-[15px]">
            <div>
              <h2 className="font-sans text-sm text-brand-ink-mute mb-4 tracking-normal">{t('footer.navTitle')}</h2>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.to}><Link to={l.to} className={linkClass}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-sm text-brand-ink-mute mb-4 tracking-normal">{t('footer.legalTitle')}</h2>
              <ul className="space-y-3">
                {legalLinks.map((l) => (
                  <li key={l.to}><Link to={l.to} className={linkClass}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-sans text-sm text-brand-ink-mute mb-4 tracking-normal">{t('nav.contact')}</h2>
              <ul className="space-y-3 text-brand-ink-soft">
                <li className="flex items-start gap-2.5">
                  <MapPin size={18} strokeWidth={1.5} className="text-brand-ink-mute mt-0.5 shrink-0" />
                  <address className="not-italic leading-relaxed">
                    Schöpfleuthergasse 25<br />1210 {t('contact.info.vienna')}
                  </address>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={18} strokeWidth={1.5} className="text-brand-ink-mute shrink-0" />
                  <a href="tel:+4367761160389" className={`${linkClass} tabular`}>+43 677 61160389</a>
                </li>
                <li className="flex items-center gap-2.5 min-w-0">
                  <Mail size={18} strokeWidth={1.5} className="text-brand-ink-mute shrink-0" />
                  <a href="mailto:info@mongoliancenter.org" className={`${linkClass} break-all`}>info@mongoliancenter.org</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-brand-line flex flex-col md:flex-row md:items-start justify-between gap-6 text-[13px] text-brand-ink-mute">
          <p className="shrink-0">{t('footer.copyright')}</p>
          <p className="max-w-xl leading-relaxed">{t('siteUi.footer.legalNote')}</p>
          <div className="flex items-center gap-4 shrink-0">
            <span>{t('footer.vienna')} · {t('footer.ulaanbaatar')}</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label={t('siteUi.footer.backToTop')}
              title={t('siteUi.footer.backToTop')}
              className="w-10 h-10 rounded-lg border border-brand-line flex items-center justify-center text-brand-ink-soft hover:text-brand-ink hover:bg-brand-cream"
            >
              <ArrowUp size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
