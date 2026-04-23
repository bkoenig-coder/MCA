import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Users, Sparkles, Send, Star } from 'lucide-react';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol } from '../components/MongolianDesign';
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
  size: Math.random() * 3 + 1, // 1px to 4px
  left: `${Math.random() * 100}%`,
  top: `${10 + Math.random() * 90}%`, // Start mostly below the top
  duration: Math.random() * 5 + 4, // 4 to 9 seconds
  delay: Math.random() * 5, // 0 to 5 seconds delay
  xDrift: (Math.random() - 0.5) * 100, // Drift horizontally
  yDistance: -(Math.random() * 200 + 150), // Distance upwards (negative)
  color: ['bg-orange-500', 'bg-amber-400', 'bg-rose-500', 'bg-yellow-500'][Math.floor(Math.random() * 4)],
  blur: Math.random() > 0.5 ? 'blur-[1px]' : 'blur-[2px]',
}));

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

      {/* Mission & Vision - Cinematic Layout */}
      <section className="py-24 md:py-40 px-6 bg-[#050507] relative overflow-hidden text-white">
        {/* Cinematic Backdrop Pattern & Fire Light */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
          <UlziiSymbol className="w-[800px] h-[800px] text-white absolute -top-[10%] -right-[10%] animate-[spin_200s_linear_infinite]" />
        </div>
        
        {/* Fire Gradient Light */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(234,88,12,0.1)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(190,18,60,0.15)_0%,transparent_70%)] rounded-full blur-[100px] pointer-events-none mix-blend-screen"
        />

        {/* Ember Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {EMBER_PARTICLES.map((p) => (
            <motion.div
              key={`mission-ember-${p.id}`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: [0, p.yDistance * 1.3], x: [0, p.xDrift] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
              className={`absolute rounded-full ${p.color} ${p.blur}`}
              style={{ left: p.left, top: p.top, width: `${p.size}px`, height: `${p.size}px` }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-12 leading-tight drop-shadow-xl">
              {t('about.hubTitle')}
            </h2>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light mb-8 md:mb-12">
              {t('about.hubDesc1')}
            </p>
            <motion.div 
              viewport={{ amount: 0.4 }}
              onViewportEnter={(e) => toggleActive(e, true)}
              onViewportLeave={(e) => toggleActive(e, false)}
              className="aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-brand-gold/10 relative group"
            >
              <div className="absolute inset-0 bg-brand-gold/20 mix-blend-overlay z-10 md:group-hover:bg-transparent max-md:group-[.is-active]:bg-transparent transition-all duration-700" />
              <img 
                src="https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop" 
                alt="Community" 
                className="w-full h-full object-cover scale-105 md:group-hover:scale-100 max-md:group-[.is-active]:scale-100 grayscale md:group-hover:grayscale-0 max-md:group-[.is-active]:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:pt-40 mt-16 md:mt-0 flex flex-col-reverse md:flex-col"
          >
            <motion.div 
               viewport={{ amount: 0.4 }}
               onViewportEnter={(e) => toggleActive(e, true)}
               onViewportLeave={(e) => toggleActive(e, false)}
               className="aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-brand-gold/10 relative group mb-8 md:mb-12 mt-12 md:mt-0"
            >
               <div className="absolute inset-0 bg-brand-gold/20 mix-blend-overlay z-10 md:group-hover:bg-transparent max-md:group-[.is-active]:bg-transparent transition-all duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=880&auto=format&fit=crop" 
                alt="Vision" 
                className="w-full h-full object-cover scale-105 md:group-hover:scale-100 max-md:group-[.is-active]:scale-100 grayscale md:group-hover:grayscale-0 max-md:group-[.is-active]:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-12 leading-tight drop-shadow-xl">
                {t('about.vision.title')}
              </h2>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                {t('about.vision.desc')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values - Cinematic Grid */}
      <section className="py-24 md:py-40 px-6 bg-[#020202] relative text-white overflow-hidden">
        
        {/* Ember Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {EMBER_PARTICLES.map((p) => (
            <motion.div
              key={`values-ember-${p.id}`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: [0, p.yDistance], x: [0, p.xDrift] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
              className={`absolute rounded-full ${p.color} ${p.blur}`}
              style={{ left: p.left, top: p.top, width: `${p.size}px`, height: `${p.size}px` }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-32 text-center md:text-left">
            <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6">{t('about.values.tag')}</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight drop-shadow-xl">{t('about.values.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: t('about.values.title'), desc: t('about.values.desc'), icon: <Shield className="w-8 h-8" /> },
              { title: t('about.impact.title'), desc: t('about.impact.desc'), icon: <Heart className="w-8 h-8" /> },
              { title: t('about.heritage'), desc: t('about.founded'), icon: <Users className="w-8 h-8" /> }
            ].map((value, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                onViewportEnter={(e) => toggleActive(e, true)}
                onViewportLeave={(e) => toggleActive(e, false)}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/5 md:hover:border-orange-500/30 max-md:group-[.is-active]:border-orange-500/30 md:hover:bg-white/10 max-md:group-[.is-active]:bg-white/10 transition-all duration-500 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Fire Glow sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/0 via-orange-500/10 to-amber-400/0 opacity-0 md:group-hover:opacity-100 max-md:group-[.is-active]:opacity-100 transition-opacity duration-1000 blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-10 md:group-hover:scale-110 max-md:group-[.is-active]:scale-110 md:group-hover:bg-gradient-to-tr max-md:group-[.is-active]:bg-gradient-to-tr md:group-hover:from-orange-600 max-md:group-[.is-active]:from-orange-600 md:group-hover:to-amber-500 max-md:group-[.is-active]:to-amber-500 md:group-hover:border-transparent max-md:group-[.is-active]:border-transparent md:group-hover:text-white max-md:group-[.is-active]:text-white md:group-hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] max-md:group-[.is-active]:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all duration-500 bg-[#050507]">
                    {value.icon}
                  </div>
                  <h3 className="text-3xl font-serif mb-6">{value.title}</h3>
                  <p className="text-white/50 leading-relaxed font-light">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Cinematic Portraits */}
      <section className="py-24 md:py-40 px-6 bg-[#050507] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-transparent opacity-80 pointer-events-none" />
        
        {/* Ember Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {EMBER_PARTICLES.map((p) => (
            <motion.div
              key={`team-ember-${p.id}`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.6, 0], y: [0, p.yDistance * 1.5], x: [0, p.xDrift * 1.2] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay + 1 }}
              className={`absolute rounded-full ${p.color} ${p.blur}`}
              style={{ left: p.left, top: p.top, width: `${p.size}px`, height: `${p.size}px` }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-24 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6 block mt-5">{t('about.team.tag')}</span>
              <div className="h-px w-12 bg-brand-gold/40" />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight drop-shadow-xl">{t('about.team.title')}</h2>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light italic">
              "{t('about.team.quote')}"
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                onViewportEnter={(e) => toggleActive(e, true)}
                onViewportLeave={(e) => toggleActive(e, false)}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group relative cursor-pointer block"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative bg-[#020202]">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale opacity-80 md:group-hover:grayscale-0 max-md:group-[.is-active]:grayscale-0 md:group-hover:opacity-100 max-md:group-[.is-active]:opacity-100 md:group-hover:scale-105 max-md:group-[.is-active]:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent opacity-80 md:group-hover:opacity-60 max-md:group-[.is-active]:opacity-60 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Subtle bottom fire glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-orange-600/30 to-transparent mix-blend-overlay opacity-0 md:group-hover:opacity-100 max-md:group-[.is-active]:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  
                  <div className="absolute bottom-10 left-10 right-10 pointer-events-none">
                    <h3 className="text-3xl font-serif text-white mb-3 md:group-hover:text-brand-gold max-md:group-[.is-active]:text-brand-gold transition-colors duration-500 drop-shadow-md">{member.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold/70 md:group-hover:text-brand-gold max-md:group-[.is-active]:text-brand-gold transition-colors duration-500">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section - Cinematic */}
      <section className="py-24 md:py-40 px-6 bg-[#020202] relative overflow-hidden text-white border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />

        {/* Ember Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {EMBER_PARTICLES.map((p) => (
            <motion.div
              key={`join-ember-${p.id}`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: [0, p.yDistance * 1.2], x: [0, p.xDrift] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay + 2 }}
              className={`absolute rounded-full ${p.color} ${p.blur}`}
              style={{ left: p.left, top: p.top, width: `${p.size}px`, height: `${p.size}px` }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-3 mb-8 border border-brand-gold/30 px-6 py-2 rounded-full backdrop-blur-sm"
            >
              <Heart className="text-brand-gold" size={16} fill="currentColor" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('about.join.tag')}</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 drop-shadow-2xl">
              {t('about.join.title')} <span className="italic text-brand-gold">{t('about.join.titleItalic')}</span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto">
              {t('about.join.desc')}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-16 rounded-[40px] bg-white/5 border border-white/5 backdrop-blur-xl relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            {/* Form Fire Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 relative z-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-brand-gold/20 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-gold"
                >
                  <Heart size={48} fill="currentColor" />
                </motion.div>
                <h3 className="text-4xl font-serif mb-4 text-white">Welcome to the family!</h3>
                <p className="text-white/60 text-lg">We've received your application and will be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">{t('about.join.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-5 bg-[#050507]/80 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                      placeholder="e.g. Saran"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">{t('about.join.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-5 bg-[#050507]/80 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">{t('about.join.form.reason')}</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-6 py-5 bg-[#050507]/80 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none"
                    placeholder="I'd love to help with..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white px-8 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4 group mt-4 border border-orange-400/30"
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
