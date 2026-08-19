import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { MapControls, BakeShadows, Preload } from '@react-three/drei';
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
import { DioramaScene } from '../components/diorama/DioramaScene';
import { Overlay } from '../components/diorama/Overlay';
import Artifact3DExplorer from '../components/diorama/Artifact3DExplorer';
import LetsPlayGame from '../components/game/LetsPlayGame';
import { SoyomboSymbol, UlziiSymbol } from '../components/MongolianDesign';

interface HeritageArtifact {
  id: string;
  catalogId: string;
  unescoYear?: string;
  category: 'intangible' | 'material' | 'calligraphy' | 'ceremony';
  titleEn: string;
  titleMn: string;
  titleDe: string;
  summary: string;
  materials?: string;
  period: string;
  region: string;
  imageUrl: string;
  significance: string;
  details: string[];
}

const HERITAGE_COLLECTIONS: HeritageArtifact[] = [
  {
    id: 'morin-khuur',
    catalogId: 'MCA-ICH-001',
    unescoYear: '2008 (Proclaimed 2003)',
    category: 'intangible',
    titleEn: 'Traditional Music of the Morin Khuur',
    titleMn: 'Морин хуурын уламжлалт хөгжим',
    titleDe: 'Traditionelle Musik der Pferdekopfgeige (Morin Khuur)',
    summary: 'Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity (originally proclaimed in 2003). A two-stringed bowed instrument adorned with a carved horse head, expressing the soul, rhythms, and poetic oral traditions of the steppe.',
    materials: 'Seasoned birch or pine resonator box, cedar soundboard, horsehair strings, ebony fingerboard',
    period: 'Circa 13th Century – Living Heritage',
    region: 'Steppe & Mountain Pastoralist Communities Across Mongolia',
    imageUrl: 'https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=800&auto=format&fit=crop',
    significance: 'Regarded as a cornerstone of Mongolian national identity, performing solo pieces (Tatlag), accompanying epic poetry (Tuuli), and pacing the traditional Long Songs (Urtiin Duu).',
    details: [
      'Two strings: inner "female" string (approx. 105 hairs of a mare) and outer "male" string (approx. 130 hairs of a stallion)',
      'Trapezoidal wooden soundboard with carved Soyombo or f-shaped sound holes',
      'Inscribed on the UNESCO Representative List of Intangible Cultural Heritage in 2008'
    ]
  },
  {
    id: 'mongolian-ger',
    catalogId: 'MCA-ICH-002',
    unescoYear: '2013 Inscribed',
    category: 'material',
    titleEn: 'Traditional Craftsmanship of the Mongol Ger and Associated Customs',
    titleMn: 'Монгол гэрийн уламжлалт урлал, зан үйл',
    titleDe: 'Traditionelle Handwerkskunst der Mongolischen Jurte (Ger)',
    summary: 'Inscribed on the UNESCO Representative List in 2013. A circular, self-supporting wooden structure covered with pressed wool felt, engineered for rapid assembly and resilience against extreme continental climates.',
    materials: 'Lattice wood walls (Khana), radial roof rafters (Uni), crown ring (Toono), twin pillars (Bagan), felt and canvas',
    period: 'Ancient Living Architectural Tradition',
    region: 'Nationwide Nomadic Pastoral Regions',
    imageUrl: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=800&auto=format&fit=crop',
    significance: 'Functions as a sacred microcosm reflecting cosmic orientation, family hospitality customs, and harmonious ecological balance with nature.',
    details: [
      'Engineered without nails; wooden joints are tied with raw leather thongs and braided horsehair ropes',
      'Assembled, disassembled, and loaded onto pack animals in under two hours',
      'Central hearth (Gal Golomt) represents continuity of ancestral lineage'
    ]
  },
  {
    id: 'bichig-script',
    catalogId: 'MCA-ICH-003',
    unescoYear: '2013 (Urgent Safeguarding)',
    category: 'calligraphy',
    titleEn: 'Mongolian Calligraphy (Classical Bichig)',
    titleMn: 'Монгол бичгийн уран бичлэг',
    titleDe: 'Mongolische Kalligraphie (Bichig)',
    summary: 'Inscribed on the UNESCO List of Intangible Cultural Heritage in Need of Urgent Safeguarding in 2013. The 800-year-old classical vertical script written from top to bottom in unbroken strokes of the brush.',
    materials: 'Natural animal-hair brush, mineral inkstone, traditional parchment',
    period: '1204 CE – Contemporary Revival',
    region: 'Historical Mongol Empire & Modern Cultural Diaspora',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    significance: 'An unbroken literary tradition capturing historical treaties, imperial decrees, philosophy, and poetry in vertical symmetry symbolizing the connection between Heaven and Earth.',
    details: [
      'Characters have initial, medial, and final forms depending on their structural placement',
      'Preserved through master-to-apprentice calligraphic transmission and academic workshops in Vienna',
      'Officially inscribed on the UNESCO Urgent Safeguarding List in 2013'
    ]
  },
  {
    id: 'naadam-festival',
    catalogId: 'MCA-ICH-004',
    unescoYear: '2010 Inscribed',
    category: 'ceremony',
    titleEn: 'Naadam: Mongolian Traditional Festival',
    titleMn: 'Эрийн гурван наадам',
    titleDe: 'Naadam: Mongolisches traditionelles Fest',
    summary: 'Inscribed on the UNESCO Representative List in 2010. Celebrates the "Three Manly Games" of traditional wrestling (Bökh), composite bow archery (Sur Kharvaa), and long-distance horse racing (Mori Uraldaan).',
    materials: 'Silk and leather wrestling attire (Zodog, Shuudag), horn composite bows, handcrafted saddles',
    period: 'Ancient Steppe Assemblies – Contemporary National Festival',
    region: 'Nationwide across Mongolia and Diaspora Centers Worldwide',
    imageUrl: 'https://images.unsplash.com/photo-1542642596-f3310061e888?q=80&w=800&auto=format&fit=crop',
    significance: 'Embraces communal solidarity, respect for nature and livestock, and oral rituals such as the praise songs (Tsol) and the eagle dance (Devjee).',
    details: [
      'Traditional wrestling begins with the ceremonial Eagle Dance invoking strength and grace',
      'Archery uses layered composite bows crafted from horn, birch, and sinew',
      'Cross-country horse racing covers 15 to 30 kilometers across open natural steppe terrain'
    ]
  },
  {
    id: 'khoomei-throat-singing',
    catalogId: 'MCA-ICH-005',
    unescoYear: '2010 Inscribed',
    category: 'intangible',
    titleEn: 'Mongolian Traditional Art of Khöömei (Throat Singing)',
    titleMn: 'Монгол хөөмийн уламжлалт урлаг',
    titleDe: 'Mongolischer Obertongesang (Khöömei)',
    summary: 'Inscribed on the UNESCO Representative List in 2010. A master vocal art where the performer simultaneously produces a deep fundamental drone pitch and clear flute-like harmonic overtones.',
    materials: 'Human vocal resonance, breath control, and pharyngeal acoustic articulation',
    period: 'Pastoral Steppe & Altai Mountain Heritage',
    region: 'Western Mongolia (Altai, Khovd, Uvs Mountain Ranges)',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    significance: 'Imitates and pays homage to natural acoustic phenomena including flowing mountain rivers, whistling winds, and animal calls.',
    details: [
      'Includes chest-drone resonance (Kharhiraa) and whistling overtone harmonics (Isgeree)',
      'Historically practiced by nomadic pastoralists in open alpine landscapes',
      'Transmitted orally across generations of nomadic families and masters'
    ]
  },
  {
    id: 'urtiin-duu',
    catalogId: 'MCA-ICH-006',
    unescoYear: '2008 (Proclaimed 2005)',
    category: 'intangible',
    titleEn: 'Urtiin Duu: Traditional Folk Long Song',
    titleMn: 'Уртын дууны уламжлалт урлаг',
    titleDe: 'Traditionelles mongolisches langes Lied (Urtiin Duu)',
    summary: 'Inscribed on the UNESCO Representative List in 2008 (originally proclaimed in 2005). Characterized by expansive, drawn-out melodies, wide vocal registers, and microtonal ornamentation (Nugalaan).',
    materials: 'Acoustic vocal performance accompanied by the Morin Khuur and Limbe flute',
    period: 'Over 2,000 Years of Nomadic Oral Continuity',
    region: 'Eastern Steppes, Gobi, and Central Mongolia',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    significance: 'Performs essential ritual functions during state ceremonies, family milestones, and nomadic seasonal feasts, evoking the vast horizons of the steppe.',
    details: [
      'Each song contains complex ornamentation, wide melodic leaps, and philosophical lyrics',
      'Traditionally sung at weddings, ger consecrations, and national Naadam festivals',
      'Co-nominated and inscribed on the UNESCO Representative List'
    ]
  },
  {
    id: 'shagai-shooting',
    catalogId: 'MCA-ICH-007',
    unescoYear: '2014 Inscribed',
    category: 'ceremony',
    titleEn: 'Mongolian Knuckle-Bone Shooting (Shagai)',
    titleMn: 'Шагайн харвааны уламжлалт наадам',
    titleDe: 'Mongolisches Knöchelknochenschießen (Shagai)',
    summary: 'Inscribed on the UNESCO Representative List in 2014. A team-based traditional game where players flick polished sheep knuckle-bones using a wooden launcher (Khashlaga) to strike target bone dominoes.',
    materials: 'Cleaned sheep astragalus knuckle-bones, polished wooden launcher board, felt backstop',
    period: 'Ancient Nomadic Living Tradition',
    region: 'Communities Across Mongolia and International Clubs',
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=800&auto=format&fit=crop',
    significance: 'Fosters team solidarity, sharp focus, mutual sportsmanship, and the preservation of customary praise chants during play.',
    details: [
      'Players flick small bone tablets over a precise distance of 4.7 meters (9 tokhoy)',
      'Accompanied by traditional rhythmic songs called Uukhai praising successful shots',
      'Practiced as an official sporting event alongside Naadam festivals'
    ]
  },
  {
    id: 'biyelgee-dance',
    catalogId: 'MCA-ICH-008',
    unescoYear: '2009 (Urgent Safeguarding)',
    category: 'intangible',
    titleEn: 'Mongol Biyelgee: Traditional Folk Dance',
    titleMn: 'Монгол биелгээ: Ардын уламжлалт бүжиг',
    titleDe: 'Mongol Biyelgee: Traditioneller Volkstanz',
    summary: 'Inscribed on the UNESCO List of Intangible Cultural Heritage in Need of Urgent Safeguarding in 2009. A unique folk dance performed within the confined space of a Ger, featuring rapid chest, shoulder, and arm gestures.',
    materials: 'Ethnic silk robes (Deel), boots, accompanied by the Morin Khuur or Tovshuur',
    period: 'Ancient Living Dance Tradition',
    region: 'Western Mongolian Ethnic Groups (Oirat, Zakhchin, Torguud, Uriankhai)',
    imageUrl: 'https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=800&auto=format&fit=crop',
    significance: 'Articulates the daily nomadic lifestyle, horse riding, milking, wool processing, and hunting movements through expressive upper-body choreography.',
    details: [
      'Performed in half-sitting or kneeling positions inside the family Ger',
      'Distinct movement styles distinguish individual ethnic subgroups across Western Mongolia',
      'Inscribed on the UNESCO Urgent Safeguarding List in 2009'
    ]
  }
];

