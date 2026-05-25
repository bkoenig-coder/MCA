import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getFadeIn, getFadeUp, getFadeSide, isMobileViewport } from '../lib/utils';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Languages, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Calendar, 
  Video, 
  Heart, 
  ExternalLink,
  Volume2,
  BookMarked,
  Check,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Phrase {
  cyrillic: string;
  translit: string;
  script: string;
  english: string;
  german: string;
  mongolian: string;
  category: 'greetings' | 'essentials' | 'numbers' | 'culture';
  audioDesc: string;
}

const USEFUL_PHRASES: Phrase[] = [
  {
    cyrillic: "Сайн байна уу?",
    translit: "Sain baina uu?",
    script: "ᠰᠠᠶᠢᠨ ᠪᠠᠶᠢᠨ᠎ᠠ ᠤᠤ︖",
    english: "How are you? / Hello",
    german: "Wie geht es Ihnen? / Hallo",
    mongolian: "Мэндчилгээ (Сайн байна уу)",
    category: "greetings",
    audioDesc: "Formal greeting used anytime."
  },
  {
    cyrillic: "Баярлалаа.",
    translit: "Bayarlalaa.",
    script: "ᠪᠠᠶᠠᠰᠬᠤᠯᠠᠨ ᠲᠠᠯᠠᠷᠬᠠᠯ᠎ᠠ︖",
    english: "Thank you.",
    german: "Danke.",
    mongolian: "Талархал илэрхийлэх",
    category: "essentials",
    audioDesc: "Standard expression of gratitude."
  },
  {
    cyrillic: "Зүгээр зүгээр.",
    translit: "Zugeer zugeer.",
    script: "ᠵᠦᠭᠡᠷ ᠵᠦᠭᠡᠷ",
    english: "You're welcome. / It's alright.",
    german: "Bitte. / Schon okay.",
    mongolian: "Хариу хэлэх (Зүгээр)",
    category: "essentials",
    audioDesc: "Polite response to thank you."
  },
  {
    cyrillic: "Миний нэрийг ... гэдэг.",
    translit: "Minii neriig ... gedeg.",
    script: "ᠮᠢᠨᠦ ᠨᠡᠷ᠎ᠡ ᠶᠢ ᠃᠃᠃ ᠭᠡᠳᠡᠭ",
    english: "My name is ...",
    german: "Ich heiße ...",
    mongolian: "Өөрийгөө танилцуулах",
    category: "greetings",
    audioDesc: "Self introduction format."
  },
  {
    cyrillic: "Нэг, Хоёр, Гурав",
    translit: "Neg, Khoyor, Gurav",
    script: "ᠨᠢᠭᠡ ᠂ ᠬᠣᠶᠠᠷ ᠂ ᠭᠤᠷᠪᠠ",
    english: "One, Two, Three",
    german: "Eins, Zwei, Drei",
    mongolian: "Тоо (1, 2, 3)",
    category: "numbers",
    audioDesc: "The first three numbers."
  },
  {
    cyrillic: "Монгол зан заншил",
    translit: "Mongol zan zanshil",
    script: "ᠮᠣᠩᠭᠣᠯ ᠵᠠᠩ ᠵᠠᠩᠰᠢᠯ",
    english: "Mongolian customs & tradition",
    german: "Mongolische Sitten & Bräuche",
    mongolian: "Ёс заншил",
    category: "culture",
    audioDesc: "Core identity vocabulary."
  },
  {
    cyrillic: "Амар мэнд үү?",
    translit: "Amar mend uu?",
    script: "ᠠᠮᠤᠷ ᠮᠡᠨᠳᠦ ᠤᠤ︖",
    english: "Peaceful greetings (Respectful)",
    german: "Friedliche Grüße (Respektvoll)",
    mongolian: "Амар мэндийг эрэх",
    category: "greetings",
    audioDesc: "Deep respect traditional salutation."
  },
  {
    cyrillic: "Уулзаагүй удлаа шүү.",
    translit: "Uulzaagui udlaa shuu.",
    script: "ᠠᠭᠤᠯᠵᠠᠭᠠᠳᠤᠢ ᠤᠳᠠᠬᠤ ᠰᠢᠭᠦ",
    english: "Long time no see.",
    german: "Lange nicht gesehen.",
    mongolian: "Уулзаагүй уджээ",
    category: "greetings",
    audioDesc: "Catching up with an old friend."
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    phrase: "Баярлалаа (Bayarlalaa)",
    options: ["How are you?", "Thank you", "Goodbye", "Excuse me"],
    correct: "Thank you"
  },
  {
    id: 2,
    phrase: "Сайн байна уу? (Sain baina uu?)",
    options: ["I am happy", "How are you? / Hello", "Where is Vienna?", "Let's learn Mongolian"],
    correct: "How are you? / Hello"
  },
  {
    id: 3,
    phrase: "Миний нэрийг ... гэдэг.",
    options: ["I live in Vienna", "How old are you?", "My name is ...", "Nice to meet you"],
    correct: "My name is ..."
  }
];

