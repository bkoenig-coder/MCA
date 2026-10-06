import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EyebrowMark, MeanderBand } from '../components/MongolianDesign';
import NewsletterForm from '../components/NewsletterForm';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Schöpfleuthergasse 25, 1210 Wien');

const inputClass =
  'w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-brand-ink placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors';
const labelClass = 'block mb-2 text-xs uppercase tracking-[0.12em] font-semibold text-slate-600';

const TOPIC_KEYS = ['t1', 't2', 't3', 't4', 't5', 't6'] as const;

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', topic: 't1', message: '', subscribe: false, website: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    if (formData.website) {
      // Hidden field filled in: a bot. Pretend success.
      setStatus('success');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: t(`contactPage.${formData.topic}`, { lng: 'en' }),
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to send contact form');

      if (formData.subscribe) {
        try {
          await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          });
        } catch (err) {
          console.error('Newsletter subscription failed during contact form submission:', err);
        }
      }

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', topic: 't1', message: '', subscribe: false, website: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const infoCard = 'flex items-start gap-5 py-6 border-b border-slate-200 last:border-b-0';
  const infoIcon = 'w-11 h-11 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0';
  const infoLabel = 'text-xs uppercase tracking-[0.14em] font-semibold text-slate-500 mb-1.5';

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white text-slate-900 font-sans">
      {/* Header */}
      <section className="relative border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('contactPage.tag')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-ink leading-tight">
              {t('contactPage.title')} <span className="italic text-brand-gold">{t('contactPage.titleItalic')}</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-brand-ink/80 leading-relaxed">{t('contactPage.intro')}</p>
          </motion.div>
        </div>
        <MeanderBand className="absolute bottom-0 inset-x-0 translate-y-1/2 bg-brand-gold/40" />
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Details */}
          <motion.aside initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <p className="font-serif text-2xl text-brand-ink mb-2">{t('siteUi.org.name')}</p>
            <p className="text-sm text-slate-500 mb-4">{t('siteUi.org.legalLine')}</p>

            <div className="border-t border-slate-200">
              <div className={infoCard}>
                <span className={infoIcon}><MapPin size={20} /></span>
                <div>
                  <p className={infoLabel}>{t('contactPage.visit')}</p>
                  <address className="not-italic text-lg font-serif text-brand-ink leading-snug">
                    Schöpfleuthergasse 25<br />1210 {t('contact.info.vienna')}
                  </address>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline">
                    {t('contactPage.maps')} <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <div className={infoCard}>
                <span className={infoIcon}><Mail size={20} /></span>
                <div>
                  <p className={infoLabel}>{t('contactPage.email')}</p>
                  <a href="mailto:info@mongoliancenter.org" className="text-lg font-serif text-brand-ink hover:text-brand-blue break-all">info@mongoliancenter.org</a>
                </div>
              </div>

              <div className={infoCard}>
                <span className={infoIcon}><Phone size={20} /></span>
                <div>
                  <p className={infoLabel}>{t('contactPage.phone')}</p>
                  <a href="tel:+4367761160389" className="text-lg font-serif text-brand-ink hover:text-brand-blue">+43 677 6116 0389</a>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-500">{t('siteUi.impact.zvrLabel')} 1673049268 · {t('siteUi.impact.zvrRegister')}</p>
          </motion.aside>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <div className="border border-slate-200 rounded-2xl p-7 md:p-10 border-t-4 border-t-brand-gold bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.25)]">
              <h2 className="text-2xl md:text-3xl font-serif text-brand-ink">{t('contactPage.formTitle')}</h2>
              <p className="mt-2 mb-8 text-slate-600">{t('contactPage.formIntro')}</p>

              {status === 'success' ? (
                <div role="status" className="text-center py-10">
                  <CheckCircle2 className="w-12 h-12 text-brand-blue mx-auto mb-4" />
                  <p className="text-lg font-serif text-brand-ink max-w-md mx-auto">{t('contactPage.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass} htmlFor="c-first">{t('contactPage.firstName')}</label>
                      <input id="c-first" required maxLength={100} autoComplete="given-name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="c-last">{t('contactPage.lastName')}</label>
                      <input id="c-last" required maxLength={100} autoComplete="family-name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="c-email">{t('contactPage.yourEmail')}</label>
                    <input id="c-email" type="email" required maxLength={200} autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="c-topic">{t('contactPage.topic')}</label>
                    <select id="c-topic" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className={inputClass}>
                      {TOPIC_KEYS.map((k) => (
                        <option key={k} value={k}>{t(`contactPage.${k}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="c-message">{t('contactPage.message')}</label>
                    <textarea id="c-message" required rows={6} maxLength={5000} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t('contactPage.messagePh')} className={`${inputClass} resize-none`} />
                  </div>

                  {/* Honeypot: real people never see or fill this */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={formData.subscribe} onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#0066B3]" />
                    <span>{t('contactPage.newsletter')}</span>
                  </label>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t('contactPage.consent')} <Link to="/privacy" className="underline hover:text-brand-blue">{t('contactPage.nameTitle')}</Link>.
                  </p>

                  {status === 'error' && (
                    <div role="alert" className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2.5">
                      <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                      <p>{t('contactPage.error')}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-ink text-white hover:bg-brand-blue py-4 rounded-lg uppercase tracking-[0.16em] font-semibold text-xs transition-colors flex items-center justify-center gap-3 disabled:opacity-60 group"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="animate-spin" size={16} /> {t('contactPage.sending')}</>
                    ) : (
                      <>
                        <span>{t('contactPage.send')}</span>
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 px-6 bg-brand-ink text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            {t('news.newsletter.title')} <span className="italic text-brand-gold">{t('news.newsletter.titleItalic')}</span>
          </h2>
          <p className="text-base text-white/75 leading-relaxed mb-8 max-w-xl mx-auto">{t('news.newsletter.desc')}</p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
