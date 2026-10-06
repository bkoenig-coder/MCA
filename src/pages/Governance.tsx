import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Users, ShieldCheck, FileText, Award, Scale } from 'lucide-react';


import { EyebrowMark } from '../components/MongolianDesign';
export default function Governance() {
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
              {t('legalPages.governance.title')} <span className="italic text-brand-gold">{t('legalPages.governance.titleAccent')}</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-normal leading-relaxed space-y-12">
              <p className="text-xl text-brand-ink font-normal italic">
                {t('legalPages.governance.intro')}
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <ShieldCheck className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.governance.integrityTitle')}</h3>
                  <p className="text-sm">{t('legalPages.governance.integrityText')}</p>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <Users className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.governance.inclusivityTitle')}</h3>
                  <p className="text-sm">{t('legalPages.governance.inclusivityText')}</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.governance.s1Title')}</h2>
                <p>
                  {t('legalPages.governance.s1Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.governance.s2Title')}</h2>
                <p>
                  {t('legalPages.governance.s2Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.governance.s3Title')}</h2>
                <p>
                  {t('legalPages.governance.s3Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.governance.s4Title')}</h2>
                <p>
                  {t('legalPages.governance.s4Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.governance.s5Title')}</h2>
                <p>
                  {t('legalPages.governance.s5Text')}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">{t('legalPages.governance.inquiriesTitle')}</h2>
                <p className="font-medium">{t('legalPages.orgName')}</p>
                <p>{t('legalPages.emailLabel')}: info@mongoliancenter.org</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
