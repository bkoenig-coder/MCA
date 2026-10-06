import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';


import { EyebrowMark } from '../components/MongolianDesign';
export default function PrivacyPolicy() {
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
              {t('legalPages.privacy.title')} <span className="italic text-brand-gold">{t('legalPages.privacy.titleAccent')}</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-normal leading-relaxed space-y-8">
              <p className="text-xl text-brand-ink font-normal italic">
                {t('legalPages.privacy.intro')}
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <Shield className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.privacy.securityTitle')}</h3>
                  <p className="text-sm">{t('legalPages.privacy.securityText')}</p>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <Eye className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.privacy.transparencyTitle')}</h3>
                  <p className="text-sm">{t('legalPages.privacy.transparencyText')}</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s1Title')}</h2>
                <p>
                  {t('legalPages.privacy.s1Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s2Title')}</h2>
                <p>
                  {t('legalPages.privacy.s2Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s3Title')}</h2>
                <p>
                  {t('legalPages.privacy.s3P1')}
                </p>
                <p>
                  {t('legalPages.privacy.s3P2')}
                </p>
                <p>
                  {t('legalPages.privacy.s3P3')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s4Title')}</h2>
                <p>
                  {t('legalPages.privacy.s4P1')}
                </p>
                <p>
                  {t('legalPages.privacy.s4P2')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s5Title')}</h2>
                <p>
                  {t('legalPages.privacy.s5Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.privacy.s6Title')}</h2>
                <p>
{t('legalPages.privacy.s6Text')}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">{t('legalPages.privacy.contactTitle')}</h2>
                <p className="font-medium">{t('legalPages.orgName')}</p>
                <p>{t('legalPages.emailLabel')}: info@mongoliancenter.org</p>
                <p>{t('legalPages.privacy.addressLabel')}: {t('legalPages.privacy.addressValue')}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
