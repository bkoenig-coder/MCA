import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Users, Sparkles, Send, Star } from 'lucide-react';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol, MongolianFormalFrame, MongolianKhasDivider } from '../components/MongolianDesign';
import margadPic from '../assets/media/margadpic.png';
import berniPic from '../assets/media/bernipic.png';
import chinggisPic from '../assets/media/chinggiskhan1.png';

const toggleActive = (entry: any, force: boolean) => {
  if (entry?.target) {
    if (force) entry.target.classList.add('is-active');
    else entry.target.classList.remove('is-active');
  }
};

const EMBER_PARTICLES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: `${Math.random() * 100}%`,
  top: `${10 + Math.random() * 90}%`,
  duration: `${Math.random() * 5 + 4}s`,
  delay: `${Math.random() * 5}s`,
  xMove: `${(Math.random() - 0.5) * 100}px`,
  yMove: `${-(Math.random() * 200 + 150)}px`,
  color: ['bg-orange-500', 'bg-amber-400', 'bg-rose-500', 'bg-yellow-500'][Math.floor(Math.random() * 4)],
  blur: Math.random() > 0.5 ? 'blur-[1px]' : 'blur-[2px]',
}));

const EmberBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {EMBER_PARTICLES.map((p) => (
      <div
        key={`ember-${p.id}`}
        className={`absolute rounded-full animate-ember ${p.color} ${p.blur}`}
        style={{
          left: p.left,
          top: p.top,
          width: `${p.size}px`,
          height: `${p.size}px`,
          '--x-move': p.xMove,
          '--y-move': p.yMove,
          '--duration': p.duration,
          '--delay': p.delay,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

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

      {/* Mission & Vision - Executive Formal Layout */}
      <section className="py-12 md:py-20 px-6 bg-[#0B132B] relative overflow-hidden text-white border-t border-brand-gold/20">
        <EmberBackground />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-brand-gold">
              <UlziiSymbol className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold">Institutional Purpose</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight drop-shadow-xl font-medium">
              {t('about.hubTitle')}
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans font-light">
              {t('about.hubDesc1')}
            </p>
            
            <MongolianFormalFrame className="bg-slate-900/90 border-brand-gold/30 p-2 shadow-2xl">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop" 
                  alt="Community" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
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
            <MongolianFormalFrame className="bg-slate-900/90 border-brand-gold/30 p-2 shadow-2xl">
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=880&auto=format&fit=crop" 
                  alt="Vision" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>
            </MongolianFormalFrame>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 text-brand-gold">
                <SoyomboSymbol className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold">Bilateral Vision</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight drop-shadow-xl font-medium">
                {t('about.vision.title')}
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans font-light">
                {t('about.vision.desc')}
              </p>
            </div>
          </motion.div>
        </div>

        <MongolianKhasDivider className="max-w-4xl mx-auto my-16 opacity-80" />
      </section>

      {/* Values - Executive Grid */}
      <section className="py-12 md:py-20 px-6 bg-[#0A1128] relative text-white overflow-hidden">
        <EmberBackground />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 md:mb-16 text-center">
            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-extrabold text-brand-gold mb-3">{t('about.values.tag')}</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight drop-shadow-xl">{t('about.values.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('about.values.title'), desc: t('about.values.desc'), icon: <Shield className="w-6 h-6 text-brand-gold" /> },
              { title: t('about.impact.title'), desc: t('about.impact.desc'), icon: <Heart className="w-6 h-6 text-brand-gold" /> },
              { title: t('about.heritage'), desc: t('about.founded'), icon: <Users className="w-6 h-6 text-brand-gold" /> }
            ].map((value, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="executive-card-dark p-8 md:p-10 relative overflow-hidden group"
              >
                <div className="w-14 h-14 rounded-xl border border-brand-gold/40 bg-slate-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif mb-4 text-white font-semibold">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed font-sans text-sm font-light">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Executive Grid */}
      <section className="py-12 md:py-20 px-6 bg-[#050B14] relative text-white overflow-hidden border-t border-brand-gold/15">
        <EmberBackground />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 md:mb-16 text-center md:text-left">
            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-extrabold text-brand-gold mb-3">{t('about.benefitsSection.tag')}</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight drop-shadow-xl">{t('about.benefitsSection.title')}</h2>
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-sans font-light max-w-3xl">
              {t('about.benefitsSection.desc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                title: t('about.benefitsSection.items.networking.title'), 
                desc: t('about.benefitsSection.items.networking.desc'), 
                icon: <Users className="w-5 h-5 text-brand-gold" /> 
              },
              { 
                title: t('about.benefitsSection.items.events.title'), 
                desc: t('about.benefitsSection.items.events.desc'), 
                icon: <Star className="w-5 h-5 text-brand-gold" /> 
              },
              { 
                title: t('about.benefitsSection.items.visibility.title'), 
                desc: t('about.benefitsSection.items.visibility.desc'), 
                icon: <Sparkles className="w-5 h-5 text-brand-gold" /> 
              },
              { 
                title: t('about.benefitsSection.items.insights.title'), 
                desc: t('about.benefitsSection.items.insights.desc'), 
                icon: <Shield className="w-5 h-5 text-brand-gold" /> 
              },
              { 
                title: t('about.benefitsSection.items.advocacy.title'), 
                desc: t('about.benefitsSection.items.advocacy.desc'), 
                icon: <Send className="w-5 h-5 text-brand-gold" /> 
              },
              { 
                title: t('about.benefitsSection.items.mentorship.title'), 
                desc: t('about.benefitsSection.items.mentorship.desc'), 
                icon: <Heart className="w-5 h-5 text-brand-gold" /> 
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="executive-card-dark p-8 relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-xl border border-brand-gold/30 bg-slate-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-white font-semibold">{benefit.title}</h3>
                <p className="text-slate-300 leading-relaxed font-sans text-xs md:text-sm font-light">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Executive Portraits */}
      <section className="py-12 md:py-20 px-6 bg-[#0B132B] relative overflow-hidden text-white border-t border-brand-gold/15">
        <EmberBackground />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-extrabold text-brand-gold">{t('about.team.tag')}</span>
              <div className="h-px w-10 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight drop-shadow-xl">{t('about.team.title')}</h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-serif italic">
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
                  <MongolianFormalFrame className="bg-slate-900/90 border-brand-gold/40 p-2 hover:border-brand-gold transition-all duration-300">
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
                        <div className="px-3 py-1 border border-brand-gold/40 rounded-md bg-slate-900/90 w-max">
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

      {/* Join Us Section - Executive Application Suite */}
      <section className="py-12 md:py-20 px-6 bg-[#050B14] relative overflow-hidden text-white border-t border-brand-gold/15">
        <EmberBackground />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-6 border border-brand-gold/30 px-5 py-1.5 rounded-full bg-slate-900/80">
              <Heart className="text-brand-gold" size={14} fill="currentColor" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-brand-gold">{t('about.join.tag')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-2xl">
              {t('about.join.title')} <span className="italic text-brand-gold font-light">{t('about.join.titleItalic')}</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-sans font-light max-w-2xl mx-auto">
              {t('about.join.desc')}
            </p>
          </div>

          <MongolianFormalFrame className="bg-slate-900/90 border-brand-gold/40 p-8 md:p-12 shadow-2xl">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 relative z-10"
              >
                <div className="w-20 h-20 bg-brand-gold/20 border border-brand-gold/40 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
                  <Heart size={40} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-serif mb-3 text-white">Application Submitted</h3>
                <p className="text-slate-300 text-base">We've received your application and will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold/80">{t('about.join.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all text-sm"
                      placeholder="e.g. Saran"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold/80">{t('about.join.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all text-sm"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-gold/80">{t('about.join.form.reason')}</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none text-sm"
                    placeholder="I'd love to help with..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-gold text-slate-950 hover:bg-amber-400 px-8 py-4.5 rounded-xl text-xs uppercase tracking-[0.2em] font-extrabold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group mt-2"
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
