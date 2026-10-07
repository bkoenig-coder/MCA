import React, { useState, Suspense, lazy } from 'react';
import CloudHeader from '../components/CloudHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { 
  Compass, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Calendar, 
  Search, 
  FileText, 
  Maximize2,
  Gamepad2,
  CheckCircle2,
  Loader,
  Sparkles,
  Info,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Overlay } from '../components/diorama/Overlay';
import LazyMount from '../components/LazyMount';

// Heavy parts load only when the visitor scrolls to them
const DioramaCanvas = lazy(() => import('../components/diorama/DioramaCanvas'));
const Artifact3DExplorer = lazy(() => import('../components/diorama/Artifact3DExplorer'));
const LetsPlayGame = lazy(() => import('../components/game/LetsPlayGame'));
import { SoyomboSymbol, UlziiSymbol } from '../components/MongolianDesign';

type HeritageCategory = 'intangible' | 'material' | 'calligraphy' | 'ceremony';

interface HeritageArtifact {
  id: string;
  category: HeritageCategory;
  imageUrl: string;
}

// Display texts come from the translation keys heritagePage.items.<id>.*
const HERITAGE_COLLECTIONS: HeritageArtifact[] = [
  { id: 'mongolian-ger', category: 'material', imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=800&auto=format&fit=crop' },
  { id: 'bichig-script', category: 'calligraphy', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop' },
  { id: 'naadam-festival', category: 'ceremony', imageUrl: 'https://images.unsplash.com/photo-1542642596-f3310061e888?q=80&w=800&auto=format&fit=crop' },
  { id: 'khoomei-throat-singing', category: 'intangible', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { id: 'urtiin-duu', category: 'intangible', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop' },
  { id: 'shagai-shooting', category: 'ceremony', imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=800&auto=format&fit=crop' },
  { id: 'biyelgee-dance', category: 'intangible', imageUrl: 'https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=800&auto=format&fit=crop' }
];

const CATEGORY_LABEL_KEYS: Record<HeritageCategory, string> = {
  intangible: 'heritagePage.modal.categoryIntangible',
  material: 'heritagePage.modal.categoryMaterial',
  calligraphy: 'heritagePage.modal.categoryCalligraphy',
  ceremony: 'heritagePage.modal.categoryCeremony',
};

// Display texts come from the translation keys heritagePage.timeline.<id>.*
const ADVANCED_BILATERAL_CHRONOLOGY = [
  { id: 'early-contact', highlights: ['h1', 'h2'] },
  { id: 'diplomatic-relations', highlights: ['h1'] },
  { id: 'vienna-center', highlights: ['h1', 'h2'] }
];

export default function Heritage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'all' | 'intangible' | 'material' | 'calligraphy' | 'ceremony'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<HeritageArtifact | null>(null);
  const [activeDioramaPopup, setActiveDioramaPopup] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [activeEraId, setActiveEraId] = useState<string>('all');

  const itemKey = (id: string, field: string) => `heritagePage.items.${id}.${field}`;
  const q = searchQuery.trim().toLowerCase();

  const filteredArtifacts = HERITAGE_COLLECTIONS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !q ||
      ['title', 'summary', 'region', 'period', 'materials'].some(field =>
        t(itemKey(item.id, field)).toLowerCase().includes(q)
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen text-slate-900 font-sans selection:bg-brand-gold/30 selection:text-slate-900">
      
      {/* Header */}
      <CloudHeader tag={t('heritagePage.heroBadge')} title={t('heritagePage.heroTitle1')} italic={t('heritagePage.heroTitle2')} subtitle={t('heritagePage.heroIntro')} />

      {/* 2. Interactive 3D Nomadic Diorama Live Preview (AT THE TOP) */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-slate-900">
          
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-900 rounded text-xs uppercase font-mono tracking-widest border border-amber-200/80 font-bold">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {t('heritagePage.diorama.badge')}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-sans">{t('heritagePage.diorama.tag')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
                {t('heritagePage.diorama.title1')} <span className="italic text-[#C5A059] font-light">{t('heritagePage.diorama.title2')}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/diorama"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#0A1128] transition-colors shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t('heritagePage.diorama.openFullscreen')}</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[450px] sm:h-[550px] bg-[#E8EEF5]">
            <LazyMount className="absolute inset-0" placeholder={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E8EEF5] z-20">
                <Loader className="w-8 h-8 text-[#D4AF37] animate-spin mb-3" />
                <p className="text-xs font-mono tracking-widest text-slate-700 uppercase">{t('heritagePage.diorama.loading')}</p>
              </div>
            }>
              <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E8EEF5] z-20">
                <Loader className="w-8 h-8 text-[#D4AF37] animate-spin mb-3" />
                <p className="text-xs font-mono tracking-widest text-slate-700 uppercase">{t('heritagePage.diorama.loading')}</p>
              </div>
              }>
                <DioramaCanvas onSelect={setActiveDioramaPopup} />
              </Suspense>
            </LazyMount>

            <Overlay activePopup={activeDioramaPopup} onClose={() => setActiveDioramaPopup(null)} />

            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-700 font-sans shadow-sm pointer-events-none">
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('heritagePage.diorama.hint')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3D 360° Artifact Inspector */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-slate-900">
          
          {/* Embedded Full-Width Artifact Explorer */}
          <div className="p-4 sm:p-6 lg:p-8 bg-white">
            <LazyMount className="min-h-[420px]">
              <Suspense fallback={<div className="h-[420px] flex items-center justify-center"><Loader className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>}>
                <Artifact3DExplorer />
              </Suspense>
            </LazyMount>
          </div>

        </div>
      </section>

      {/* 4. Classical Vertical Script (Bichig) Archival Corner */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded border border-amber-200/80 text-xs uppercase tracking-[0.14em] font-mono text-amber-900 font-bold">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t('heritagePage.script.badge')}
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-normal leading-tight">
                {t('heritagePage.script.title1')} <br />
                <span className="italic text-[#C5A059] font-light">{t('heritagePage.script.title2')}</span>
              </h2>

              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                {t('heritagePage.script.body')}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  { mn: t('heritagePage.script.phrase1Mn'), script: t('heritagePage.script.phrase1Latin'), en: t('heritagePage.script.phrase1Text') },
                  { mn: t('heritagePage.script.phrase2Mn'), script: t('heritagePage.script.phrase2Latin'), en: t('heritagePage.script.phrase2Text') },
                  { mn: t('heritagePage.script.phrase3Mn'), script: t('heritagePage.script.phrase3Latin'), en: t('heritagePage.script.phrase3Text') },
                ].map(phrase => (
                  <div key={phrase.mn} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-xs font-serif text-slate-900 font-bold block">{phrase.mn}</span>
                    <span className="text-xs text-slate-500 font-mono block mb-1">({phrase.script})</span>
                    <span className="text-[11px] text-slate-600 uppercase tracking-wider">{phrase.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center flex flex-col items-center max-w-xs w-full shadow-sm">
                <UlziiSymbol className="w-8 h-8 text-[#D4AF37] mb-6" color="#D4AF37" />
                
                <div className="flex items-center justify-center gap-6 bg-white border border-[#D4AF37]/40 rounded-lg px-6 py-8 shadow-sm">
                  <div 
                    className="font-serif text-[#0A1128] text-2xl font-semibold tracking-widest select-none drop-shadow-sm"
                    style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
                  >
                    ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ
                  </div>
                  <div className="w-px bg-slate-200 h-28" />
                  <div 
                    className="font-serif text-amber-800 text-lg font-medium tracking-widest select-none"
                    style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
                  >
                    ᠥᠪ ᠰᠣᠶᠣᠯ
                  </div>
                </div>

                <span className="text-xs uppercase font-mono tracking-widest text-[#C5A059] font-bold mt-6">
                  {t('heritagePage.script.caption')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADVANCED AUSTRIAN-MONGOLIAN HISTORICAL RELATIONS TIMELINE */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Timeline Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-200 text-xs uppercase tracking-widest font-mono text-amber-900 font-bold mb-3">
            <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t('heritagePage.history.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-normal">
            {t('heritagePage.history.title1')} <span className="italic text-[#C5A059]">{t('heritagePage.history.title2')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2.5 leading-relaxed">
            {t('heritagePage.history.intro')}
          </p>
        </div>

        {/* Central Alternating Timeline Track */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Central Vertical Spine Line (Gold Gradient with glowing nodes) */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20 md:-translate-x-1/2 pointer-events-none" />

          <div className="space-y-12 md:space-y-16">
            {ADVANCED_BILATERAL_CHRONOLOGY
              .filter(item => activeEraId === 'all' || activeEraId === item.id)
              .map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative flex flex-col md:flex-row items-start md:items-center"
                  >
                    {/* Glowing Central Milestone Node */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0A1128] border-2 border-[#D4AF37] flex items-center justify-center z-10 shadow-md">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    </div>

                    {/* Left Side Content Container */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isEven ? 'md:pr-12 md:text-right' : 'md:order-2 md:pl-12 md:text-left'
                    }`}>
                      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all group">
                        
                        {/* Milestone Top Metadata Bar */}
                        <div className={`flex flex-wrap items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <span className="px-2.5 py-0.5 bg-[#0A1128] text-white rounded text-xs font-mono font-bold tracking-wider">
                            {t(`heritagePage.timeline.${event.id}.badge`)}
                          </span>
                          <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                            {t(`heritagePage.timeline.${event.id}.category`)}
                          </span>
                        </div>

                        {/* Year Display with Serif Typography */}
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight block mb-1">
                          {t(`heritagePage.timeline.${event.id}.year`)}
                        </span>

                        <h3 className="text-base sm:text-lg font-serif font-semibold text-[#0A1128] mb-1 leading-snug">
                          {t(`heritagePage.timeline.${event.id}.title`)}
                        </h3>

                        <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
                          {t(`heritagePage.timeline.${event.id}.desc`)}
                        </p>

                        {/* Key Highlight Chips */}
                        <div className={`pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          {event.highlights.map((h, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs text-slate-600 font-sans">
                              <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                              <span>{t(`heritagePage.timeline.${event.id}.${h}`)}</span>
                            </span>
                          ))}
                        </div>

                        {/* Location footnote */}
                        <div className={`mt-3 pt-2 text-xs font-mono text-slate-400 flex items-center gap-1.5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <Landmark className="w-3 h-3 text-slate-400" />
                          <span>{t(`heritagePage.timeline.${event.id}.location`)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Spacer for desktop grid layout */}
                    <div className={`hidden md:block w-1/2 ${isEven ? 'order-2' : 'order-1'}`} />
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 6. Registered Living Heritage & Material Collections (AT THE BOTTOM BEFORE GAME) */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">{t('heritagePage.collection.label')}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{t('heritagePage.collection.count', { count: filteredArtifacts.length })}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-medium">
              {t('heritagePage.collection.title')}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-1">
              {t('heritagePage.collection.subtitle')}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('heritagePage.collection.searchPlaceholder')}
              aria-label={t('heritagePage.collection.searchLabel')}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#D4AF37] text-slate-800 placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full pb-4 mb-8 custom-scrollbar">
          {[
            { id: 'all', label: t('heritagePage.collection.tabAll'), count: HERITAGE_COLLECTIONS.length },
            { id: 'intangible', label: t('heritagePage.collection.tabIntangible'), count: HERITAGE_COLLECTIONS.filter(x => x.category === 'intangible').length },
            { id: 'material', label: t('heritagePage.collection.tabMaterial'), count: HERITAGE_COLLECTIONS.filter(x => x.category === 'material').length },
            { id: 'calligraphy', label: t('heritagePage.collection.tabCalligraphy'), count: HERITAGE_COLLECTIONS.filter(x => x.category === 'calligraphy').length },
            { id: 'ceremony', label: t('heritagePage.collection.tabCeremony'), count: HERITAGE_COLLECTIONS.filter(x => x.category === 'ceremony').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeCategory === tab.id
                  ? 'bg-[#0A1128] text-white shadow-sm'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === tab.id ? 'bg-[#D4AF37] text-[#0A1128] font-bold' : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtifacts.map((artifact) => (
            <motion.article 
              key={artifact.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-900 border-b border-slate-100">
                <img 
                  src={artifact.imageUrl} 
                  alt={t(itemKey(artifact.id, 'title'))}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-500/90 text-slate-900 font-bold rounded text-xs font-mono">
                    {t('heritagePage.collection.unesco', { year: t(itemKey(artifact.id, 'unesco')) })}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-serif font-medium text-white leading-snug">
                    {t(itemKey(artifact.id, 'title'))}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {t(itemKey(artifact.id, 'summary'))}
                  </p>

                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 space-y-2 text-[11px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 uppercase text-xs">{t('heritagePage.collection.period')}</span>
                      <span className="font-medium text-slate-700 text-right">{t(itemKey(artifact.id, 'period'))}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 uppercase text-xs">{t('heritagePage.collection.region')}</span>
                      <span className="font-medium text-slate-700 text-right">{t(itemKey(artifact.id, 'region'))}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 border-t border-slate-200/60 pt-1.5">
                      <span className="text-slate-400 uppercase text-xs">{t('heritagePage.collection.materials')}</span>
                      <span className="text-slate-600 text-right text-xs max-w-[180px] truncate" title={t(itemKey(artifact.id, 'materials'))}>{t(itemKey(artifact.id, 'materials'))}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedArtifact(artifact)}
                    className="text-xs font-semibold text-[#0A1128] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t('heritagePage.collection.readMore')}</span>
                  </button>
                  <SoyomboSymbol className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37] transition-colors" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 7. Steppe Runner Mini-Game at the VERY Bottom */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs uppercase tracking-widest font-mono text-amber-900 font-bold">
                <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t('heritagePage.game.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-normal">
                {t('heritagePage.game.title')} <span className="italic text-[#C5A059]">{t('heritagePage.game.titleNative')}</span>
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-1 max-w-xl">
                {t('heritagePage.game.blurb')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isGameActive ? (
                <button
                  onClick={() => setIsGameActive(true)}
                  className="px-6 py-3 bg-[#0A1128] text-white rounded-lg text-xs uppercase tracking-wider font-bold hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all shadow-md active:scale-95"
                >
                  {t('heritagePage.game.play')}
                </button>
              ) : (
                <button
                  onClick={() => setIsGameActive(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-slate-200 transition-colors"
                >
                  {t('heritagePage.game.hide')}
                </button>
              )}
            </div>
          </div>

          {isGameActive ? (
            <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <Suspense fallback={<div className="h-[320px] flex items-center justify-center text-slate-400"><Loader className="w-8 h-8 animate-spin" /></div>}>
                <LetsPlayGame />
              </Suspense>
            </div>
          ) : (
            <div 
              onClick={() => setIsGameActive(true)}
              className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center cursor-pointer group border border-slate-800"
            >
              <img 
                src="https://images.unsplash.com/photo-1542642596-f3310061e888?q=80&w=1200&auto=format&fit=crop" 
                alt={t('heritagePage.game.previewAlt')} 
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/50 transition-colors" />

              <div className="relative z-10 p-6 flex flex-col items-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-white text-xl font-serif mb-2">
                  {t('heritagePage.game.ready')}
                </h3>
                <p className="text-slate-300 text-xs font-normal leading-relaxed mb-6">
                  <Trans
                    i18nKey="heritagePage.game.controls"
                    components={{ k: <strong className="text-[#D4AF37]" /> }}
                  />
                </p>
                <span className="px-6 py-3 bg-[#D4AF37] text-[#0A1128] rounded-lg text-xs uppercase tracking-widest font-semibold shadow-lg group-hover:bg-white transition-colors">
                  {t('heritagePage.game.start')}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Artifact Record Modal Detail */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedArtifact(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-lg border border-slate-200 flex flex-col max-h-[90vh]"
            >
              <div className="bg-[#0A1128] text-white p-6 relative border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#D4AF37] font-mono">
                    {t('heritagePage.modal.unescoRecognized', { year: t(itemKey(selectedArtifact.id, 'unesco')) })}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-normal text-white">
                  {t(itemKey(selectedArtifact.id, 'title'))}
                </h3>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">{t('heritagePage.modal.background')}</h4>
                  <p className="text-slate-700 leading-relaxed font-normal text-sm">
                    {t(itemKey(selectedArtifact.id, 'significance'))}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">{t('heritagePage.modal.goodToKnow')}</h4>
                  <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {['d1', 'd2', 'd3'].map((field) => (
                      <li key={field} className="flex items-start gap-2 text-slate-600 font-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>{t(itemKey(selectedArtifact.id, field))}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 uppercase text-xs block">{t('heritagePage.modal.materials')}</span>
                    <span className="font-medium text-slate-800 text-xs">{t(itemKey(selectedArtifact.id, 'materials'))}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-xs block">{t('heritagePage.modal.category')}</span>
                    <span className="font-medium text-slate-800 text-xs">{t(CATEGORY_LABEL_KEYS[selectedArtifact.category])}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="px-5 py-2 bg-[#0A1128] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {t('heritagePage.modal.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
