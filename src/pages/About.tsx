import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Users, Sparkles, Send, Star } from 'lucide-react';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol } from '../components/MongolianDesign';
import margadPic from '../assets/media/margadpic.png';
import berniPic from '../assets/media/bernipic.png';
import chinggisPic from '../assets/media/chinggiskhan1.png';

export default function About() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', reason: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover opacity-20 grayscale brightness-110"
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
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('about.tag')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9]">
              {t('about.bridging')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('about.cultures')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Editorial Layout */}
      <section className="py-24 md:py-32 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-start">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-brand-ink leading-tight">
              {t('about.hubTitle')}
            </h2>
            <p className="text-base md:text-lg text-brand-ink/70 leading-relaxed font-light mb-12">
              {t('about.hubDesc1')}
            </p>
            <div className="aspect-square rounded-sm overflow-hidden shadow-sm border border-gray-100">
              <img 
                src="https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="md:pt-32 mt-16 md:mt-0">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-sm border border-gray-100 mb-12">
              <img 
                src="https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Vision" 
                className="w-full h-full object-cover grayscale opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-brand-ink leading-tight">
              {t('about.vision.title')}
            </h2>
            <p className="text-base md:text-lg text-brand-ink/70 leading-relaxed font-light">
              {t('about.vision.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values - Structured Grid */}
      <section className="py-24 md:py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 block">{t('about.values.tag')}</span>
              <h2 className="text-3xl md:text-5xl font-serif text-brand-ink leading-tight">{t('about.values.title')}</h2>
            </div>
            <div className="h-px bg-gray-300 flex-1 ml-0 md:ml-12 mb-4 md:mb-6 hidden md:block" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-y-16 gap-x-12">
            {[
              { title: t('about.values.title'), desc: t('about.values.desc'), icon: <Shield className="w-6 h-6" /> },
              { title: t('about.impact.title'), desc: t('about.impact.desc'), icon: <Heart className="w-6 h-6" /> },
              { title: t('about.heritage'), desc: t('about.founded'), icon: <Users className="w-6 h-6" /> }
            ].map((value, idx) => (
              <div key={idx} className="group flex flex-col border-t border-gray-200 pt-8">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-brand-ink mb-6 group-hover:bg-brand-ink group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-serif mb-4 text-brand-ink">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light text-sm">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Refined Portraits */}
      <section className="py-24 md:py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-20 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4 block">{t('about.team.tag')}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-6 leading-tight">{t('about.team.title')}</h2>
            <div className="w-12 h-px bg-brand-gold mx-auto mb-6" />
            <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
              {t('about.team.quote')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { name: "Margad-Erdene Ganbold", role: t('about.team.roles.director'), image: margadPic },
              { name: "Bernadette König", role: t('about.team.roles.manager'), image: berniPic },
              { name: "M. Ganzorig", role: t('about.team.roles.outreach'), image: chinggisPic }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center text-center"
              >
                <div className="aspect-[3/4] w-full max-w-[320px] rounded-sm overflow-hidden mb-6 border border-gray-100 relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif text-brand-ink mb-1">{member.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section - Professional Form */}
      <section className="py-24 md:py-32 px-6 bg-brand-ink text-white relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">{t('about.join.tag')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              {t('about.join.title')} <br/><span className="text-brand-gold italic">{t('about.join.titleItalic')}</span>
            </h2>
            <p className="text-white/70 font-light max-w-md text-sm md:text-base leading-relaxed mb-8">
              {t('about.join.desc')}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white text-brand-ink p-8 md:p-10 shadow-xl border border-gray-200 rounded-sm"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6 text-green-600 rounded-sm">
                  <Heart size={24} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-serif mb-2">Message Received</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('about.join.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-ink focus:ring-1 focus:ring-brand-ink transition-all rounded-none text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('about.join.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-ink focus:ring-1 focus:ring-brand-ink transition-all rounded-none text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('about.join.form.reason')}</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-ink focus:ring-1 focus:ring-brand-ink transition-all resize-none rounded-none text-sm"
                    placeholder="How can we collaborate?"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-ink text-white px-6 py-4 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-brand-gold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      {t('about.join.form.submit')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
