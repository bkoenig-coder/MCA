import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, ArrowRight, Mail, MapPin, Scale, FileText, ShieldCheck } from 'lucide-react';
import { EyebrowMark, SectionSeam } from '../components/MongolianDesign';
import margadPic from '../assets/media/margadpic.png';
import berniPic from '../assets/media/bernipic.png';
import chinggisPic from '../assets/media/chinggiskhan1.png';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

function SectionHeader({ tag, title, intro, center = false }: { tag: string; title: React.ReactNode; intro?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center max-w-3xl mx-auto mb-12 md:mb-14' : 'max-w-3xl mb-12 md:mb-14'}>
      <div className={`flex items-center gap-4 mb-3 ${center ? 'justify-center' : ''}`}>
        <EyebrowMark />
        <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{tag}</span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink">{title}</h2>
      {intro && <p className="mt-5 text-base md:text-lg text-brand-ink/80 leading-relaxed">{intro}</p>}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name,
          lastName: '',
          email: formData.email,
          subject: 'Join Us Application',
          message: formData.reason
        })
      });
      if (!response.ok) throw new Error('Submission failed');
      setIsSuccess(true);
      setFormData({ name: '', email: '', reason: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const facts = [
    { label: t('siteUi.about.factEstablished'), value: '2026' },
    { label: t('siteUi.about.factForm'), value: t('siteUi.about.factFormValue') },
    { label: t('siteUi.about.factSeat'), value: t('contact.info.vienna') },
    { label: t('siteUi.about.factLanguages'), value: 'English · Deutsch · Монгол' },
  ];

  const principles = [
    { n: '01', title: t('about.values.title'), desc: t('about.values.desc') },
    { n: '02', title: t('about.impact.title'), desc: t('about.impact.desc') },
    { n: '03', title: t('about.heritage'), desc: t('about.founded') },
  ];

  const offers = ['networking', 'events', 'visibility', 'insights', 'advocacy', 'mentorship'].map((k) => ({
    key: k,
    title: t(`about.benefitsSection.items.${k}.title`),
    desc: t(`about.benefitsSection.items.${k}.desc`),
  }));

  const team = [
    { id: 'margad-erdene-ganbold', name: 'Margad-Erdene Ganbold', role: t('about.team.roles.director'), image: margadPic },
    { id: 'bernadette-konig', name: 'Bernadette König', role: t('about.team.roles.manager'), image: berniPic },
    { id: 'batmunkh-unenbaatar', name: 'Batmunkh Unenbaatar', role: t('about.team.roles.outreach'), image: chinggisPic },
  ];

  const governance = [
    { to: '/governance', icon: Scale, title: t('siteUi.about.govGovernance'), text: t('siteUi.about.govGovernanceText') },
    { to: '/imprint', icon: FileText, title: t('siteUi.about.govImprint'), text: t('siteUi.about.govImprintText') },
    { to: '/privacy', icon: ShieldCheck, title: t('siteUi.about.govPrivacy'), text: t('siteUi.about.govPrivacyText') },
  ];

  const inputClass =
    'w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-brand-ink placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-sm';
  const labelClass = 'block mb-2 text-xs uppercase tracking-[0.12em] font-semibold text-slate-600';

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen text-slate-900 font-sans selection:bg-brand-gold/30 selection:text-slate-900">
      {/* Hero */}
      <section className="relative min-h-[320px] md:h-[400px] flex items-center overflow-hidden border-b border-brand-gold/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1600&auto=format&fit=crop"
            alt={t('siteUi.about.heroAlt')}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 py-10 md:py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-5">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('about.tag')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight">
              {t('about.bridging')} <span className="italic text-brand-gold">{t('about.cultures')}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
              {t('siteUi.about.heroLead')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Facts */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200 border-x border-slate-200">
            {facts.map((f) => (
              <div key={f.label} className="px-5 md:px-8 py-6">
                <dt className="text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold mb-1.5">{f.label}</dt>
                <dd className="text-base md:text-lg font-serif text-brand-ink leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SectionSeam />
      {/* Who we are */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div {...reveal} className="lg:col-span-7">
            <SectionHeader tag={t('siteUi.about.who')} title={t('about.hubTitle')} />
            <div className="space-y-5 text-base md:text-lg text-brand-ink/80 leading-relaxed -mt-4">
              <p>{t('about.hubDesc1')}</p>
              <p>{t('about.hubDesc2')}</p>
              <p>{t('about.hubDesc3')}</p>
            </div>
          </motion.div>

          <motion.aside {...reveal} className="lg:col-span-5">
            <div className="border border-slate-200 rounded-xl p-8 md:p-10 bg-white">
              <p className="text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold mb-3">{t('siteUi.about.visionLabel')}</p>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-ink leading-snug mb-4">{t('about.vision.title')}</h3>
              <p className="text-base text-brand-ink/80 leading-relaxed">{t('about.vision.desc')}</p>
            </div>
          </motion.aside>
        </div>
      </section>

      <SectionSeam />
      {/* Principles */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader tag={t('about.values.tag')} title={t('siteUi.about.principlesTitle')} />
          <div className="grid md:grid-cols-3 border-t border-slate-200">
            {principles.map((p, i) => (
              <motion.div
                key={p.n}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className={`py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 ${i > 0 ? 'md:border-l border-slate-200' : ''} border-b md:border-b-0 border-slate-200`}
              >
                <span className="font-serif text-3xl text-brand-gold">{p.n}</span>
                <h3 className="mt-4 mb-3 text-2xl font-serif text-brand-ink">{p.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* What we offer */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader tag={t('about.benefitsSection.tag')} title={t('about.benefitsSection.title')} intro={t('about.benefitsSection.desc')} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
            {offers.map((o, i) => (
              <motion.div
                key={o.key}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
                className="py-7 border-t border-slate-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold shrink-0" />
                  <h3 className="text-xl font-serif text-brand-ink">{o.title}</h3>
                </div>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/membership" className="group inline-flex items-center gap-3 bg-brand-ink text-white px-6 py-3 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-brand-blue transition-colors duration-300">
              {t('siteUi.about.seeMembership')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Leadership */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader tag={t('about.team.tag')} title={t('about.team.title')} intro={t('about.team.quote').replace(/^"|"$/g, '')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <motion.div key={m.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
                <Link to={`/team/${m.id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="pt-5">
                    <h3 className="text-2xl font-serif text-brand-ink group-hover:text-brand-blue transition-colors">{m.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold">{m.role}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Governance and contact */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader tag={t('siteUi.about.govTag')} title={t('siteUi.about.govTitle')} />
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-6">
              {governance.map((g) => (
                <Link
                  key={g.to}
                  to={g.to}
                  className="group border border-slate-200 rounded-xl p-6 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300"
                >
                  <g.icon className="w-6 h-6 text-brand-blue mb-5" />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{g.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{g.text}</p>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink group-hover:text-brand-blue transition-colors">
                    {t('siteUi.about.govOpen')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="lg:col-span-5 border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-serif text-brand-ink mb-1">{t('siteUi.org.name')}</h3>
              <p className="text-sm text-slate-500 mb-6">{t('siteUi.org.legalLine')}</p>
              <ul className="space-y-4 text-sm text-brand-ink/85">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-brand-blue mt-0.5 shrink-0" />
                  <span>{t('contact.info.vienna')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-brand-blue mt-0.5 shrink-0" />
                  <a href="mailto:info@mongoliancenter.org" className="hover:text-brand-blue transition-colors">info@mongoliancenter.org</a>
                </li>
              </ul>
              <Link to="/contact" className="mt-7 group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink hover:text-brand-blue transition-colors">
                {t('siteUi.about.govContact')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Join */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <SectionHeader
            center
            tag={t('about.join.tag')}
            title={<>{t('about.join.title')} <span className="italic text-brand-gold">{t('about.join.titleItalic')}</span></>}
            intro={t('about.join.desc')}
          />
          <div className="border border-slate-200 rounded-xl p-6 md:p-10 bg-white">
            {isSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <h3 className="text-3xl font-serif mb-3 text-brand-ink">{t('siteUi.about.submittedTitle')}</h3>
                <p className="text-slate-600">{t('siteUi.about.submittedText')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>{t('about.join.form.name')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder={t('siteUi.about.phName')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('about.join.form.email')}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder={t('siteUi.about.phEmail')}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('about.join.form.reason')}</label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder={t('siteUi.about.phReason')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-ink text-white hover:bg-brand-blue px-8 py-4 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">{t('siteUi.about.submitting')}</span>
                  ) : (
                    <>
                      <span>{t('about.join.form.submit')}</span>
                      <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
