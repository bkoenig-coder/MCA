import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { EyebrowMark } from '../components/MongolianDesign';
import { getJob, submitApplication, type Job } from '../services/careers';
import { JobMeta, formatDeadline } from './Careers';

const inputClass =
  'w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-brand-ink placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-sm';
const labelClass = 'block mb-2 text-xs uppercase tracking-[0.12em] font-semibold text-slate-600';

export default function CareerDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedinUrl: '', cvUrl: '', message: '', consent: false, website: '' });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    if (!id) {
      setLoading(false);
      return;
    }
    getJob(id)
      .then((j) => alive && setJob(j))
      .catch((e) => {
        console.error('Could not load role:', e);
        if (alive) setJob(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const locale = t('common.locale', { defaultValue: 'en-GB' });
  const isOpen = !!job && job.status === 'open' && (!job.deadline || job.deadline >= new Date().toISOString().slice(0, 10));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || sending) return;
    if (form.website) {
      // Hidden field filled in: a bot. Pretend success.
      setSent(true);
      return;
    }
    setSending(true);
    setError(false);
    try {
      await submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        name: form.name,
        email: form.email,
        phone: form.phone,
        linkedinUrl: form.linkedinUrl,
        cvUrl: form.cvUrl,
        message: form.message,
      });
      setSent(true);
    } catch (err) {
      console.error('Application failed:', err);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <Link to="/careers" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-slate-600 hover:text-brand-blue transition-colors mb-8">
          <ArrowLeft size={14} /> {t('careers.back')}
        </Link>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : !job || !isOpen ? (
          <p className="py-16 text-lg text-brand-ink">{t('careers.closed')}</p>
        ) : (
          <div className="grid lg:grid-cols-[1fr_26rem] gap-12 lg:gap-16 items-start">
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-4">
                <EyebrowMark />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('careers.tag')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-ink leading-tight mb-4">{job.title}</h1>
              <JobMeta job={job} />
              {job.deadline && (
                <p className="mt-3 text-sm text-slate-500">
                  {t('careers.deadline')}: <span className="text-brand-ink font-medium">{formatDeadline(job.deadline, locale)}</span>
                </p>
              )}

              {job.description && (
                <section className="mt-10 pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-serif text-brand-ink mb-4">{t('careers.aboutRole')}</h2>
                  <p className="text-base md:text-lg text-brand-ink/80 leading-relaxed whitespace-pre-line">{job.description}</p>
                </section>
              )}
              {job.requirements && (
                <section className="mt-10 pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-serif text-brand-ink mb-4">{t('careers.requirements')}</h2>
                  <p className="text-base md:text-lg text-brand-ink/80 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                </section>
              )}
            </motion.article>

            <aside className="lg:sticky lg:top-40 border border-slate-200 rounded-xl p-6 md:p-8 bg-white" id="apply">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-brand-blue mx-auto mb-4" />
                  <h2 className="text-2xl font-serif text-brand-ink mb-2">{t('careers.form.successTitle')}</h2>
                  <p className="text-slate-600">{t('careers.form.successText')}</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <h2 className="text-2xl font-serif text-brand-ink">{t('careers.form.title')}</h2>

                  <div>
                    <label className={labelClass} htmlFor="app-name">{t('careers.form.name')}</label>
                    <input id="app-name" required maxLength={200} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} autoComplete="name" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="app-email">{t('careers.form.email')}</label>
                    <input id="app-email" type="email" required maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="app-phone">{t('careers.form.phone')}</label>
                    <input id="app-phone" type="tel" maxLength={60} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} autoComplete="tel" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="app-cv">{t('careers.form.cv')}</label>
                    <input id="app-cv" type="url" maxLength={500} value={form.cvUrl} onChange={(e) => setForm({ ...form, cvUrl: e.target.value })} className={inputClass} placeholder="https://" />
                    <p className="mt-1.5 text-xs text-slate-500">{t('careers.form.cvHelp')}</p>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="app-linkedin">{t('careers.form.linkedin')}</label>
                    <input id="app-linkedin" type="url" maxLength={500} value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className={inputClass} placeholder="https://" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="app-message">{t('careers.form.message')}</label>
                    <textarea id="app-message" required rows={5} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
                  </div>

                  {/* Honeypot: real people never see or fill this */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-600 leading-snug cursor-pointer">
                    <input type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 accent-[#0066B3]" />
                    <span>
                      {t('careers.form.consent')}{' '}
                      <Link to="/privacy" className="underline hover:text-brand-blue">{t('footer.privacy', { defaultValue: 'Privacy Policy' })}</Link>
                    </span>
                  </label>

                  {error && <p role="alert" className="text-sm text-red-600">{t('careers.form.error')}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-ink text-white hover:bg-brand-blue px-8 py-4 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {sending ? (
                      <span className="animate-pulse">{t('careers.form.sending')}</span>
                    ) : (
                      <>
                        <span>{t('careers.form.submit')}</span>
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
