import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react';


import { EyebrowMark } from '../components/MongolianDesign';
export default function TermsOfService() {
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
              {t('legalPages.terms.title')} <span className="italic text-brand-gold">{t('legalPages.terms.titleAccent')}</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-normal leading-relaxed space-y-8">
              <p className="text-xl text-brand-ink font-normal italic">
                {t('legalPages.terms.intro')}
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <Scale className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.terms.frameworkTitle')}</h3>
                  <p className="text-sm">{t('legalPages.terms.frameworkText')}</p>
                </div>
                <div className="p-8 bg-white rounded-2xl border border-brand-ink/5 shadow-sm">
                  <CheckCircle className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t('legalPages.terms.responsibilityTitle')}</h3>
                  <p className="text-sm">{t('legalPages.terms.responsibilityText')}</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s1Title')}</h2>
                <p>
                  {t('legalPages.terms.s1Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s2Title')}</h2>
                <p>
                  {t('legalPages.terms.s2Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s3Title')}</h2>
                <p>
                  {t('legalPages.terms.s3Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s4Title')}</h2>
                <p>
                  {t('legalPages.terms.s4Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s5Title')}</h2>
                <p>
                  {t('legalPages.terms.s5Text')}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{t('legalPages.terms.s6Title')}</h2>
                <p>
                  {t('legalPages.terms.s6Text')}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">{t('legalPages.terms.questionsTitle')}</h2>
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
