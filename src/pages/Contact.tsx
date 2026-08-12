import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, ArcherSymbol, MongolianFormalFrame, MongolianKhasDivider } from '../components/MongolianDesign';
import NewsletterForm from '../components/NewsletterForm';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: t('contact.form.subjects.general'),
    message: '',
    subscribe: false
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Send contact form data
      const contactResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });

      if (!contactResponse.ok) {
        throw new Error('Failed to send contact form');
      }

      console.log('Contact form submitted successfully');

      // 2. If subscribe is checked, send to newsletter endpoint
      if (formData.subscribe) {
        try {
          await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          });
        } catch (err) {
          console.error('Newsletter subscription failed during contact form submission:', err);
          // We don't fail the whole form if just the newsletter fails
        }
      }
      
      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: t('contact.form.subjects.general'),
        message: '',
        subscribe: false
      });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="pt-20 bg-brand-paper">
      {/* Executive Hero */}
      <section className="relative min-h-[35vh] md:h-[50vh] flex items-center px-6 bg-[#0A1128] overflow-hidden border-b border-brand-gold/20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://plus.unsplash.com/premium_photo-1697730217843-764889ae1995?q=80&w=1295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/80 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <UlziiSymbol className="w-5 h-5 text-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-brand-gold">{t('contact.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight">
              {t('contact.title')} <br className="hidden md:block" /><span className="italic text-brand-gold font-light">{t('contact.titleItalic')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Bright Executive Contact Content */}
      <section className="py-16 md:py-24 px-6 bg-brand-paper">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="space-y-6">
                <div className="bg-white border border-brand-gold/30 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg hover:border-brand-gold hover:shadow-xl transition-all duration-300 flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-brand-gold/15 text-brand-gold rounded-2xl border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-slate-950 transition-colors duration-300">
                    <MapPin size={26} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-slate-400 mb-2">{t('contact.info.location')}</h4>
                    <p className="text-xl font-serif text-slate-900 leading-snug font-semibold">
                      Vienna, Austria
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-gold/30 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg hover:border-brand-gold hover:shadow-xl transition-all duration-300 flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-brand-gold/15 text-brand-gold rounded-2xl border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-slate-950 transition-colors duration-300">
                    <Mail size={26} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-slate-400 mb-2">{t('contact.info.email')}</h4>
                    <p className="text-xl font-serif text-slate-900 leading-snug break-all font-semibold">
                      info@mongoliancenter.org
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-gold/30 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg hover:border-brand-gold hover:shadow-xl transition-all duration-300 flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-brand-gold/15 text-brand-gold rounded-2xl border border-brand-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-slate-950 transition-colors duration-300">
                    <Phone size={26} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-slate-400 mb-2">{t('contact.info.phone')}</h4>
                    <p className="text-xl font-serif text-slate-900 leading-snug font-semibold">
                      +4367761160389
                    </p>
                  </div>
                </div>
              </div>

              {/* Cultural Quote Box */}
              <div className="p-8 bg-white border border-brand-gold/30 rounded-[24px] md:rounded-[32px] shadow-md">
                <div className="flex items-center gap-5">
                  <UlziiSymbol className="w-10 h-10 text-brand-gold flex-shrink-0" />
                  <p className="text-xs md:text-sm text-slate-600 font-serif italic leading-relaxed">
                    "{t('contact.quote')}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Smooth Rounded Form Container */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-8 md:p-14 rounded-[32px] md:rounded-[48px] border border-brand-gold/30 shadow-2xl relative overflow-hidden">
                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-brand-gold block mb-1">Official Inquiry</span>
                  <h3 className="text-2xl md:text-4xl font-serif text-slate-900 font-semibold">Send Us a Message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 ml-1">{t('contact.form.firstName')}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all outline-none font-sans text-sm text-slate-900" 
                        placeholder={t('contact.form.placeholders.firstName')} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 ml-1">{t('contact.form.lastName')}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all outline-none font-sans text-sm text-slate-900" 
                        placeholder={t('contact.form.placeholders.lastName')} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 ml-1">{t('contact.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all outline-none font-sans text-sm text-slate-900" 
                      placeholder={t('contact.form.placeholders.email')} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 ml-1">{t('contact.form.subject')}</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all outline-none appearance-none font-sans text-sm text-slate-900"
                    >
                      <option>{t('contact.form.subjects.general')}</option>
                      <option>{t('contact.form.subjects.investment')}</option>
                      <option>{t('contact.form.subjects.cultural')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 ml-1">{t('contact.form.message')}</label>
                    <textarea 
                      rows={5} 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all outline-none font-sans text-sm text-slate-900 resize-none" 
                      placeholder={t('contact.form.placeholders.message')}
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 ml-1">
                    <input 
                      type="checkbox" 
                      id="subscribe"
                      checked={formData.subscribe}
                      onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
                    />
                    <label htmlFor="subscribe" className="text-xs text-slate-600 font-sans cursor-pointer">
                      {t('news.newsletter.desc')}
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-brand-gold hover:bg-amber-400 text-slate-950 py-5 rounded-full font-extrabold flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] group uppercase tracking-[0.2em] text-xs disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : status === 'success' ? (
                      <>
                        <span>{t('contact.success')}</span>
                        <CheckCircle2 size={18} />
                      </>
                    ) : (
                      <>
                        <span>{t('contact.form.send')}</span>
                        <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        <MongolianKhasDivider className="max-w-4xl mx-auto my-16" />
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 px-6 bg-[#0A1128] text-white relative overflow-hidden border-t border-brand-gold/20">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-slate-900/90 border border-brand-gold/40 p-8 md:p-14 rounded-[32px] md:rounded-[48px] shadow-2xl text-center">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">
              {t('news.newsletter.title')} <span className="italic text-brand-gold font-light">{t('news.newsletter.titleItalic')}</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-sans font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('news.newsletter.desc')}
            </p>
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
