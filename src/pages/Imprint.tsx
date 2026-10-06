import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Globe, Info } from 'lucide-react';


import { EyebrowMark } from '../components/MongolianDesign';
export default function Imprint() {
  const { t } = useTranslation();

  return (
    <div className="pt-[140px] md:pt-[152px]">
      <section className="relative py-16 md:py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">
                {t('legalPages.eyebrow')}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif mb-12 tracking-tight text-brand-ink">
              {t('legalPages.imprint.title')} <span className="italic text-brand-gold">{t('legalPages.imprint.titleAccent')}</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-normal leading-relaxed space-y-12">
              <p className="text-xl text-brand-ink font-normal italic">
                {t('legalPages.imprint.intro')}
              </p>

              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Info className="text-brand-gold" size={24} />
                    {t('legalPages.imprint.operatorTitle')}
                  </h2>
                  <div className="space-y-2">
                    <p className="font-bold text-brand-ink">{t('legalPages.orgName')}</p>
                    <p>{t('legalPages.imprint.registry')}</p>
                    <p>{t('legalPages.imprint.nonprofit')}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <MapPin className="text-brand-gold" size={24} />
                    {t('legalPages.imprint.addressTitle')}
                  </h2>
                  <div className="space-y-2">
                    <p>{t('legalPages.imprint.address')}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Mail className="text-brand-gold" size={24} />
                    {t('legalPages.imprint.contactTitle')}
                  </h2>
                  <div className="space-y-2">
                    <p>{t('legalPages.imprint.phoneLabel')}: +4367761160389</p>
                    <p>{t('legalPages.emailLabel')}: info@mongoliancenter.org</p>
                    <p>{t('legalPages.imprint.webLabel')}: www.mongoliancenter.org</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Globe className="text-brand-gold" size={24} />
                    {t('legalPages.imprint.authorityTitle')}
                  </h2>
                  <div className="space-y-2">
                    <p>{t('legalPages.imprint.authority1')}</p>
                    <p>{t('legalPages.imprint.authority2')}</p>
                  </div>
                </section>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.imprint.liabilityContentTitle')}</h2>
                <p>
                  {t('legalPages.imprint.liabilityContent')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.imprint.liabilityLinksTitle')}</h2>
                <p>
                  {t('legalPages.imprint.liabilityLinks')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.imprint.copyrightTitle')}</h2>
                <p>
                  {t('legalPages.imprint.copyright')}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10 text-sm italic">
                <p>{t('legalPages.imprint.disclosure')}</p>
                <p>{t('legalPages.imprint.mediaOwner')}</p>
                <p>{t('legalPages.imprint.purpose')}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
