import { Globe, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol } from './MongolianDesign';
import mcaLogo from '../assets/media/mcalogo-1.png';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-paper border-t border-brand-ink/5 pt-24 md:pt-32 pb-12 px-6 mt-24 md:mt-40 relative overflow-hidden">
      <div className="absolute top-0 left-0 opacity-[0.02] -translate-x-1/4 -translate-y-1/4">
        <UlziiSymbol className="w-[300px] md:w-[400px] h-[300px] md:h-[400px] text-brand-gold" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-20 mb-16 md:mb-24">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl overflow-hidden p-1">
                <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-2xl md:text-3xl font-light tracking-tight text-brand-ink uppercase">
                {t('nav.mongolian')} <span className="italic text-brand-gold">{t('nav.center')}</span>
              </span>
            </Link>
            <p className="text-sm md:text-base text-brand-ink/80 font-normal leading-relaxed max-w-md mb-8 md:mb-12">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4 md:gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/40 hover:border-brand-gold hover:text-brand-gold hover:bg-white transition-all duration-500 shadow-sm"
                >
                  <Icon size={18} className="md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-10">{t('footer.navTitle')}</h4>
            <ul className="space-y-4 md:space-y-6 text-sm text-brand-ink/60 font-light">
              <li><Link to="/about" className="hover:text-brand-gold transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/events" className="hover:text-brand-gold transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-gold transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link to="/impact" className="hover:text-brand-gold transition-colors">{t('nav.impact')}</Link></li>
              <li><Link to="/news" className="hover:text-brand-gold transition-colors">{t('nav.news')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-10">{t('footer.legalTitle')}</h4>
            <ul className="space-y-4 md:space-y-6 text-sm text-brand-ink/60 font-light">
              <li><Link to="/privacy" className="hover:text-brand-gold transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-brand-gold transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/imprint" className="hover:text-brand-gold transition-colors">{t('footer.imprint')}</Link></li>
              <li><Link to="/governance" className="hover:text-brand-gold transition-colors">{t('footer.governance')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-10">{t('nav.contact')}</h4>
            <ul className="space-y-6 md:space-y-8 text-sm text-brand-ink/60 font-light">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-brand-gold shrink-0" />
                <span className="leading-relaxed">Vienna, Austria</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <span>+4367761160389</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>info@mongoliancenter.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-brand-ink/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-brand-ink/30 text-center md:text-left">
          <p>
            {t('footer.copyright')}
            <Link to="/diorama" className="inline-block w-1 h-1 rounded-full bg-brand-gold/20 hover:bg-brand-gold ml-2 transition-colors" title="Discover the Steppe" />
          </p>
          <div className="flex gap-8 md:gap-12">
            <span className="flex items-center gap-2 italic">
              <div className="w-1 h-1 bg-brand-gold rounded-full" />
              {t('footer.vienna')}
            </span>
            <span className="flex items-center gap-2 italic">
              <div className="w-1 h-1 bg-brand-gold rounded-full" />
              {t('footer.ulaanbaatar')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
