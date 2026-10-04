import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { EyebrowMark, MeanderBand } from '../components/MongolianDesign';
import { isMissingTable, listOpenJobs, type Job } from '../services/careers';

export function formatDeadline(date: string | null, locale: string) {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  return isNaN(d.getTime()) ? date : d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function JobMeta({ job }: { job: Job }) {
  const parts = [job.department, job.location, job.employmentType].filter(Boolean);
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.12em] font-semibold text-slate-500">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="w-1 h-1 rotate-45 bg-brand-gold" />}
          {p}
        </span>
      ))}
    </p>
  );
}

export default function Careers() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    listOpenJobs()
      .then((rows) => alive && setJobs(rows))
      .catch((e) => {
        // Tables not created yet: show the normal "no open positions" state instead of an error.
        if (isMissingTable(e)) return;
        console.error('Could not load careers:', e);
        if (alive) setFailed(true);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const locale = t('common.locale', { defaultValue: 'en-GB' });

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen text-slate-900 font-sans">
      {/* Header */}
      <section className="relative border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('careers.tag')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-ink leading-tight">{t('careers.title')}</h1>
            <p className="mt-5 text-base md:text-lg text-brand-ink/80 leading-relaxed">{t('careers.intro')}</p>
          </motion.div>
        </div>
        <MeanderBand className="absolute bottom-0 inset-x-0 translate-y-1/2 bg-brand-gold/40" />
      </section>

      {/* Open positions */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-ink mb-8">{t('careers.openRoles')}</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-brand-gold" size={32} />
            </div>
          ) : failed ? (
            <p className="text-slate-600 py-6 border-t border-slate-200">{t('careers.loadError')}</p>
          ) : jobs.length === 0 ? (
            <div className="border-t border-slate-200 py-10">
              <p className="text-lg text-brand-ink">{t('careers.noRoles')}</p>
              <p className="mt-2 text-slate-600">{t('careers.noRolesHint')}</p>
            </div>
          ) : (
            <ul className="border-b border-slate-200">
              {jobs.map((job, i) => (
                <motion.li
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-t border-slate-200"
                >
                  <Link to={`/careers/${job.id}`} className="group grid md:grid-cols-[1fr_auto] gap-4 md:gap-10 items-center py-7 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="text-2xl font-serif text-brand-ink group-hover:text-brand-blue transition-colors">{job.title}</h3>
                      <div className="mt-2">
                        <JobMeta job={job} />
                      </div>
                      {job.description && (
                        <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed line-clamp-2 max-w-3xl">{job.description}</p>
                      )}
                    </div>
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 text-sm">
                      {job.deadline && (
                        <span className="text-slate-500">
                          {t('careers.deadline')}: <span className="text-brand-ink font-medium">{formatDeadline(job.deadline, locale)}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink group-hover:text-brand-blue transition-colors">
                        {t('careers.viewRole')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}

          {/* Open application */}
          <div className="mt-14 rounded-xl border border-slate-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-serif text-brand-ink mb-2">{t('careers.openAppTitle')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('careers.openAppText')}</p>
            </div>
            <Link
              to="/contact"
              className="group shrink-0 inline-flex items-center gap-3 bg-brand-ink text-white px-6 py-3 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-brand-blue transition-colors duration-300"
            >
              <Mail size={14} /> {t('careers.openAppCta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
