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
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
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
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('about.tag')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9]">
              {t('about.bridging')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('about.cultures')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Editorial Layout */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-start">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-12 text-brand-ink leading-tight">
              {t('about.hubTitle')}
            </h2>
            <p className="text-lg md:text-xl text-brand-ink/70 leading-relaxed font-light mb-8 md:mb-12">
              {t('about.hubDesc1')}
            </p>
            <div className="aspect-square rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="md:pt-40 mt-16 md:mt-0">
            <div className="aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl mb-8 md:mb-12">
              <img 
                src="https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Vision" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-12 text-brand-ink leading-tight">
              {t('about.vision.title')}
            </h2>
            <p className="text-lg md:text-xl text-brand-ink/70 leading-relaxed font-light">
              {t('about.vision.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values - Structured Grid */}
      <section className="py-24 md:py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-32">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6 block">{t('about.values.tag')}</span>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-ink leading-tight">{t('about.values.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { title: t('about.values.title'), desc: t('about.values.desc'), icon: <Shield className="w-8 h-8" /> },
              { title: t('about.impact.title'), desc: t('about.impact.desc'), icon: <Heart className="w-8 h-8" /> },
              { title: t('about.heritage'), desc: t('about.founded'), icon: <Users className="w-8 h-8" /> }
            ].map((value, idx) => (
              <div key={idx} className="group">
                <div className="w-16 h-16 border border-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold mb-8 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif mb-6 text-brand-ink">{value.title}</h3>
                <p className="text-brand-ink/60 leading-relaxed font-light">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Refined Portraits */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6 block">{t('about.team.tag')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-8 leading-tight">{t('about.team.title')}</h2>
            <p className="text-lg md:text-xl text-brand-ink/60 max-w-2xl font-light italic">
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
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden mb-8 shadow-lg relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-gold/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-serif text-brand-ink mb-2">{member.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-brand-paper to-[#fdfbf7] relative overflow-hidden">
        {/* Cute floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[5%] md:left-[15%] text-brand-gold/30"
        >
          <Star size={48} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[5%] md:right-[15%] text-brand-gold/30"
        >
          <Sparkles size={64} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[10%] text-brand-gold/20 hidden md:block"
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-3 mb-6 bg-brand-gold/10 px-6 py-2 rounded-full"
            >
              <Heart className="text-brand-gold" size={16} fill="currentColor" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('about.join.tag')}</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-6">
              {t('about.join.title')} <span className="italic text-brand-gold">{t('about.join.titleItalic')}</span>
            </h2>
            <p className="text-lg md:text-xl text-brand-ink/60 font-light max-w-2xl mx-auto">
              {t('about.join.desc')}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-brand-gold/5 border border-brand-gold/10 relative overflow-hidden"
          >
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                >
                  <Heart size={48} fill="currentColor" />
                </motion.div>
                <h3 className="text-3xl font-serif text-brand-ink mb-4">Welcome to the family!</h3>
                <p className="text-brand-ink/60">We've received your application and will be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-ink/80 ml-2">{t('about.join.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-brand-paper/50 border border-brand-ink/10 rounded-2xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                      placeholder="e.g. Saran"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-ink/80 ml-2">{t('about.join.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-brand-paper/50 border border-brand-ink/10 rounded-2xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-ink/80 ml-2">{t('about.join.form.reason')}</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-6 py-4 bg-brand-paper/50 border border-brand-ink/10 rounded-2xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none"
                    placeholder="I'd love to help with..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-ink text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-gold transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      {t('about.join.form.submit')}
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