export default function LearnMongolian() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // State managers
  const [activeTab, setActiveTab] = useState<'kids' | 'foreigners'>('kids');
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase>(USEFUL_PHRASES[0]);
  const [phraseCategory, setPhraseCategory] = useState<Phrase['category'] | 'all'>('all');
  
  // Interactive mini check quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Reg Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    track: 'heritage-kids',
    level: 'beginner',
    notes: ''
  });
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formIsCompleted, setFormIsCompleted] = useState(false);

  const handlePhraseCatChange = (cat: Phrase['category'] | 'all') => {
    setPhraseCategory(cat);
    const filtered = cat === 'all' ? USEFUL_PHRASES : USEFUL_PHRASES.filter(p => p.category === cat);
    if (filtered.length > 0) {
      setSelectedPhrase(filtered[0]);
    }
  };

  const playTTSMock = (phrase: Phrase) => {
    // Generate simple speech synth fallback or audio announcement for interactive experience
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.cyrillic);
      utterance.lang = 'ru-RU'; // Best approximate phonetics for Mongolian Cyrillic if native MN is absent
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      toast.success(`Playing sound guide for: "${phrase.translit}"`);
    } else {
      toast.info(`Pronunciation Guide: ${phrase.translit}. (${phrase.audioDesc})`);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (quizAnswered) return;
    setSelectedOption(option);
    setQuizAnswered(true);
    const currentQ = QUIZ_QUESTIONS[currentQuizIndex];
    if (option === currentQ.correct) {
      setQuizScore(prev => prev + 1);
      toast.success(currentLang === 'mn' ? "Зөв хариуллаа!" : currentLang === 'de' ? "Richtig!" : "Correct choice!");
    } else {
      toast.error(currentLang === 'mn' ? `Буруу хариуллаа. Зөв нь: ${currentQ.correct}` : currentLang === 'de' ? `Falsch. Richtig war: ${currentQ.correct}` : `Incorrect. Correct was: ${currentQ.correct}`);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
      setSelectedOption('');
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setSelectedOption('');
    setQuizCompleted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error(currentLang === 'mn' ? "Нэр, имэйл хаягийг заавал бөглөнө үү." : "Please fill out at least Name and Email.");
      return;
    }
    setFormIsSubmitting(true);
    setTimeout(() => {
      setFormIsSubmitting(false);
      setFormIsCompleted(true);
      toast.success(currentLang === 'mn' ? "Бид таны бүртгэлийг хүлээж авлаа! Тун удахгүй холбогдох болно." : "Enrollment inquiry sent successfully! Our academic team will contact you in 48 hours.");
    }, 1500);
  };

  const filteredPhrases = phraseCategory === 'all' 
    ? USEFUL_PHRASES 
    : USEFUL_PHRASES.filter(p => p.category === phraseCategory);

  const animY = isMobileViewport() ? 10 : 35;
  const animDuration = isMobileViewport() ? 0.45 : 0.85;

  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32">
      {/* Hero Header */}
      <section className="relative px-6 py-24 md:py-40 overflow-hidden bg-[#050B14]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Vertical Mongolian Traditional Script Calligraphy Accent Background */}
          <div className="absolute right-[5%] bottom-10 opacity-10 select-none text-right font-serif text-3xl leading-none pointer-events-none hidden md:block text-brand-gold max-h-[80%] overflow-hidden truncate" style={{ writingMode: 'vertical-lr' }}>
            ᠮᠣᠩᠣᠯ ᠪᠢᠴᠢᠭ ᠡᠬᠡ ᠬᠡᠯᠡ ᠡᠷᠳᠡᠮ ᠪᠢᠯᠢᠭ
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: animY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, ease: "easeOut" }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-brand-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">
              {currentLang === 'mn' ? 'Хэл Сургалт' : currentLang === 'de' ? 'Sprachprogramm' : 'Bilateral Language Program'}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[2fr_1.2fr] gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: animY }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.1, ease: "easeOut" }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-none mb-6"
              >
                {currentLang === 'mn' ? 'Монгол' : currentLang === 'de' ? 'Mongolisch' : 'Learn'}{' '}
                <span className="italic text-brand-gold font-light">
                  {currentLang === 'mn' ? 'Хэл Сурах' : currentLang === 'de' ? 'lernen' : 'Mongolian'}
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: animY }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mb-8"
              >
                {currentLang === 'mn' 
                  ? 'Хилийн чанадад өсөн торниж буй монгол хүүхдүүд болон монгол хэл, зан заншлыг шимтэн сонирхогч гадаад хүмүүст зориулсан академик болон практик хосолсон албан ёсны сургалтын хөтөлбөр.'
                  : currentLang === 'de'
                  ? 'Strukturierte und kulturell integrative Sprachkurse in Wien. Maßgeschneidert für im Ausland lebende mongolische Kinder, um ihre Herkunftssprache zu stärken, sowie für internationale Abenteurer und Partner.'
                  : 'Structured and culturally rich language programs in Vienna. Tailored both for heritage kids seeking to master their mother tongue and international learners discovering the magical nomad lore and conversational flow.'}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: animY }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animDuration, delay: 0.3, ease: "easeOut" }}
                className="flex flex-wrap gap-4"
              >
                <a href="#pathways" className="px-8 py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-white transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-brand-gold/10">
                  {currentLang === 'mn' ? 'Хөтөлбөрүүд' : currentLang === 'de' ? 'Programme ansehen' : 'Explore Curriculums'}
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#playground" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-[10px] uppercase tracking-[0.25em] font-bold transition-all border border-white/10 flex items-center gap-2">
                  <Languages size={14} className="text-brand-gold animate-bounce" />
                  {currentLang === 'mn' ? 'Интерактив Самбар' : currentLang === 'de' ? 'Interaktives Board' : 'Speak Mongolian now!'}
                </a>
              </motion.div>
            </div>

            {/* Visual badge card with stylized traditional script */}
            <motion.div
              initial={{ opacity: 0, scale: isMobileViewport() ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1, rotate: isMobileViewport() ? 0 : 1 }}
              transition={{ duration: animDuration, delay: 0.2, ease: "easeOut" }}
              className="relative p-8 rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 h-full shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-white font-medium">Bilateral Certificate</h3>
                    <p className="text-xs text-white/50">{currentLang === 'mn' ? 'Австри дахь албан ёсны Verein' : 'Issued by MCA – Mongolian Center in Austria'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                    <span>Structured Levels (A1-B2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                    <span>Native Certified Instructors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                    <span>Hybrid (Vienna Center & Zoom)</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] tracking-wider uppercase font-black text-brand-gold">Next cohort starts:</span>
                  <span className="text-xs text-white font-mono bg-white/10 px-3 py-1 rounded-full">October 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pathways Selection section */}
      <section id="pathways" className="py-24 md:py-32 px-6 bg-brand-paper relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-[10px] tracking-[0.4em] uppercase font-bold relative inline-block mb-4">
              Dual Track Syllabus
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-ink">
              Choose Your <span className="italic text-brand-gold">Pathway</span>
            </h2>
            <p className="text-brand-ink/65 max-w-2xl mx-auto mt-4 font-light text-base md:text-lg">
              We offer unique target environments structured specifically to facilitate either preservation of cultural identity, or smooth conversational entry.
            </p>
          </div>

          {/* Tab Button Toggles */}
          <div className="flex justify-center mb-16">
            <div className="bg-brand-ink/5 p-1.5 rounded-full flex gap-2 border border-brand-ink/5 shadow-inner">
              <button
                onClick={() => setActiveTab('kids')}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'kids' 
                    ? 'bg-brand-ink text-white shadow-md' 
                    : 'text-brand-ink/65 hover:text-brand-ink hover:bg-brand-ink/5'
                }`}
              >
                <Users size={14} />
                {currentLang === 'mn' ? 'Монгол Хүүхдүүд' : currentLang === 'de' ? 'Für Kinder im Ausland' : 'Heritage Kids & Youth'}
              </button>
              <button
                onClick={() => setActiveTab('foreigners')}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'foreigners' 
                    ? 'bg-brand-ink text-white shadow-md' 
                    : 'text-brand-ink/65 hover:text-brand-ink hover:bg-brand-ink/5'
                }`}
              >
                <Languages size={14} />
                {currentLang === 'mn' ? 'Гадаад Хүмүүс' : currentLang === 'de' ? 'Für internationale Lerner' : 'Expats & Foreign Learners'}
              </button>
            </div>
          </div>

          {/* Pathways Content Card with Motion */}
          <AnimatePresence mode="wait">
            {activeTab === 'kids' ? (
              <motion.div 
                key="kids-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-12 items-center bg-white p-6 md:p-16 rounded-[44px] shadow-sm border border-brand-ink/5"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-brand-gold bg-brand-paper hover:bg-brand-paper/80 px-4 py-2 rounded-full font-serif italic text-sm">
                    <Sparkles size={14} />
                    <span>Preserving Core Identity</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif text-brand-ink leading-tight">
                    Mother school for children born & <span className="italic text-brand-gold">raised abroad</span>
                  </h3>
                  <p className="text-brand-ink/70 font-light leading-relaxed">
                    It is crucial for families living in Europe to sustain structural connection. Our children program helps kids master spoken fluency, read Cyrillic, understand traditional folklore, and even experience foundational traditional vertical script brush strokes.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Heritage sprouts:</strong> Interactive vocabulary, songs and fairy tales for ages 5-9.</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Grammar & History blocks:</strong> Reading custom modern materials, youth penpal program with peers in Ulaanbaatar for ages 10-15.</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Cultural integration circles:</strong> Biweekly offline gatherings, Naadam performances, and community theater.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                    <a href="#enroll" className="w-full sm:w-auto px-8 py-4 bg-brand-ink text-white font-bold text-center text-[10px] uppercase tracking-widest rounded-full hover:bg-brand-gold hover:text-brand-ink transition-colors duration-300">
                      Request Enrollment Details
                    </a>
                  </div>
                </div>

                <div className="relative aspect-video lg:aspect-[4/3] rounded-[36px] overflow-hidden bg-brand-ink border border-brand-ink/10 group shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1749704492960-c17ed9b91db5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Mongolian kids education"
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-ink/30" />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-brand-ink/5">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Class Schedule</span>
                    <h4 className="text-brand-ink font-serif font-bold text-lg mt-1">Saturday Cultural School</h4>
                    <p className="text-xs text-brand-ink/60 mt-1">Hybrid (Face-to-Face sessions in local Vienna rooms & Live Zoom streams)</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="foreigners-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-12 items-center bg-white p-6 md:p-16 rounded-[44px] shadow-sm border border-brand-ink/5"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-brand-gold bg-brand-paper hover:bg-brand-paper/80 px-4 py-2 rounded-full font-serif italic text-sm">
                    <Languages size={14} />
                    <span>Global Nomad Connections</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif text-brand-ink leading-tight">
                    Adult & traveler modules for <span className="italic text-brand-gold">foreign friends</span>
                  </h3>
                  <p className="text-brand-ink/70 font-light leading-relaxed">
                    Designed specifically for English and German speakers. This track breaks down the fascinating, high-consonant structure of modern Khalkha Mongolian. Learn essential travel greetings, conversational grammar patterns, and cultural etiquette before you depart on epic journeys to the central steppes.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Micro-conversations & phonetics:</strong> Mastering the specific guttural vowels, basic nomad hospitality norms.</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Grammar & Structure logic:</strong> SOV (Subject-Object-Verb) sentence structure made easy with simplified, color-coded templates.</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-light text-brand-ink/80"><strong className="font-semibold text-brand-ink">Custom expedition preparation:</strong> Tailored support for researchers, NGO volunteers, and adventure travelers.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                    <a href="#enroll" className="w-full sm:w-auto px-8 py-4 bg-brand-ink text-white font-bold text-center text-[10px] uppercase tracking-widest rounded-full hover:bg-brand-gold hover:text-brand-ink transition-colors duration-300">
                      Join Adult Beginner Cohort
                    </a>
                  </div>
                </div>

                <div className="relative aspect-video lg:aspect-[4/3] rounded-[36px] overflow-hidden bg-brand-ink border border-brand-ink/10 group shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1548089195-9167dd374516?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Foreigners learning Mongolian"
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105 animate-pulse-subtle"
                  />
                  <div className="absolute inset-0 bg-brand-ink/30" />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-brand-ink/5">
                    <span className="text-[10px] uppercase tracking-widest text-[#414] font-bold">Fast Track Class</span>
                    <h4 className="text-brand-ink font-serif font-bold text-lg mt-1">Expat Conversational Loop</h4>
                    <p className="text-xs text-brand-ink/60 mt-1">Every Wednesday night, online Zoom with professional native speakers</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Course List / Interactive Cards Section */}
      <section className="py-24 md:py-32 bg-gray-50 border-y border-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-brand-gold text-[10px] tracking-widest uppercase font-mono font-bold block mb-4">Syllabus Overview</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ink">Our Structured <span className="italic text-brand-gold">Courses</span></h2>
            </div>
            <p className="text-brand-ink/60 font-light max-w-sm mt-4 md:mt-0">All students receive study books, workbook PDFs, and custom sound resources published by the Mongolian Center.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "course-1",
                time: "2h / Week (Hybrid)",
                title: "Steppe Sprouts: Fun Alphabet",
                audience: "Kids (Ages 5-10)",
                desc: "Interactive introduction. Basic alphabet building, learning animal vocabulary, coloring Mongolian flags, and matching simple traditional tales.",
                lessons: ["Fairy Tales Audio clips", "Cyrillic Alphabet game", "Basic greeting customs (Zolgokh)"],
                status: "Enrollment Open"
              },
              {
                id: "course-2",
                time: "3h / Week (Hybrid)",
                title: "Nomad Teen: Advanced Cyrillic & Script",
                audience: "Kids & Teens (Ages 11-17)",
                desc: "Grammar optimization and reading. Introducing elements of Traditional Script (Bichig) brush writing, and essay workshops.",
                lessons: ["Bichig script introduction", "Peer-to-peer dialogues", "Mongolian Naadam trivia"],
                status: "Enrollment Open"
              },
              {
                id: "course-3",
                time: "1.5h / Week (Zoom - Nightly)",
                title: "Modern Khalkha Conversational A1",
                audience: "Adult Learners & Expats",
                desc: "Zero-barrier starting program. Clear pronunciation maps for guttural vowels, practical situational dialogues, and essential cultural etiquette.",
                lessons: ["Greeting a nomadic host in Ger", "Ger layout vocabulary", "Numbers, bargains, travel guides"],
                status: "Limited Spots left"
              }
            ].map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white rounded-[32px] border border-brand-ink/5 overflow-hidden flex flex-col justify-between hover:border-brand-gold/40 hover:shadow-xl transition-all duration-300 p-8 relative group"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] tracking-wider uppercase font-bold text-brand-gold bg-brand-paper px-3 py-1 rounded-full">{course.audience}</span>
                    <span className="text-[10px] text-brand-ink/50 font-mono text-right flex items-center gap-1">
                      <Clock size={10} /> {course.time}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif text-brand-ink tracking-tight mb-4 group-hover:text-brand-gold transition-colors">{course.title}</h3>
                  <p className="text-sm text-brand-ink/65 font-light leading-relaxed mb-6">{course.desc}</p>

                  <div className="space-y-2.5 mb-8 border-t border-brand-ink/5 pt-6">
                    <span className="text-[10px] uppercase font-bold text-brand-ink/40 tracking-wider block">Core highlights:</span>
                    {course.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2 text-xs text-brand-ink/80">
                        <BookMarked size={12} className="text-brand-gold shrink-0" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md font-semibold">{course.status}</span>
                  <a href="#enroll" className="text-xs font-[Arial] font-bold text-brand-gold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 uppercase tracking-wider">
                    Enquire <ChevronRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Core Panel Playground */}
      <section id="playground" className="py-24 px-6 bg-[#0B0F19] text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(197,160,89,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[#020202]/30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
              <Sparkles size={12} className="animate-pulse" />
              Interactive Steppe Board
            </span>
            <h2 className="text-4xl md:text-5xl font-serif">Learn Your <span className="italic text-brand-gold">First Phrases</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto mt-4 font-light text-sm md:text-base">
              Try clicking the useful everyday phrases below to hear pronunciation and explore the visual differences between Cyrillic and traditional Script.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
            {/* Left: Interactive list of phrases */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-10 backdrop-blur-md">
              <div className="flex flex-wrap gap-2.5 mb-8 pb-6 border-b border-white/5">
                {[
                  { code: 'all', title: 'All Everyday Phrases' },
                  { code: 'greetings', title: 'Greetings' },
                  { code: 'essentials', title: 'Essentials' },
                  { code: 'numbers', title: 'Numbers (Тоо)' },
                  { code: 'culture', title: 'Cultural' }
                ].map((tab) => (
                  <button
                    key={tab.code}
                    onClick={() => handlePhraseCatChange(tab.code as any)}
                    className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all duration-300 ${
                      phraseCategory === tab.code 
                        ? 'bg-brand-gold text-brand-ink' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPhrases.map((phrase) => (
                  <button
                    key={phrase.cyrillic}
                    onClick={() => setSelectedPhrase(phrase)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group ${
                      selectedPhrase.cyrillic === phrase.cyrillic
                        ? 'bg-brand-gold border-brand-gold text-brand-ink'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          selectedPhrase.cyrillic === phrase.cyrillic
                            ? 'bg-brand-ink/10 text-brand-ink'
                            : 'bg-white/10 text-brand-gold'
                        }`}>
                          {phrase.category}
                        </span>
                        <Volume2 size={14} className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all text-current" />
                      </div>
                      <h4 className="text-xl font-serif font-bold mt-3 leading-tight">{phrase.cyrillic}</h4>
                      <p className={`text-xs mt-1.5 font-light ${
                        selectedPhrase.cyrillic === phrase.cyrillic ? 'text-brand-ink/80' : 'text-white/50'
                      }`}>
                        {phrase.translit}
                      </p>
                    </div>
                    <span className="text-xs font-semibold mt-4 block underline">
                      {currentLang === 'mn' ? phrase.mongolian : currentLang === 'de' ? phrase.german : phrase.english}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Display Board details */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-md sticky top-32 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-bold block mb-4">Practice Studio</span>
                
                <div className="bg-[#020202]/30 p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center relative min-h-[220px]">
                  {/* Traditional Vertical Script Overlay */}
                  <div className="absolute right-4 top-4 text-brand-gold/15 text-2xl" style={{ writingMode: 'vertical-lr' }}>
                    {selectedPhrase.script}
                  </div>

                  <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                    {selectedPhrase.cyrillic}
                  </h3>
                  <p className="text-brand-gold font-light text-base italic mb-4">
                    \"{selectedPhrase.translit}\"
                  </p>
                  
                  <div className="w-12 h-px bg-white/15 mb-4" />

                  <p className="text-sm text-white/80 font-light max-w-xs block mb-1">
                    <strong className="text-xs uppercase text-white/50 block mb-1 tracking-widest font-sans">Translation</strong>
                    {currentLang === 'mn' ? selectedPhrase.mongolian : currentLang === 'de' ? selectedPhrase.german : selectedPhrase.english}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Pronunciation Audio Check:</span>
                    <span className="text-brand-gold font-mono">{selectedPhrase.audioDesc}</span>
                  </div>

                  <button
                    onClick={() => playTTSMock(selectedPhrase)}
                    className="w-full py-4 bg-brand-gold text-brand-ink hover:bg-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-gold/10 flex items-center justify-center gap-3"
                  >
                    <Volume2 size={16} />
                    Listen Pronunciation Guide
                  </button>
                </div>
              </div>

              {/* Quick Knowledge Check Interactive Quiz */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-brand-gold font-bold uppercase tracking-wider">Mini Vocab Quiz</span>
                  <span className="text-xs font-mono font-bold">{currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                </div>

                {!quizCompleted ? (
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                    <span className="text-xs text-white/50 block mb-1">What is the meaning of:</span>
                    <h5 className="font-serif text-lg font-bold text-white mb-4 italic">"{QUIZ_QUESTIONS[currentQuizIndex].phrase}"</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleQuizAnswer(opt)}
                          className={`p-3 rounded-lg text-xs font-bold text-left transition-all max-sm:text-[10px] break-words ${
                            quizAnswered
                              ? opt === QUIZ_QUESTIONS[currentQuizIndex].correct
                                ? 'bg-emerald-500 text-white'
                                : opt === selectedOption
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-white/5 text-white/40'
                              : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                          disabled={quizAnswered}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizAnswered && (
                      <button
                        onClick={handleNextQuiz}
                        className="mt-4 w-full py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        {currentQuizIndex === QUIZ_QUESTIONS.length - 1 ? "See Results" : "Next Question"} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                    <span className="text-sm font-bold text-brand-gold block mb-1">Quiz Completed!</span>
                    <p className="text-xs text-white/70 mb-4">You scored {quizScore} / {QUIZ_QUESTIONS.length} correct translations.</p>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-2 bg-brand-gold text-brand-ink hover:bg-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classroom environment & Location Context */}
      <section className="py-24 md:py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <span className="text-brand-gold uppercase tracking-[0.3em] font-mono text-[10px] font-bold">Class Environment</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ink">In-person & hybrid learning in <span className="italic text-brand-gold">Vienna</span></h2>
              <p className="text-brand-ink/75 font-light leading-relaxed">
                Our local classroom settings are nestled in the beautifully accessible quarters of Vienna, matching state-of-the-art educational infrastructure with highly qualified, certified native teachers. For those unable to commute, our robust hybrid systems integrate classroom streams with real-time Zoom modules, interactive group whiteboard notes, and recorded recaps.
              </p>

              <div className="space-y-4 pt-4 border-t border-brand-ink/5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-brand-ink text-base">Classroom Location</h4>
                    <p className="text-sm text-brand-ink/65 mt-0.5">Wehlistrasse 328, 1020 Vienna (Close to U2 Donaumarina station or hybrid online)</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-brand-ink text-base">Hybrid Zoom Equipment</h4>
                    <p className="text-sm text-brand-ink/65 mt-0.5">High definition 360-degree interactive camera array for immersive hybrid remote attendance</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-brand-ink text-base">Course Timetable</h4>
                    <p className="text-sm text-brand-ink/65 mt-0.5">Weekend options (for kids) and bi-weekly evening modules (for adults)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-[2rem] overflow-hidden aspect-[3/4] border border-brand-ink/5 bg-brand-ink shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1749704492960-c17ed9b91db5?q=80&w=1170&auto=format&fit=crop" 
                    alt="Classroom presentation" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <div className="bg-brand-gold/10 p-8 rounded-[2rem] border border-brand-gold/20 flex flex-col justify-center">
                  <span className="text-2xl font-serif font-bold text-brand-gold block">100%</span>
                  <span className="text-xs text-brand-ink/60 uppercase tracking-wider font-bold mt-1">Native teachers based in Austria</span>
                </div>
              </div>

              <div className="space-y-4 pt-12">
                <div className="bg-brand-ink text-white p-8 rounded-[2rem] flex flex-col justify-center">
                  <span className="text-3xl font-serif font-bold text-brand-gold block">20+</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-bold mt-1">Austrian students connected in 2026</span>
                </div>
                <div className="rounded-[2rem] overflow-hidden aspect-[3/4] border border-brand-ink/5 bg-brand-ink shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1605509818829-ac62b9142944?q=80&w=1000&auto=format&fit=crop" 
                    alt="Mongolian books and traditional calligraphies" 
                    className="w-full h-full object-cover transition-all duration-750" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Inquiry Enrollment Form with premium styling */}
      <section id="enroll" className="py-24 md:py-32 bg-[#020202] text-white px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(197,160,89,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-gold uppercase tracking-[0.3em] font-mono text-[10px] font-bold">Enrollment Request</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">Inquire For <span className="italic text-brand-gold">Your Seat</span></h2>
            <p className="text-white/60 max-w-xl mx-auto mt-4 font-light text-sm">
              Spaces in the upcoming October 2026 cohorts are restricted to maintain optimal tutor-to-student ratios. Register your initial inquiry to lock in details.
            </p>
          </div>

          {!formIsCompleted ? (
            <form onSubmit={handleFormSubmit} className="bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-12 backdrop-blur-md space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider font-bold text-white/70">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sarah Gruber"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors outline-none text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-white/70">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. sarah.gruber@domain.at"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-wider font-bold text-white/70">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +43 664..."
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors outline-none text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="track" className="text-xs uppercase tracking-wider font-bold text-white/70">Selected Pathway</label>
                  <select
                    id="track"
                    value={formData.track}
                    onChange={(e) => setFormData({...formData, track: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-[#151a25] border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors outline-none text-white text-sm"
                  >
                    <option value="heritage-kids">Mother School: Kids (Ages 5-10)</option>
                    <option value="heritage-teens">Mother School: Youth (Ages 11-17)</option>
                    <option value="adult-conversational">Modern Conversational: Adult Beginners</option>
                    <option value="private-tutoring">Custom Specialized Private Lessons</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="text-xs uppercase tracking-wider font-bold text-white/70">Current Mongolian Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'beginner', title: 'Absolute Beginner' },
                    { code: 'medium', title: 'Conversational' },
                    { code: 'advanced', title: 'Native / Fluent' }
                  ].map((level) => (
                    <button
                      key={level.code}
                      type="button"
                      onClick={() => setFormData({...formData, level: level.code})}
                      className={`p-4 rounded-xl border text-center transition-all text-xs font-semibold ${
                        formData.level === level.code
                          ? 'bg-brand-gold border-brand-gold text-brand-ink font-bold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {level.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-xs uppercase tracking-wider font-bold text-white/70">Inquiry Objectives & Special Requests</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Tell us about your context, e.g., 'For my 8-year old daughter growing up in Vienna to improve writing,' or 'For travel prep next summer...'"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors outline-none text-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={formIsSubmitting}
                className="w-full py-5 bg-brand-gold text-brand-ink uppercase font-bold text-xs tracking-[0.3em] rounded-full hover:bg-white transition-all shadow-xl shadow-brand-gold/10 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {formIsSubmitting ? "Submitting Inquiry..." : "Submit Enrollment Inquiry"}
                <ArrowRight size={14} />
              </button>

            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center backdrop-blur-md space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mx-auto">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-serif text-white">Inquiry Successfully Registered!</h3>
              <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for choosing the Mongolian Center languages program. Academic registration details, pricing schemes, and lesson dates have been forwarded to your email address: <strong className="text-brand-gold">{formData.email}</strong>
              </p>
              <button
                onClick={() => setFormIsCompleted(false)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Register another student
              </button>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}