const ADVANCED_BILATERAL_CHRONOLOGY = [
  {
    id: 'silk-road',
    year: '1246 - 1289',
    eraBadge: '13th Century',
    eraCategory: 'Silk Road & Early Envoys',
    titleEn: 'Early Diplomatic Contact & Transcontinental Exchange',
    titleMn: 'Эртний дипломат харилцааны эхлэл',
    descEn: 'Transcontinental trade routes and imperial envoys connected Central Europe with the Mongol Empire at Karakorum. Papal and royal letters fostered early geographical understanding and initial intercultural trade along the Silk Road.',
    highlights: ['Transcontinental Silk Road routes', 'Papal envoys to Karakorum', 'Early cartography and trade agreements'],
    location: 'Karakorum & Central European Courts'
  },
  {
    id: 'diplomatic-treaty',
    year: '1963',
    eraBadge: 'Formal Accord',
    eraCategory: 'Official Bilateral Relations',
    titleEn: 'Establishment of Official Diplomatic Relations',
    titleMn: 'Дипломат харилцаа албан ёсоор тогтов',
    descEn: 'On July 1, 1963, the Republic of Austria and Mongolia officially established formal diplomatic relations. This historic milestone catalyzed decades of bilateral academic fellowships, medical partnerships, environmental cooperation, and musical exchange.',
    highlights: ['Formal diplomatic accord signed July 1, 1963', 'Academic research exchanges', 'Bilateral trade & developmental cooperation'],
    location: 'Vienna & Ulaanbaatar'
  },
  {
    id: 'embassy-founded',
    year: '1992',
    eraBadge: 'Resident Mission',
    eraCategory: 'Embassy & Multilateral Mission',
    titleEn: 'Establishment of the Embassy of Mongolia in Vienna',
    titleMn: 'Вена хотноо Монгол Улсын Элчин сайдын яам байгуулагдав',
    descEn: 'Mongolia opened its resident Embassy in Vienna in 1992, serving concurrently as the Permanent Mission of Mongolia to the United Nations and International Organizations in Vienna (including IAEA, UNODC, UNIDO, CTBTO, and OSCE), anchoring bilateral and multilateral diplomacy in Central Europe.',
    highlights: ['Resident Embassy established in Vienna (1992)', 'Permanent Mission to UN, IAEA, UNODC & OSCE', 'Consular services and diaspora community engagement'],
    location: 'Embassy of Mongolia, Vienna, Austria'
  },
  {
    id: 'academic-museum',
    year: '1990 - Present',
    eraBadge: 'Academic Era',
    eraCategory: 'Museum & Scholarly Partnerships',
    titleEn: 'Museum Exhibitions & Archival Research',
    titleMn: 'Музей, эрдэм шинжилгээний хамтын ажиллагаа',
    descEn: 'Collaborative research and cultural exhibitions between Austrian institutions—including Weltmuseum Wien and the Austrian Academy of Sciences—and Mongolian national museums, preserving nomadic artifacts and historical collections in Central Europe.',
    highlights: ['Weltmuseum Wien ethnographic collections', 'Joint archaeological and historical symposiums', 'Austrian-Mongolian academic societies'],
    location: 'Vienna Cultural & Academic Institutions'
  },
  {
    id: 'vienna-center',
    year: '2026',
    eraBadge: 'New Chapter',
    eraCategory: 'Community & Cultural Bridge',
    titleEn: 'Establishment of the Mongolian Center Austria',
    titleMn: 'Вена дахь Монгол Төв албан ёсоор байгуулагдав',
    descEn: 'Founded as a registered Austrian cultural association (Verein) in Vienna. The Center serves as a permanent hub for community integration, language learning, living heritage safeguarding, and Austrian-Mongolian cultural diplomacy in the heart of Europe.',
    highlights: ['Registered cultural association (Verein) in Vienna', 'Traditional music, calligraphy & language academies', 'Intercultural events and community integration hub'],
    location: 'Mongolian Center Austria, Vienna'
  }
];

