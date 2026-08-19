import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Users, Sparkles, Send, Star } from 'lucide-react';
import { UlziiSymbol, MongolianFormalFrame, MongolianKhasDivider, SoyomboSymbol } from '../components/MongolianDesign';
import margadPic from '../assets/media/margadpic.png';
import berniPic from '../assets/media/bernipic.png';
import chinggisPic from '../assets/media/chinggiskhan1.png';

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

  return (
    <div className="pt-[140px] md:pt-[152px] bg-[#FAF8F5] min-h-screen text-slate-900 font-sans selection:bg-brand-gold/30 selection:text-slate-900">
      {/* Hero Header - 100% Fully Visible Picture Without Dot Effect or Emblems */}
      <section className="relative min-h-[380px] md:h-[460px] flex items-center px-6 overflow-hidden border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1600&auto=format&fit=crop" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-brand-gold/60" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('about.tag')}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight">
              {t('about.bridging')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('about.cultures')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Executive Bright Formal Layout */}
      <section className="py-16 md:py-24 px-6 bg-[#FAF8F5] relative overflow-hidden text-slate-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-amber-800">
              <UlziiSymbol className="w-5 h-5 text-[#D4AF37]" color="#D4AF37" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#C5A059]">Institutional Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight font-normal text-slate-900">
              {t('about.hubTitle')}
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-sans font-light">
              {t('about.hubDesc1')}
            </p>
            
            <MongolianFormalFrame className="bg-white border-brand-gold/40 p-2 shadow-xl">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop" 
                  alt="Community" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>
            </MongolianFormalFrame>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <MongolianFormalFrame className="bg-white border-brand-gold/40 p-2 shadow-xl">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=880&auto=format&fit=crop" 
                  alt="Vision" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              </div>
            </MongolianFormalFrame>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 text-amber-800">
                <SoyomboSymbol className="w-5 h-5 text-[#D4AF37]" color="#D4AF37" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#C5A059]">Bilateral Vision</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight font-normal text-slate-900">
                {t('about.vision.title')}
              </h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed font-sans font-light">
                {t('about.vision.desc')}
              </p>
            </div>
          </motion.div>
        </div>

        <MongolianKhasDivider className="max-w-4xl mx-auto my-16 opacity-40 text-amber-800" />
      </section>

      {/* Values - Executive Bright Grid */}
      <section className="py-16 md:py-24 px-6 bg-white relative text-slate-900 overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-extrabold text-[#C5A059] mb-3">{t('about.values.tag')}</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-tight text-slate-900">{t('about.values.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('about.values.title'), desc: t('about.values.desc'), icon: <Shield className="w-6 h-6 text-[#D4AF37]" /> },
              { title: t('about.impact.title'), desc: t('about.impact.desc'), icon: <Heart className="w-6 h-6 text-[#D4AF37]" /> },
              { title: t('about.heritage'), desc: t('about.founded'), icon: <Users className="w-6 h-6 text-[#D4AF37]" /> }
            ].map((value, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#FAF8F5] border border-slate-200/90 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md hover:border-brand-gold/50 hover:bg-white transition-all group"
              >
                <div className="w-14 h-14 rounded-xl border border-brand-gold/40 bg-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif mb-4 text-slate-900 font-semibold">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed font-sans text-sm font-light">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Executive Bright Grid */}
      <section className="py-16 md:py-24 px-6 bg-[#FAF8F5] relative text-slate-900 overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-extrabold text-[#C5A059] mb-3">{t('about.benefitsSection.tag')}</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-tight text-slate-900">{t('about.benefitsSection.title')}</h2>
            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-sans font-light max-w-3xl">
              {t('about.benefitsSection.desc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                title: t('about.benefitsSection.items.networking.title'), 
                desc: t('about.benefitsSection.items.networking.desc'), 
                icon: <Users className="w-5 h-5 text-[#D4AF37]" /> 
              },
              { 
                title: t('about.benefitsSection.items.events.title'), 
                desc: t('about.benefitsSection.items.events.desc'), 
                icon: <Star className="w-5 h-5 text-[#D4AF37]" /> 
              },
              { 
                title: t('about.benefitsSection.items.visibility.title'), 
                desc: t('about.benefitsSection.items.visibility.desc'), 
                icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" /> 
              },
              { 
                title: t('about.benefitsSection.items.insights.title'), 
                desc: t('about.benefitsSection.items.insights.desc'), 
                icon: <Shield className="w-5 h-5 text-[#D4AF37]" /> 
              },
              { 
                title: t('about.benefitsSection.items.advocacy.title'), 
                desc: t('about.benefitsSection.items.advocacy.desc'), 
                icon: <Send className="w-5 h-5 text-[#D4AF37]" /> 
              },
              { 
                title: t('about.benefitsSection.items.mentorship.title'), 
                desc: t('about.benefitsSection.items.mentorship.desc'), 
                icon: <Heart className="w-5 h-5 text-[#D4AF37]" /> 
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl border border-brand-gold/30 bg-amber-50/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-slate-900 font-semibold">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed font-sans text-xs md:text-sm font-light">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Executive Bright Portraits */}
      <section className="py-16 md:py-24 px-6 bg-white relative overflow-hidden text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-extrabold text-[#C5A059]">{t('about.team.tag')}</span>
              <div className="h-px w-10 bg-brand-gold/40" />
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mb-6 leading-tight text-slate-900">{t('about.team.title')}</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-serif italic">
              "{t('about.team.quote')}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { id: "margad-erdene-ganbold", name: "Margad-Erdene Ganbold", role: t('about.team.roles.director'), image: margadPic },
              { id: "bernadette-konig", name: "Bernadette König", role: t('about.team.roles.manager'), image: berniPic },
              { id: "batmunkh-unenbaatar", name: "Batmunkh Unenbaatar", role: t('about.team.roles.outreach'), image: chinggisPic }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="group relative block"
              >
                <Link to={`/team/${member.id}`} className="block">
                  <MongolianFormalFrame className="bg-white border-brand-gold/40 p-2 hover:border-brand-gold shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden relative bg-slate-950">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                        <h3 className="text-2xl font-serif text-white mb-1.5 group-hover:text-brand-gold transition-colors duration-300 drop-shadow-md">{member.name}</h3>
                        <div className="px-3 py-1 border border-brand-gold/40 rounded-md bg-[#0A1128]/90 w-max backdrop-blur-sm">
                          <p className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-brand-gold">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  </MongolianFormalFrame>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section - Executive Bright Application Suite */}
      <section className="py-16 md:py-24 px-6 bg-[#FAF8F5] relative overflow-hidden text-slate-900 border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-6 border border-brand-gold/40 px-5 py-1.5 rounded-full bg-white shadow-sm">
              <Heart className="text-[#D4AF37]" size={14} fill="currentColor" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#C5A059]">{t('about.join.tag')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mb-6 text-slate-900">
              {t('about.join.title')} <span className="italic text-[#C5A059] font-light">{t('about.join.titleItalic')}</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-sans font-light max-w-2xl mx-auto">
              {t('about.join.desc')}
            </p>
          </div>

          <MongolianFormalFrame className="bg-white border-brand-gold/40 p-8 md:p-12 shadow-xl">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 relative z-10"
              >
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <Heart size={40} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-serif mb-3 text-slate-900">Application Submitted</h3>
                <p className="text-slate-600 text-base">We've received your application and will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600">{t('about.join.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold transition-all text-sm shadow-sm"
                      placeholder="e.g. Saran"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600">{t('about.join.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold transition-all text-sm shadow-sm"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600">{t('about.join.form.reason')}</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold transition-all resize-none text-sm shadow-sm"
                    placeholder="I'd love to help with..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0A1128] text-white hover:bg-brand-gold hover:text-slate-950 px-8 py-4.5 rounded-xl text-xs uppercase tracking-[0.2em] font-extrabold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group mt-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Submitting Application...</span>
                  ) : (
                    <>
                      <span>{t('about.join.form.submit')}</span>
                      <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </MongolianFormalFrame>
        </div>
      </section>
    </div>
  );
}
