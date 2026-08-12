import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Gamepad2, ArrowRight, BookOpen, ShieldAlert, Calendar, Heart, Award, Star } from 'lucide-react';
import LetsPlayGame from '../components/game/LetsPlayGame';
import Artifact3DExplorer from '../components/diorama/Artifact3DExplorer';
import { SoyomboSymbol, UlziiSymbol } from '../components/MongolianDesign';

export default function Heritage() {
  const { t } = useTranslation();
  const [showGame, setShowGame] = useState(false);

  // Timeline events data
  const timelineEvents = [
    {
      year: '1206',
      title: t('heritage.timeline.1206.title', 'Foundation of the Mongol Empire'),
      desc: t('heritage.timeline.1206.desc', 'Chinggis Khan unified the nomadic tribes, establishing the Great Mongol Empire. This era fostered the Pax Mongolica, enabling safe transcontinental trade and early cultural exchange along the Silk Road.')
    },
    {
      year: '1963',
      title: t('heritage.timeline.1963.title', 'Establishment of Diplomatic Relations'),
      desc: t('heritage.timeline.1963.desc', 'The Republic of Austria and Mongolia officially established diplomatic relations, paving the way for bilateral academic, economic, and cultural partnerships that continue to flourish today.')
    },
    {
      year: '2026',
      title: t('heritage.timeline.2026.title', 'Founding of the Mongolian Center in Vienna'),
      desc: t('heritage.timeline.2026.desc', 'Established as a registered NGO (Verein) to serve as a cultural bridge, offering integration support, traditional arts education, and bilateral networking hubs in Central Europe.')
    }
  ];

  // UNESCO Heritage items
  const unescoItems = [
    {
      title: t('heritage.unesco.morinKhuur.title', 'Morin Khuur (Horsehead Fiddle)'),
      desc: t('heritage.unesco.morinKhuur.desc', 'A traditional two-stringed fiddle featuring a carved horse head. Recognized by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity, it is the soul of Mongolian music, symbolizing the connection between horse and nomad.'),
      image: 'https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: t('heritage.unesco.deel.title', 'The Traditional Deel'),
      desc: t('heritage.unesco.deel.desc', 'Mongolia\'s traditional wear suited for nomadic life. Double-breasted, with a high collar and sash, it functions as a coat, blanket, and riding wear, adapted dynamically across seasons and regions.'),
      image: 'https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: t('heritage.unesco.naadam.title', 'Naadam Festival Sports'),
      desc: t('heritage.unesco.naadam.desc', 'The three manly games: Bökh (wrestling), archery, and horse racing. Naadam represents centuries of nomadic martial training, community cohesion, and spiritual reverence for nature.'),
      image: 'https://images.unsplash.com/photo-1749704492960-c17ed9b91db5?q=80&w=600&auto=format&fit=crop'
    }
  ];

  // Calligraphy phrases
  const calligraphyPhrases = [
    { cyrillic: 'Найрамдал', scriptName: 'Nayramdal', translation: 'Friendship / Freundschaft', meaning: 'The foundational bond linking Austria and Mongolia.' },
    { cyrillic: 'Соёл', scriptName: 'Soyol', translation: 'Culture / Kultur', meaning: 'The heritage and traditions we protect and share.' },
    { cyrillic: 'Эв нэгдэл', scriptName: 'Ev Negdel', translation: 'Unity / Einigkeit', meaning: 'The spirit of community integration and mutual support.' }
  ];

  return (
    <div className="pt-20 bg-brand-paper min-h-screen">
      {/* Page Header */}
      <section className="relative py-24 px-6 bg-brand-ink text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1200&auto=format&fit=crop" 
            alt="Mongolian Steppe landscape" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">
                {t('heritage.tag', 'Preservation & Education')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
              {t('heritage.title', 'Cultural')} <span className="italic text-brand-gold font-light">{t('heritage.titleItalic', 'Heritage')}</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-2xl font-light leading-relaxed">
              {t('heritage.desc', 'The Mongolian Center in Vienna leverages modern interactive technology to showcase, preserve, and teach traditional Mongolian customs, historical milestones, and nomadic lifestyles.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Showcase Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-brand-ink/5">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: 3D Diorama CTA */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-brand-ink/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-brand-ink mb-4 font-normal">
                {t('heritage.dioramaTitle', 'Interactive 3D Nomadic Diorama')}
              </h3>
              <p className="text-brand-ink/70 font-light leading-relaxed mb-6 text-sm md:text-base">
                {t('heritage.dioramaDesc', 'Step inside an immersive 3D digital model of traditional nomadic life. Explore detailed historical vignettes including the Nine White Banners, imperial yurt layouts, and herding camps. Built with professional rendering tools to make historical learning interactive and accessible.')}
              </p>
              
              <div className="bg-brand-paper/50 rounded-2xl p-5 mb-8 border border-brand-ink/5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/70 mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-brand-gold" />
                  {t('heritage.featuresTitle', 'Vignettes to Discover:')}
                </h4>
                <ul className="space-y-2 text-xs text-brand-ink/60">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span>{t('heritage.feat1', 'The Imperial Court Structure')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span>{t('heritage.feat2', 'Traditional Nomadic Ger (Yurt)')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span>{t('heritage.feat3', 'Nine White State Banners')}</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/diorama" 
                className="group w-full inline-flex items-center justify-center gap-3 bg-brand-ink text-white px-6 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-300 border border-brand-ink/10"
              >
                <SoyomboSymbol className="w-4 h-4 text-brand-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>{t('heritage.launchDiorama', 'Launch 3D Explorer')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Educational Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-brand-gold/5 rounded-3xl p-6 border border-brand-gold/20 flex gap-4"
            >
              <ShieldAlert className="text-brand-gold shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-brand-ink mb-1">
                  {t('heritage.eduNoteTitle', 'Educational Resource')}
                </h4>
                <p className="text-xs text-brand-ink/75 leading-relaxed">
                  {t('heritage.eduNoteDesc', 'These digital tools are developed for schools, universities, and cultural institutes to enable a hands-on learning experience of Central Asian history and bilateral integration.')}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Mini-Game Container */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-brand-ink/5 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 sm:mb-0">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif text-brand-ink mt-2 font-normal">
                    {t('heritage.gameTitle', 'Steppe Runner Mini-Game')}
                  </h3>
                  <p className="text-xs text-brand-ink/50 mt-1">
                    {t('heritage.gameSub', 'Immersive Educational Endless Runner')}
                  </p>
                </div>
                {!showGame && (
                  <button 
                    onClick={() => setShowGame(true)}
                    className="self-start sm:self-center bg-brand-ink text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold hover:bg-brand-gold transition-colors whitespace-nowrap"
                  >
                    {t('heritage.startGame', 'Start Game')}
                  </button>
                )}
              </div>

              <p className="text-brand-ink/70 font-light leading-relaxed mb-6 text-sm">
                {t('heritage.gameDesc', 'Take a moment to enjoy a lightweight, culturally immersive endless runner. Collect traditional artifacts like bow and arrow, shields, and horses, while exploring stylized infinite Mongolian landscapes. Compete with others and test your agility.')}
              </p>

              {showGame ? (
                <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-brand-ink/10 shadow-inner">
                  <LetsPlayGame />
                </div>
              ) : (
                <div 
                  className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center cursor-pointer group"
                  onClick={() => setShowGame(true)}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" 
                    alt="Mongolian steppe background preview" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors" />
                  
                  <div className="relative z-10 p-6 flex flex-col items-center max-w-sm">
                    <Gamepad2 className="w-16 h-16 text-brand-gold animate-pulse mb-6" />
                    <h4 className="text-white text-lg font-serif mb-2">
                      {t('heritage.previewTitle', 'Ready to explore the steppe?')}
                    </h4>
                    <p className="text-white/60 text-xs font-light leading-relaxed mb-6">
                      {t('heritage.previewSub', 'Click to load and play directly inside your browser. Desktop controls: SPACE to jump, mobile controls: tap screen.')}
                    </p>
                    <span className="bg-brand-gold text-brand-ink px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg group-hover:bg-white transition-colors">
                      {t('heritage.playCta', 'Load Interactive Runner')}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* Historical Timeline Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-brand-ink/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">
            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Bilateral Chronology</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-ink font-normal">
            Echoes of <span className="italic text-brand-gold">History</span>
          </h2>
          <p className="text-brand-ink/50 max-w-xl mx-auto font-light mt-3 text-sm leading-relaxed">
            Trace the path from nomadic empire administration to formal diplomatic and cultural cooperation in the heart of Vienna.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
          {/* Vertical line connector */}
          <div className="absolute left-[16px] md:left-1/2 top-0 bottom-0 w-px bg-brand-ink/5 -translate-x-1/2" />
          
          <div className="space-y-12">
            {timelineEvents.map((evt, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={evt.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row relative items-start md:items-center"
                >
                  {/* Timeline point */}
                  <div className="absolute left-[-16px] md:left-1/2 w-8 h-8 rounded-full border-2 border-brand-gold bg-brand-paper flex items-center justify-center -translate-x-1/2 z-10 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-ink" />
                  </div>
                  
                  {/* Left spacer for desktop */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-12 md:text-right ${isEven ? 'order-1' : 'order-1 md:order-2 md:pl-12 md:pr-0 md:text-left'}`}>
                    <div className="bg-white border border-brand-ink/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                      <span className="font-serif text-3xl md:text-4xl text-brand-gold font-bold block mb-2">
                        {evt.year}
                      </span>
                      <h4 className="text-base font-semibold text-brand-ink mb-2">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-brand-ink/65 leading-relaxed font-light">
                        {evt.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right empty placeholder for alignment */}
                  <div className="hidden md:block w-1/2 order-2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UNESCO Intangible Heritage Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-brand-ink/5 bg-brand-cream/30">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">
            <Award className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Intangible Heritage</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-ink font-normal">
            UNESCO <span className="italic text-brand-gold">Living Heritage</span>
          </h2>
          <p className="text-brand-ink/50 max-w-xl mx-auto font-light mt-3 text-sm leading-relaxed">
            Exploring the artistic and customary expressions preserved and shared by the Mongolian Center.
          </p>
        </div>

        {/* Interactive 3D 360 Artifact Inspector */}
        <div className="mb-16">
          <Artifact3DExplorer />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {unescoItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative border-b border-brand-ink/5">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h4 className="text-lg font-serif font-normal text-brand-ink mb-3">
                    {item.title}
                  </h4>
                  <p className="text-xs text-brand-ink/65 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-ink/5 flex justify-end">
                  <Star className="w-4 h-4 text-brand-gold" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Traditional Calligraphy & Script Corner */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-brand-ink/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-2 mb-4 bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20 w-fit">
              <Star className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Mongolian Calligraphy</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-ink font-normal mb-6 leading-tight">
              Traditional <span className="italic text-brand-gold">Vertical Script</span>
            </h2>
            <p className="text-brand-ink/75 font-light leading-relaxed text-sm md:text-base mb-6">
              Written from top-to-bottom and left-to-right, the classical Mongolian script (*Bichig*) is a symbol of nomadic identity dating back to the 13th century. Unlike other vertical scripts of East Asia, it flows continuously and is highly calligraphic. In 2013, UNESCO added it to the List of Intangible Cultural Heritage in Need of Urgent Safeguarding.
            </p>
            <p className="text-brand-ink/60 font-light leading-relaxed text-xs">
              Through the Mongolian Center, we host calligraphy workshops in Vienna to teach the stroke methods, pen styles, and calligraphic compositions of this ancient writing system.
            </p>
          </div>

          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-brand-ink/5 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-stretch"
            >
              {/* Calligraphy sample cards */}
              <div className="flex-grow flex flex-col justify-between space-y-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-brand-ink/65 mb-2">
                  Key Calligraphy Phrases
                </h4>
                <div className="space-y-4">
                  {calligraphyPhrases.map((phrase, i) => (
                    <div key={phrase.cyrillic} className="p-4 bg-brand-paper/50 rounded-2xl border border-brand-ink/5 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-brand-ink text-sm">{phrase.cyrillic}</span>
                          <span className="text-brand-ink/40 text-xs">({phrase.scriptName})</span>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                          {phrase.translation}
                        </div>
                        <p className="text-xs text-brand-ink/50 font-light">
                          {phrase.meaning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic visual script placeholder */}
              <div className="w-full md:w-48 bg-brand-ink text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0 border border-brand-gold/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
                <UlziiSymbol className="w-8 h-8 text-brand-gold/40 mb-8" />
                
                {/* Traditional vertical script text box graphic */}
                <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-8 relative">
                  <div className="font-serif text-brand-gold text-2xl font-light w-6 text-center select-none" style={{ writingMode: 'vertical-lr' }}>
                    ᠮᠣᠩᠣᠯ ᠪᠢᠴᠢᠭ
                  </div>
                  <div className="w-px bg-white/20 h-24" />
                  <div className="font-serif text-white text-lg font-light w-6 text-center select-none" style={{ writingMode: 'vertical-lr' }}>
                    ᠬᠠᠮᠲᠤ ᠵᠢᠡᠷ
                  </div>
                </div>
                
                <span className="text-[8px] uppercase tracking-widest font-bold text-brand-gold mt-8 block">
                  Bichig Calligraphy
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Community Workshops Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">
            <Heart className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Local Programs</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-ink font-normal">
            Community <span className="italic text-brand-gold">Workshops</span>
          </h2>
          <p className="text-brand-ink/50 max-w-xl mx-auto font-light mt-3 text-sm leading-relaxed">
            Join our integration events in Vienna, designed to foster cross-cultural literacy, language development, and mutual exchange.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: t('heritage.workshops.calligraphy.title', 'Traditional Script Classes'),
              desc: t('heritage.workshops.calligraphy.desc', 'Weekly calligraphy sessions hosted by skilled artists. Learn basic brush stroke structures, calligraphy layouts, and create your own artwork on traditional paper.'),
              schedule: 'Every Saturday, 14:00 - 16:00',
              location: 'MCA Center, Vienna'
            },
            {
              title: t('heritage.workshops.music.title', 'Morin Khuur & Folk Song'),
              desc: t('heritage.workshops.music.desc', 'Introductory courses to playing the Morin Khuur fiddle and throat singing (Khöömei). Suitable for both beginners and local Austrian music students interested in folk acoustics.'),
              schedule: 'Every Wednesday, 18:30 - 20:30',
              location: 'MCA Music Hall, Vienna'
            },
            {
              title: t('heritage.workshops.language.title', 'German-Mongolian Language Hub'),
              desc: t('heritage.workshops.language.desc', 'A conversation exchange hub helping Mongolian immigrants practice German, while Austrian members learn colloquial Mongolian vocabulary and travel phrases.'),
              schedule: 'Every Tuesday, 19:00 - 21:00',
              location: 'Vienna Public Library Room 4'
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-brand-ink/5 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gold/20 group-hover:bg-brand-gold transition-colors" />
              <div>
                <h4 className="text-lg font-serif text-brand-ink mb-3 font-normal">
                  {item.title}
                </h4>
                <p className="text-xs text-brand-ink/65 leading-relaxed font-light mb-6">
                  {item.desc}
                </p>
              </div>
              
              <div className="mt-auto pt-6 border-t border-brand-ink/5 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-brand-ink/60">
                  <span className="font-semibold">Schedule:</span>
                  <span>{item.schedule}</span>
                </div>
                <div className="flex items-center justify-between text-brand-gold font-bold">
                  <span>Location:</span>
                  <span>{item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
