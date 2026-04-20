import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ArrowRight, Calendar, Palette, Heart, Users, Shield, Sword, Clock, MapPin, Loader2, Info, Star, Handshake, Lightbulb, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, MongolianLine, SoyomboSymbol, ArcherSymbol } from '../components/MongolianDesign';
import { db, collection, onSnapshot, query, orderBy, limit, handleFirestoreError, OperationType } from '../firebase';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euActiveLogo from '../assets/media/euactivelogo.png';
import amoxLogo from '../assets/media/amoxlogo.png';
import mcaLogo from '../assets/media/mcalogo.png';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[95vh] flex items-center px-6 overflow-hidden bg-brand-paper">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-paper via-brand-paper/80 to-transparent z-10" />
          <img 
            src="https://plus.unsplash.com/premium_photo-1692895424097-a195cfa8a0c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Steppe" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle Mongolian Design Accents */}
          <div className="absolute top-40 right-40 opacity-[0.03] rotate-12">
            <UlziiSymbol className="w-[800px] h-[800px] text-brand-gold" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full z-20 relative py-20 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col">
              <div className="flex items-start gap-6 md:gap-0">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <div className="h-px w-12 bg-brand-gold/40 -mt-[52px]" />
                      <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold -mt-[52px]">
                        {t('hero.tag')}
                      </span>
                    </div>
                    <h1 className={cn(
                      "font-serif font-normal mb-8 md:mb-10 tracking-tight text-brand-ink md:whitespace-nowrap -mt-[26px] md:mt-0",
                      "text-[30px] leading-[36px] -mr-[74px]",
                      "md:text-5xl lg:text-6xl xl:text-[80px] md:leading-[1.1] md:mr-0"
                    )}>
                      {t('hero.title')} <br />
                      <span className="italic text-brand-gold font-light">{t('hero.titleItalic')}</span>
                    </h1>
                    <p className="text-[12px] md:text-base lg:text-lg text-brand-ink/60 max-w-2xl mb-10 md:mb-12 leading-relaxed font-normal -mr-[39px] md:mr-0 -mt-[6px] md:mt-0 pt-0">
                      {t('hero.subtitle')}
                    </p>
                  </motion.div>
                </div>

                {/* Official Plaque - Vertical Mongolian Script Style (Mobile) */}
                <div className="lg:hidden relative flex-shrink-0 pt-12 -z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: 1, 
                      y: [0, -8, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative flex flex-col items-center p-4 py-16 border border-brand-gold/30 bg-white/60 backdrop-blur-xl rounded-full shadow-xl overflow-hidden min-w-[100px] -mt-[89px] ml-[23px] -mr-[15px] h-[400px]"
                  >
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                      <UlziiSymbol className="w-full h-full text-brand-gold scale-150" />
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                      {/* Top Badge as part of flex flow */}
                      <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-white text-[10px] shadow-lg z-10 border border-white mb-4">
                        🇲🇳
                      </div>
                      
                      <div className="flex flex-col items-center gap-0.5 mb-4">
                        <span className="text-[5px] uppercase tracking-[0.3em] text-brand-ink/40 font-bold">Est. 2026</span>
                        <div className="h-10 w-px bg-brand-gold/30" />
                      </div>

                      <h2 
                        className="text-4xl md:text-5xl font-serif text-brand-gold text-center tracking-tighter leading-none relative"
                        style={{ writingMode: 'vertical-lr' }}
                      >
                        <span className="relative z-10">ᠮᠣᠩᠣᠯ ᠲᠥᠸ</span>
                        {/* Text Shimmer Effect */}
                        <motion.div 
                          animate={{ top: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent pointer-events-none z-20"
                          style={{ mixBlendMode: 'overlay' }}
                        />
                      </h2>

                      <div className="h-10 w-px bg-brand-gold/30 mt-4" />
                      
                      {/* Bottom Seal as part of flex flow */}
                      <div className="w-6 h-6 bg-brand-ink rounded-full flex items-center justify-center text-brand-gold text-[10px] shadow-lg border border-brand-gold mt-4">
                        <UlziiSymbol className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-col sm:flex-row flex-wrap xl:flex-nowrap gap-3 md:gap-4 -mt-[28px] relative z-20"
              >
                <Link to="/events" className="w-full sm:w-auto flex-1 text-center bg-brand-ink text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:bg-brand-gold transition-all shadow-xl group whitespace-nowrap">
                  {t('hero.ctaEvents')}
                </Link>
                <Link to="/diorama" className="w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-brand-gold to-amber-600 text-white px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all shadow-xl flex items-center justify-center gap-2 group border border-amber-400/30 whitespace-nowrap">
                  <SoyomboSymbol className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-12 transition-transform duration-300" />
                  Explore 3D
                </Link>
                <Link to="/about" className="w-full sm:w-auto flex-1 text-center border border-brand-ink/20 px-8 py-4 rounded-full text-xs uppercase tracking-[0.1em] font-medium hover:border-brand-gold hover:text-brand-gold transition-all whitespace-nowrap">
                  {t('hero.ctaStory')}
                </Link>
              </motion.div>
            </div>

            {/* Official Plaque - Vertical Mongolian Script Style (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative min-h-[600px] w-full py-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -12, 0],
                  rotateZ: [0, 0.5, 0, -0.5, 0]
                }}
                transition={{ 
                  opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative flex flex-col items-center p-10 py-20 border-[1px] border-brand-gold/30 bg-white/40 backdrop-blur-3xl rounded-full shadow-[0_50px_90px_-20px_rgba(0,0,0,0.12)] group overflow-hidden min-w-[280px] h-fit mt-16"
              >
                {/* Upgraded Stable Glow Effect */}
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.2),transparent_70%)] pointer-events-none"
                />
                
                {/* Secondary Pulsing Rim Light */}
                <motion.div 
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute inset-0 border-2 border-brand-gold/30 rounded-full pointer-events-none"
                />

                {/* Dynamic Light Sweep */}
                <motion.div 
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none z-10"
                />

                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-[4s]">
                  <UlziiSymbol className="w-full h-full text-brand-gold" />
                </div>

                <div className="flex flex-col items-center relative z-10">
                  {/* Top Badge as part of flex flow */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center text-white text-5xl shadow-2xl z-20 border-4 border-white cursor-pointer mb-6"
                  >
                    🇲🇳
                  </motion.div>
                  
                  {/* Horizontal Established Text with Border */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="px-4 py-1.5 border border-brand-gold/20 rounded-md bg-white/30 backdrop-blur-sm">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-brand-ink/60 font-bold">Established 2026</span>
                    </div>
                    <div className="h-12 w-px bg-brand-gold/20" />
                  </div>

                  {/* Main Vertical Title with Shimmer */}
                  <div className="relative">
                    <h2 
                      className="text-6xl md:text-9xl lg:text-[180px] font-serif text-brand-gold text-center tracking-tighter leading-none select-none relative z-10"
                      style={{ writingMode: 'vertical-lr' }}
                    >
                      ᠮᠣᠩᠣᠯ ᠲᠥᠸ
                    </h2>
                    {/* Text Light Sweep */}
                    <motion.div 
                      animate={{ top: ['-100%', '200%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-transparent pointer-events-none z-20"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  </div>
                  
                  {/* Bottom Accents and Seal */}
                  <div className="flex flex-col items-center gap-5 mt-4">
                    <div className="h-12 w-px bg-brand-gold/20" />
                    <div className="px-6 py-2 border border-brand-gold/20 rounded-full bg-white/50">
                      <span className="text-xs uppercase tracking-[0.6em] text-brand-gold font-bold">Official</span>
                    </div>
                    
                    {/* Bottom Seal as part of flex flow */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 bg-brand-ink rounded-full flex items-center justify-center text-brand-gold shadow-2xl z-20 border-4 border-white mt-5"
                    >
                      <UlziiSymbol className="w-16 h-16" />
                    </motion.div>
                  </div>
                </div>

                {/* Modern Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee Section - Corporate Refactor */}
      <section className="py-10 md:py-12 bg-gray-50 relative overflow-hidden border-y border-gray-200">
        <div className="text-center mb-10 relative z-20">
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Our partners & sponsors
          </h3>
          <div className="w-12 h-0.5 bg-brand-gold/50 mx-auto mt-4" />
        </div>

        {/* Gradient Fades for Smooth Edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-hidden relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            className="flex w-max relative z-20"
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                {[
                  { name: 'Deutschothek Sprachschule', isImg: true, src: deutschotekLogo },
                  { name: 'Verein für aktiv Leben und Bildung', isImg: true, src: euActiveLogo },
                  { name: 'Verein der mongolischen StudentInnen in Österreich', isImg: true, src: amoxLogo },
                  { name: 'MCA', isImg: true, src: mcaLogo },
                ].map((partner, idx) => (
                  <div key={`${groupIndex}-${idx}`} className="flex flex-col items-center gap-4 group cursor-pointer opacity-80 hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center justify-center h-12 md:h-16 min-w-[140px] md:min-w-[160px] group-hover:-translate-y-1 transition-transform duration-500 will-change-transform">
                      {partner.isImg ? (
                        <img 
                          src={partner.src} 
                          alt={partner.name} 
                          className="h-full w-auto object-contain" 
                        />
                      ) : (
                        partner.icon
                      )}
                    </div>
                    <span className="font-sans font-semibold text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap text-gray-400 group-hover:text-brand-ink transition-colors duration-500">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pillars Section - Redesigned for Prestige & Impact */}
      <section className="py-24 md:py-40 px-6 bg-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-[90px] md:mb-[90px] -mt-[80px]"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">Our Foundation</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight text-brand-ink">
              The Three <span className="italic text-brand-gold">Pillars</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-0 border-0 md:border border-brand-ink/5 rounded-3xl md:rounded-[60px] overflow-hidden md:shadow-2xl">
            {[
              {
                title: t('pillars.community.title'),
                desc: t('pillars.community.desc'),
                image: "https://images.unsplash.com/photo-1749704492960-c17ed9b91db5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                number: "01",
                link: "/events",
                accent: "bg-brand-gold"
              },
              {
                title: t('pillars.arts.title'),
                desc: t('pillars.arts.desc'),
                image: "https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=1000&auto=format&fit=crop",
                number: "02",
                link: "/gallery",
                accent: "bg-brand-indigo"
              },
              {
                title: t('pillars.impact.title'),
                desc: t('pillars.impact.desc'),
                image: "https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                number: "03",
                link: "/impact",
                accent: "bg-brand-gold"
              }
            ].map((pillar, idx) => (
              <Link
                key={idx}
                to={pillar.link}
                className="group relative h-[400px] md:h-[600px] overflow-hidden border-r last:border-r-0 border-brand-ink/5 rounded-3xl md:rounded-none block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: idx * 0.2 }}
                  className="h-full w-full"
                >
                  <img 
                    src={pillar.image} 
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/70 group-hover:bg-brand-ink/30 transition-all duration-700" />
                  
                  {/* Hover Accent Line */}
                  <div className={cn("absolute top-0 left-0 right-0 h-0 group-hover:h-2 transition-all duration-500 z-20", pillar.accent)} />

                  <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-between text-white z-10">
                    <div className="flex justify-between items-start">
                      <span className="font-serif text-6xl md:text-9xl opacity-20 group-hover:opacity-100 group-hover:text-brand-gold transition-all duration-700 font-black">{pillar.number}</span>
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-4xl md:text-6xl font-serif mb-6 md:mb-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">{pillar.title}</h3>
                      <p className="text-lg md:text-xl text-white/60 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-12 group-hover:translate-y-0 transition-all duration-700 delay-100 max-w-md font-light">
                        {pillar.desc}
                      </p>
                      <div className="mt-10 h-px w-0 group-hover:w-full bg-brand-gold/50 transition-all duration-1000 delay-200" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Preview - Dynamic List */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24 -mt-[80px]">
            <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('highlight.tag')}</span>
              <div className="h-px w-12 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-7xl font-serif leading-tight text-brand-ink mb-8">
              {t('highlight.title')} <br />
              <span className="italic text-brand-gold">{t('highlight.titleItalic')}</span>
            </h2>
            <Link to="/events" className="inline-flex items-center gap-4 text-brand-ink font-bold text-xs uppercase tracking-[0.3em] group">
              {t('highlight.cta')}
              <div className="w-10 h-10 md:w-12 md:h-12 border border-brand-ink/10 rounded-full flex items-center justify-center group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 -mt-[50px]">
              <Loader2 className="animate-spin text-brand-gold" size={40} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 -mt-[50px]">
              {events.map((event, idx) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group bg-white rounded-[40px] overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-700" />
                    
                    {/* Floating Date Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center min-w-[60px]">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">
                        {new Date(event.date).toLocaleDateString(t('common.locale'), { month: 'short' })}
                      </span>
                      <span className="text-2xl font-serif font-bold text-brand-ink">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-6 left-6">
                      <span className="px-4 py-1.5 bg-brand-gold text-brand-ink rounded-full text-[9px] uppercase tracking-[0.2em] font-black shadow-lg">
                        {event.category || t('events.defaultCategory')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-brand-gold">
                        <Star size={14} fill="currentColor" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Featured Event</span>
                      </div>
                      <span className="font-serif text-xl text-brand-ink font-bold">
                        {event.price === 0 ? 'Free' : `€${(event.price / 100).toFixed(2)}`}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-serif text-brand-ink mb-4 group-hover:text-brand-gold transition-colors duration-500 leading-tight">
                      {event.title}
                    </h3>
                    
                    <p className="text-brand-ink/60 font-light leading-relaxed mb-8 line-clamp-3 text-sm">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center gap-4 text-brand-ink/40">
                        <div className="w-8 h-8 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                          <Clock size={14} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold">
                          {event.time || t('events.tba')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-brand-ink/40">
                        <div className="w-8 h-8 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                          <MapPin size={14} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold truncate">
                          {event.location || t('events.vienna')}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/events/${event.id}`}
                      className="mt-10 w-full bg-brand-paper text-brand-ink px-8 py-5 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-brand-ink hover:text-white transition-all duration-500 text-center flex items-center justify-center gap-3 group/btn"
                    >
                      {t('events.viewDetails')} 
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact CTA - Immersive & Urgent */}
      <section className="py-24 md:py-48 px-6 bg-white relative overflow-hidden">
        {/* Subtle Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-paper/50 -skew-x-12 translate-x-1/2 z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand-ink rounded-[60px] md:rounded-[100px] overflow-hidden flex flex-col lg:flex-row shadow-[0_80px_150px_-30px_rgba(0,0,0,0.6)] relative"
          >
            {/* Decorative Symbol Overlay */}
            <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
              <UlziiSymbol className="w-64 h-64 text-brand-gold" />
            </div>

            <div className="lg:w-3/5 p-10 md:p-20 lg:p-28 flex flex-col justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex items-center gap-4 mb-8 md:mb-12"
              >
                <div className="h-px w-12 bg-brand-gold/40" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-bold text-brand-gold">
                  {t('impactCta.tag')}
                </span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 md:mb-14 leading-[0.9] tracking-tight"
              >
                {t('impactCta.title')}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-xl md:text-2xl text-white/50 mb-12 md:mb-16 font-light leading-relaxed max-w-2xl italic"
              >
                {t('impactCta.desc')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Link 
                  to="/impact" 
                  className="group w-full sm:w-fit inline-flex items-center justify-center gap-6 bg-brand-gold text-brand-ink px-14 py-7 rounded-full text-xs uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 shadow-2xl shadow-brand-gold/20"
                >
                  {t('impactCta.cta')}
                  <div className="w-8 h-8 rounded-full bg-brand-ink/10 flex items-center justify-center group-hover:bg-brand-ink group-hover:text-white transition-all">
                    <Heart size={14} fill="currentColor" />
                  </div>
                </Link>
              </motion.div>
            </div>

            <div className="lg:w-2/5 relative min-h-[400px] lg:min-h-full overflow-hidden">
              <motion.div
                initial={{ scale: 1.3, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src="https://plus.unsplash.com/premium_photo-1734713079348-ea48690b11b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Impact" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/40 to-transparent" />
              </motion.div>
              
              {/* Floating Stat Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="absolute bottom-10 right-10 left-10 lg:left-auto lg:w-80 bg-white/10 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] text-white z-20 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-ink shadow-lg">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Community Reach</span>
                </div>
                <div className="font-serif text-5xl mb-4 font-bold">5,000+</div>
                <p className="text-sm text-white/70 font-light leading-relaxed">Lives touched through our cultural and social initiatives in 2024. Your support makes this possible.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
{/* Legacy Section - Immersive Heritage */}
      <section className="py-32 md:py-56 px-6 bg-brand-ink text-white relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 opacity-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1684814833784-c9c8cdba1d20?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Mongolian History" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink via-transparent to-brand-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />
        </div>

        {/* Floating Decorative Elements Removed */}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 md:w-28 md:h-28 border border-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-10 md:mb-14 text-brand-gold bg-brand-gold/5 backdrop-blur-sm"
            >
              <SoyomboSymbol className="w-10 h-10 md:w-14 md:h-14" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-serif mb-10 md:mb-12 tracking-tight leading-[0.9]"
            >
              {t('legacy.title')} <br />
              <span className="italic text-brand-gold font-light">{t('legacy.titleItalic')}</span>
            </motion.h2>

            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mx-auto mb-12 md:mb-16" 
            />

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-2xl md:text-4xl text-white/70 font-serif leading-relaxed max-w-4xl mx-auto italic font-light"
            >
              {t('legacy.quote')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 lg:gap-16">
            {[
              { label: t('legacy.archery'), value: t('legacy.tradition'), icon: <Handshake size={24} /> },
              { label: t('legacy.horsemanship'), value: t('legacy.freedom'), icon: <Lightbulb size={24} /> },
              { label: t('legacy.wrestling'), value: t('legacy.strength'), icon: <ArrowRightLeft size={24} /> },
              { label: t('legacy.wisdom'), value: t('legacy.heritage'), icon: <TrendingUp size={24} /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 + (i * 0.1) }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 md:mb-6 group-hover:bg-brand-gold group-hover:text-brand-ink transition-all duration-500">
                  {item.icon}
                </div>
                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-brand-gold font-bold mb-2 md:mb-4 opacity-70">{item.label}</span>
                <span className="font-serif text-lg md:text-3xl text-white/40 group-hover:text-white transition-colors duration-500">{item.value}</span>
                <div className="mt-4 md:mt-6 w-0 group-hover:w-12 h-px bg-brand-gold transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

          </div>
  );
}
