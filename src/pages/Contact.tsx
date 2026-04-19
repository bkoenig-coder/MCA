import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, ArcherSymbol } from '../components/MongolianDesign';
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
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://plus.unsplash.com/premium_photo-1697730217843-764889ae1995?q=80&w=1295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('contact.tag')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9]">
              {t('contact.title')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('contact.titleItalic')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 md:py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-10 md:space-y-16">
                <div className="flex items-start gap-6 md:gap-8 group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-paper rounded-2xl md:rounded-[32px] flex items-center justify-center text-brand-gold border border-brand-ink/5 group-hover:border-brand-gold transition-all duration-500 flex-shrink-0">
                    <MapPin size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 mb-2 md:mb-4">{t('contact.info.location')}</h4>
                    <p className="text-xl md:text-2xl font-serif text-brand-ink leading-relaxed">
                      Vienna, Austria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 md:gap-8 group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-paper rounded-2xl md:rounded-[32px] flex items-center justify-center text-brand-gold border border-brand-ink/5 group-hover:border-brand-gold transition-all duration-500 flex-shrink-0">
                    <Mail size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 mb-2 md:mb-4">{t('contact.info.email')}</h4>
                    <p className="text-xl md:text-2xl font-serif text-brand-ink leading-relaxed break-all">
                      info@mongoliancenter.org
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 md:gap-8 group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-paper rounded-2xl md:rounded-[32px] flex items-center justify-center text-brand-gold border border-brand-ink/5 group-hover:border-brand-gold transition-all duration-500 flex-shrink-0">
                    <Phone size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 mb-2 md:mb-4">{t('contact.info.phone')}</h4>
                    <p className="text-xl md:text-2xl font-serif text-brand-ink leading-relaxed">
                      +4367761160389
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-brand-ink/5">
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 opacity-10 flex-shrink-0">
                    <UlziiSymbol className="w-full h-full text-brand-gold" />
                  </div>
                  <p className="text-sm md:text-base text-brand-ink/40 font-light italic">
                    "{t('contact.quote')}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-paper p-8 md:p-20 rounded-[40px] md:rounded-[60px] border border-brand-ink/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 opacity-[0.03] pointer-events-none">
                <SoyomboSymbol className="w-64 h-64 text-brand-gold" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">{t('contact.form.firstName')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white border border-brand-ink/5 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-brand-gold transition-all outline-none font-light" 
                      placeholder={t('contact.form.placeholders.firstName')} 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">{t('contact.form.lastName')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white border border-brand-ink/5 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-brand-gold transition-all outline-none font-light" 
                      placeholder={t('contact.form.placeholders.lastName')} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">{t('contact.form.email')}</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-brand-ink/5 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-brand-gold transition-all outline-none font-light" 
                    placeholder={t('contact.form.placeholders.email')} 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">{t('contact.form.subject')}</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-brand-ink/5 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-brand-gold transition-all outline-none appearance-none font-light"
                  >
                    <option>{t('contact.form.subjects.general')}</option>
                    <option>{t('contact.form.subjects.investment')}</option>
                    <option>{t('contact.form.subjects.cultural')}</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 ml-1">{t('contact.form.message')}</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-brand-ink/5 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-brand-gold transition-all outline-none font-light resize-none" 
                    placeholder={t('contact.form.placeholders.message')}
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 ml-1">
                  <input 
                    type="checkbox" 
                    id="subscribe"
                    checked={formData.subscribe}
                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
                    className="w-5 h-5 rounded border-brand-ink/10 text-brand-gold focus:ring-brand-gold"
                  />
                  <label htmlFor="subscribe" className="text-sm text-brand-ink/60 font-light cursor-pointer">
                    {t('news.newsletter.desc')}
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-brand-ink text-white py-6 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-gold transition-all shadow-2xl shadow-brand-ink/20 group uppercase tracking-[0.2em] text-xs disabled:bg-brand-ink/50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : status === 'success' ? (
                    <>
                      {t('contact.success')}
                      <CheckCircle2 size={20} />
                    </>
                  ) : (
                    <>
                      {t('contact.form.send')} 
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 md:py-40 px-6 bg-brand-ink text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.05] translate-x-1/4 -translate-y-1/4">
          <UlziiSymbol className="w-[400px] md:w-[600px] h-[400px] md:h-[600px] text-brand-gold" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-10 tracking-tight">
            {t('news.newsletter.title')} <span className="italic text-brand-gold">{t('news.newsletter.titleItalic')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('news.newsletter.desc')}
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
