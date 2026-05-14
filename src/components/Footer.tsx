import { Globe, Mail, MapPin, Phone, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'motion/react';
import { UlziiSymbol } from './MongolianDesign';
import mcaLogo from '../assets/media/mcalogo-1.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/mncenteraustria/' },
    { icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61568045031863' },
    { icon: Linkedin, url: 'https://www.linkedin.com/company/mongolian-center-in-austria/' }
  ];

  return (
    <footer className="bg-brand-paper border-t border-brand-ink/5 pt-24 md:pt-32 pb-8 px-6 mt-24 relative overflow-hidden">

      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col">
        {/* Giant Monogram / Title - Moved to top */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center mb-16 md:mb-24"
        >
          <div className="w-full overflow-hidden flex justify-center text-center select-none pointer-events-none">
             <h1 className="text-[14vw] sm:text-[8.5vw] md:text-[7.5vw] lg:text-[7vw] xl:text-[90px] leading-none font-[Arial] font-black italic tracking-tighter text-brand-ink/5 uppercase">
                MONGOLIAN<br className="md:hidden" /> <span className="hidden md:inline"> </span>CENTER
             </h1>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16 md:mb-20"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-5 flex flex-col">
            <Link to="/" className="flex items-center gap-4 mb-8 group inline-flex w-max">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1 border border-brand-ink/5 shadow-sm transition-transform duration-500 group-hover:scale-105">
                <img src={mcaLogo} alt="MCA Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-2xl md:text-3xl font-light tracking-tight text-brand-ink uppercase flex flex-col md:flex-row md:gap-2 leading-none">
                {t('nav.mongolian')} <span className="italic text-brand-gold">{t('nav.center')}</span>
              </span>
            </Link>
            <p className="text-sm md:text-base text-brand-ink/70 font-light leading-relaxed max-w-sm mb-10">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, url }, idx) => (
                <a 
                  key={idx}
                  href={url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:border-brand-gold hover:text-brand-gold hover:bg-white transition-all duration-300 shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Group */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6 grid grid-cols-3 gap-3 md:gap-8 overflow-hidden">
            {/* Links: Navigate */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-8 break-words">{t('footer.navTitle', 'Navigation')}</h4>
              <ul className="space-y-4 text-xs md:text-sm text-brand-ink/60 font-light flex flex-col">
                <li><Link to="/about" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('nav.about')}</Link></li>
                <li><Link to="/events" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('nav.events')}</Link></li>
                <li><Link to="/gallery" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('nav.gallery')}</Link></li>
                <li><Link to="/impact" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('nav.impact')}</Link></li>
                <li><Link to="/news" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('nav.news')}</Link></li>
              </ul>
            </motion.div>

            {/* Links: Legal */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-8 break-words">{t('footer.legalTitle')}</h4>
              <ul className="space-y-4 text-xs md:text-sm text-brand-ink/60 font-light flex flex-col">
                <li><Link to="/privacy" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block text-balance">{t('footer.privacy')}</Link></li>
                <li><Link to="/terms" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block text-balance">{t('footer.terms')}</Link></li>
                <li><Link to="/imprint" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block">{t('footer.imprint')}</Link></li>
                <li><Link to="/governance" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-300 inline-block text-balance">{t('footer.governance')}</Link></li>
              </ul>
            </motion.div>

            {/* Links: Contact */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <h4 className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-brand-gold mb-6 md:mb-8 break-words">{t('nav.contact')}</h4>
              <ul className="space-y-5 text-[10px] md:text-sm text-brand-ink/60 font-light flex flex-col">
                <li className="flex items-start gap-2 sm:gap-4">
                  <MapPin className="text-brand-gold mt-0.5 shrink-0 w-3 h-3 sm:w-[18px] sm:h-[18px]" />
                  <span className="leading-tight sm:leading-relaxed break-words">Vienna, Austria</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-4 break-all">
                  <Phone className="text-brand-gold shrink-0 w-3 h-3 sm:w-[18px] sm:h-[18px]" />
                  <span>+4367761160389</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-4 break-all">
                  <Mail className="text-brand-gold shrink-0 w-3 h-3 sm:w-[18px] sm:h-[18px]" />
                  <a href="mailto:info@mongoliancenter.org" className="hover:text-brand-gold transition-colors break-words">info@mongoliancenter.org</a>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Footer Bottom Setup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full border-t border-brand-ink/10 pt-8 mt-auto flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-ink/40 flex items-center gap-3">
             {t('footer.copyright')}
             <Link to="/diorama" className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold/30 hover:bg-brand-gold transition-colors" title="Discover the Steppe" />
          </div>
          
          <div className="flex gap-8 md:gap-12 text-[9px] uppercase font-bold tracking-[0.3em] text-brand-ink/40">
            <span className="flex items-center gap-2 italic">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              {t('footer.vienna')}
            </span>
            <span className="flex items-center gap-2 italic">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              {t('footer.ulaanbaatar')}
            </span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