export default function Heritage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'all' | 'intangible' | 'material' | 'calligraphy' | 'ceremony'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<HeritageArtifact | null>(null);
  const [activeDioramaPopup, setActiveDioramaPopup] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [activeEraId, setActiveEraId] = useState<string>('all');

  const filteredArtifacts = HERITAGE_COLLECTIONS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleMn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.catalogId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-[140px] md:pt-[152px] bg-[#FAF8F5] min-h-screen text-slate-900 font-sans selection:bg-brand-gold/30 selection:text-slate-900">
      
      {/* 1. Official Institutional Header */}
      <section className="relative min-h-[380px] md:h-[460px] flex items-center px-6 text-white border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=1600&auto=format&fit=crop" 
            alt="Mongolian Cultural Heritage" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white font-normal tracking-tight leading-[1.15] mb-6">
              Mongolian Cultural Heritage <br />
              <span className="italic font-light text-[#D4AF37]">& Living Traditions</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-3xl">
              The cultural documentation archive of the Mongolian Center Austria in Vienna. 
              Dedicated to safeguarding UNESCO-recognized intangible cultural heritage, traditional craftsmanship, and classical vertical script through education, workshops, and community preservation in Central Europe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive 3D Nomadic Diorama Live Preview (AT THE TOP) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-slate-900">
          
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-900 rounded text-[10px] uppercase font-mono tracking-widest border border-amber-200/80 font-bold">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Digital Exhibition
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-sans">Traditional Steppe Settlement</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
                Virtual Nomadic Settlement <span className="italic text-[#C5A059] font-light">Interactive 3D Overview</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/diorama"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#0A1128] transition-colors shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Explore Fullscreen Diorama</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[450px] sm:h-[550px] bg-[#E8EEF5]">
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E8EEF5] z-20">
                <Loader className="w-8 h-8 text-[#D4AF37] animate-spin mb-3" />
                <p className="text-xs font-mono tracking-widest text-slate-700 uppercase">Loading 3D Steppe Environment...</p>
              </div>
            }>
              <Canvas 
                shadows 
                camera={{ position: [0, 32, 12], fov: 45 }}
                gl={{ powerPreference: "high-performance", antialias: false }}
              >
                <color attach="background" args={['#E8EEF5']} />
                <fog attach="fog" args={['#E8EEF5', 30, 95]} />
                
                <ambientLight intensity={0.9} />
                <directionalLight
                  castShadow
                  position={[25, 25, 15]}
                  intensity={1.4}
                  color="#fffdf5"
                  shadow-mapSize={[512, 512]}
                />
                
                <DioramaScene onSelect={setActiveDioramaPopup} />
                
                <MapControls 
                  makeDefault 
                  minPolarAngle={0} 
                  maxPolarAngle={Math.PI / 2.5} 
                  minDistance={8}
                  maxDistance={50}
                  target={[0, 0, 0]}
                />

                <BakeShadows />
                <Preload all />
              </Canvas>
            </Suspense>

            <Overlay activePopup={activeDioramaPopup} onClose={() => setActiveDioramaPopup(null)} />

            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-700 font-sans shadow-sm pointer-events-none">
              <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Drag to rotate • Scroll to zoom • Click markers to read details</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3D 360° Artifact Inspector */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-slate-900">
          
          {/* Top Header Bar matching Virtual Nomadic Settlement style */}
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-900 rounded text-[10px] uppercase font-mono tracking-widest border border-amber-200/80 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  3D Artifact Archive
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-sans">Traditional Craftsmanship & Instruments</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900">
                Traditional Craftsmanship & Instruments <span className="italic text-[#C5A059] font-light">Interactive 3D Views</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-700 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>360° Rotational Inspection</span>
              </div>
            </div>
          </div>

          {/* Embedded Full-Width Artifact Explorer */}
          <div className="p-4 sm:p-6 lg:p-8 bg-white">
            <Artifact3DExplorer />
          </div>

        </div>
      </section>

      {/* 4. Classical Vertical Script (Bichig) Archival Corner */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded border border-amber-200/80 text-[10px] uppercase tracking-[0.2em] font-mono text-amber-900 font-bold">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                Language & Calligraphy
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 font-normal leading-tight">
                Classical Mongolian Script <br />
                <span className="italic text-[#C5A059] font-light">(Bichig)</span>
              </h2>

              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Created in the early 13th century, the classical vertical script is written continuously from top to bottom. Inscribed on the UNESCO List of Intangible Cultural Heritage, it remains an enduring symbol of Mongolian cultural identity and historical literature.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  { mn: 'Найрамдал', script: 'Nayramdal', en: 'Friendship & Cultural Exchange' },
                  { mn: 'Өв соёл', script: 'Öv Soyol', en: 'Cultural Heritage & Memory' },
                  { mn: 'Эв нэгдэл', script: 'Ev Negdel', en: 'Community & Mutual Respect' },
                ].map(phrase => (
                  <div key={phrase.mn} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-xs font-serif text-slate-900 font-bold block">{phrase.mn}</span>
                    <span className="text-[10px] text-slate-500 font-mono block mb-1">({phrase.script})</span>
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider">{phrase.en}</span>
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

                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold mt-6">
                  Calligraphy Workshops in Vienna
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADVANCED AUSTRIAN-MONGOLIAN HISTORICAL RELATIONS TIMELINE */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Timeline Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-[10px] uppercase tracking-widest font-mono text-amber-900 font-bold mb-3">
            <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
            Bilateral History & Diplomacy
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-normal">
            Austrian-Mongolian <span className="italic text-[#C5A059]">Historical Relations</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light mt-2.5 leading-relaxed">
            Key milestones in diplomatic, cultural, and academic cooperation connecting Vienna and Mongolia across the centuries.
          </p>

          {/* Quick Interactive Era Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveEraId('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold transition-all ${
                activeEraId === 'all'
                  ? 'bg-[#0A1128] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Eras
            </button>
            {ADVANCED_BILATERAL_CHRONOLOGY.map(era => (
              <button
                key={era.id}
                onClick={() => setActiveEraId(era.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                  activeEraId === era.id
                    ? 'bg-[#D4AF37] text-[#0A1128] font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {era.year}
              </button>
            ))}
          </div>
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
                          <span className="px-2.5 py-0.5 bg-[#0A1128] text-white rounded text-[10px] font-mono font-bold tracking-wider">
                            {event.eraBadge}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                            {event.eraCategory}
                          </span>
                        </div>

                        {/* Year Display with Serif Typography */}
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight block mb-1">
                          {event.year}
                        </span>

                        <h3 className="text-base sm:text-lg font-serif font-semibold text-[#0A1128] mb-1 leading-snug">
                          {event.titleEn}
                        </h3>

                        <span className="text-xs font-serif text-[#C5A059] font-medium block mb-3">
                          {event.titleMn}
                        </span>

                        <p className="text-xs text-slate-600 font-light leading-relaxed mb-4">
                          {event.descEn}
                        </p>

                        {/* Key Highlight Chips */}
                        <div className={`pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          {event.highlights.map((h, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-600 font-sans">
                              <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>

                        {/* Location footnote */}
                        <div className={`mt-3 pt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <Landmark className="w-3 h-3 text-slate-400" />
                          <span>{event.location}</span>
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
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">Cultural Collection</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{filteredArtifacts.length} Traditions Documented</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-medium">
              UNESCO Heritage & Traditional Arts
            </h2>
            <p className="text-xs text-slate-500 font-light mt-1">
              Selected traditions, material arts, and living customs recognized by UNESCO and preserved by the community.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search traditions or artifacts..."
              aria-label="Search cultural heritage catalog"
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#D4AF37] text-slate-800 placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full pb-4 mb-8 custom-scrollbar">
          {[
            { id: 'all', label: 'All Collections', count: HERITAGE_COLLECTIONS.length },
            { id: 'intangible', label: 'Music & Oral Traditions', count: HERITAGE_COLLECTIONS.filter(x => x.category === 'intangible').length },
            { id: 'material', label: 'Nomadic Architecture', count: HERITAGE_COLLECTIONS.filter(x => x.category === 'material').length },
            { id: 'calligraphy', label: 'Calligraphy (Bichig)', count: HERITAGE_COLLECTIONS.filter(x => x.category === 'calligraphy').length },
            { id: 'ceremony', label: 'Festivals & Traditional Games', count: HERITAGE_COLLECTIONS.filter(x => x.category === 'ceremony').length }
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
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
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
                  alt={artifact.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                    {artifact.catalogId}
                  </span>
                  {artifact.unescoYear && (
                    <span className="px-2.5 py-1 bg-amber-500/90 text-slate-900 font-bold rounded text-[10px] font-mono">
                      UNESCO {artifact.unescoYear}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-serif text-amber-200/90 tracking-wide block">
                    {artifact.titleMn}
                  </span>
                  <h3 className="text-lg font-serif font-medium text-white leading-snug">
                    {artifact.titleEn}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {artifact.summary}
                  </p>

                  <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 space-y-2 text-[11px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 uppercase text-[10px]">Origin / Period</span>
                      <span className="font-medium text-slate-700 text-right">{artifact.period}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 uppercase text-[10px]">Region</span>
                      <span className="font-medium text-slate-700 text-right">{artifact.region}</span>
                    </div>
                    {artifact.materials && (
                      <div className="flex items-start justify-between gap-2 border-t border-slate-200/60 pt-1.5">
                        <span className="text-slate-400 uppercase text-[10px]">Materials</span>
                        <span className="text-slate-600 text-right text-[10px] max-w-[180px] truncate">{artifact.materials}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedArtifact(artifact)}
                    className="text-xs font-semibold text-[#0A1128] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Cultural Record</span>
                  </button>
                  <SoyomboSymbol className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37] transition-colors" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 7. Steppe Runner Mini-Game at the VERY Bottom */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-[10px] uppercase tracking-widest font-mono text-amber-900 font-bold">
                <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                Interactive Mini-Game
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-normal">
                Steppe Runner <span className="italic text-[#C5A059]">(Талын Гүйгч)</span>
              </h2>
              <p className="text-xs text-slate-500 font-light mt-1 max-w-xl">
                An educational endless runner set across the Mongolian steppe. Collect traditional items (bows, shields, and horses), avoid obstacles, and learn about nomadic symbols.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isGameActive ? (
                <button
                  onClick={() => setIsGameActive(true)}
                  className="px-6 py-3 bg-[#0A1128] text-white rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all shadow-md active:scale-95"
                >
                  Play Game
                </button>
              ) : (
                <button
                  onClick={() => setIsGameActive(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-slate-200 transition-colors"
                >
                  Reset / Hide Game
                </button>
              )}
            </div>
          </div>

          {isGameActive ? (
            <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <LetsPlayGame />
            </div>
          ) : (
            <div 
              onClick={() => setIsGameActive(true)}
              className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center cursor-pointer group border border-slate-800"
            >
              <img 
                src="https://images.unsplash.com/photo-1542642596-f3310061e888?q=80&w=1200&auto=format&fit=crop" 
                alt="Steppe Runner preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/50 transition-colors" />

              <div className="relative z-10 p-6 flex flex-col items-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-white text-xl font-serif mb-2">
                  Ready to explore the Steppe?
                </h3>
                <p className="text-slate-300 text-xs font-light leading-relaxed mb-6">
                  Controls: Press <strong className="text-[#D4AF37]">SPACEBAR</strong> or <strong className="text-[#D4AF37]">UP ARROW</strong> to jump. On mobile: tap the screen.
                </p>
                <span className="px-6 py-3 bg-[#D4AF37] text-[#0A1128] rounded-full text-xs uppercase tracking-widest font-extrabold shadow-lg group-hover:bg-white transition-colors">
                  Click to Start Game
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
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
            >
              <div className="bg-[#0A1128] text-white p-6 relative border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#D4AF37] text-[#0A1128] font-mono text-[10px] font-bold rounded">
                    {selectedArtifact.catalogId}
                  </span>
                  {selectedArtifact.unescoYear && (
                    <span className="text-xs text-[#D4AF37] font-mono">
                      UNESCO Recognized ({selectedArtifact.unescoYear})
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-serif font-normal text-white">
                  {selectedArtifact.titleEn}
                </h3>
                <span className="text-sm text-amber-200/80 font-serif">
                  {selectedArtifact.titleMn}
                </span>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Cultural Background</h4>
                  <p className="text-slate-700 leading-relaxed font-light text-sm">
                    {selectedArtifact.significance}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Details & Tradition</h4>
                  <ul className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedArtifact.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Materials</span>
                    <span className="font-medium text-slate-800 text-xs">{selectedArtifact.materials || 'Traditional Materials'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">Category</span>
                    <span className="font-medium text-slate-800 text-xs capitalize">{selectedArtifact.category} Heritage</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="px-5 py-2 bg-[#0A1128] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
