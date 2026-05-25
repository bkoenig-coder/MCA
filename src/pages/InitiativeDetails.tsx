import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InitiativeDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const getInitiativeData = () => {
    switch (id) {
      case 'preservation':
        return {
          title: currentLang === 'mn' ? 'Соёлын өвийг хадгалах' : currentLang === 'de' ? 'Kulturelle Bewahrung' : 'Cultural Preservation',
          desc: currentLang === 'mn' 
            ? 'Монголын уламжлалт урлаг, хөгжим, утга зохиолыг тусгай сургалт, архивын төслүүдээр дамжуулан хамгаалах, сурталчлах.' 
            : currentLang === 'de' 
            ? 'Schutz und Förderung der traditionellen mongolischen Kunst, Musik und Literatur durch engagierte Workshops und Archivprojekte.' 
            : 'Protecting and promoting traditional Mongolian arts, music, and literature through dedicated workshops and archival projects.',
          fullDesc: currentLang === 'mn'
            ? 'Соёлын өвийг хамгаалах санаачилга нь манай үйл ажиллагааны гол цөм юм. Бид соёлын тусгай сургалт зохион байгуулж, уран бүтээлчдийг дэмжин, ховор монгол гар бичмэл, хөгжмийн бичлэгүүдийг дижитал хэлбэрт шилжүүлдэг. Эдгээр үнэт өвүүдийг хамгаалснаар ирээдүй хойч үе маань Монголын баялаг соёлын өвийг мэдэх, суралцах боломжийг бүрдүүлж байгаа юм.'
            : currentLang === 'de'
            ? 'Unsere Initiative zur Bewahrung der Kultur liegt uns besonders am Herzen. Wir veranstalten spezialisierte Workshops, unterstützen anwesende Künstler und digitalisieren aktiv seltene mongolische Manuskripte und Musikaufnahmen. Durch den Schutz dieser Schätze stellen wir sicher, dass zukünftige Generationen das reiche Erbe der Mongolei erleben und von ihm lernen können.'
            : "Our Cultural Preservation initiative is at the heart of what we do. We host specialized workshops, support artists in residence, and actively digitize rare Mongolian manuscripts and musical recordings. By safeguarding these treasures, we ensure that future generations can experience and learn from Mongolia's rich heritage.",
          image: "https://images.unsplash.com/photo-1745155541633-da6d9bb28f5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          goals: currentLang === 'mn'
            ? ["Аман түүхийн 500 гаруй баримтыг архивлах", "Жил бүр 10 уламжлалт уран бүтээлчийг дэмжих", "Орчуулсан утга зохиолын бүтээлийг хэвлэн нийтлэх"]
            : currentLang === 'de'
            ? ["Über 500 mündliche Überlieferungen archivieren", "Jährlich 10 traditionelle Künstler unterstützen", "Übersetzte literarische Werke veröffentlichen"]
            : ["Archive 500+ oral histories", "Support 10 traditional artists annually", "Publish translated literary works"]
        };
      case 'bridge':
        return {
          title: currentLang === 'mn' ? 'Эдийн засгийн гүүр' : currentLang === 'de' ? 'Wirtschaftliche Brücke' : 'Economic Bridge',
          desc: currentLang === 'mn'
            ? 'Австри болон Монголын аж ахуйн нэгжүүдийн хооронд худалдаа, хөрөнгө оруулалтын боломжийг хөнгөвчлөх.'
            : currentLang === 'de'
            ? 'Erleichterung von Handels- und Investitionsmöglichkeiten zwischen österreichischen und mongolischen Unternehmen.'
            : 'Facilitating trade and investment opportunities between Austrian and Mongolian enterprises.',
          fullDesc: currentLang === 'mn'
            ? 'Эдийн засгийн гүүр хөтөлбөр нь бизнесийн хүрээнийхнийг нэгтгэдэг. Худалдааны төлөөлөгчдийн уулзалт, хүлээн авалт, зах зээлийн судалгаагаар дамжуулан бид саад бэрхшээлийг арилгаж, харилцан худалдааг дэмждэг. Энэ нь хоёр талын зах зээлд харилцан ашигтай хамтын ажиллагааг хөгжүүлэх тухай юм.'
            : currentLang === 'de'
            ? 'Das Wirtschaftliche-Brücken-Programm bringt Geschäftsgemeinschaften zusammen. Durch Handelsmissionen, Networking-Events und Marktanalysen bauen wir regulatorische Hürden ab und fördern den gegenseitigen Handel. Es geht darum, die Zusammenarbeit zu stärken und gleichzeitig gemeinsamen Nutzen auf unseren bilateralen Märkten zu finden.'
            : "The Economic Bridge program brings business communities together. Through trade missions, networking events, and market insights, we break down regulatory barriers and foster mutual trade. It's about celebrating cooperation while finding common mutual benefits in our bilateral markets.",
          image: "https://images.unsplash.com/photo-1623266880158-c683344cd073?q=80&w=765&auto=format&fit=crop",
          goals: currentLang === 'mn'
            ? ["Улирал тутам бизнесийн форум зохион байгуулах", "Хоёр талын бизнес түншлэлийг дэмжих", "Худалдааны төлөөлөгчдийн айлчлалыг зохион байгуулах"]
            : currentLang === 'de'
            ? ["Vierteljährliche Unternehmensforen veranstalten", "Bilaterale Geschäftskopplungen erleichtern", "Besuche von Handelsdelegationen organisieren"]
            : ["Host quarterly corporate forums", "Facilitate bilateral business pairings", "Organize trade delegation visits"]
        };
      case 'exchange':
        return {
          title: currentLang === 'mn' ? 'Боловсролын солилцоо' : currentLang === 'de' ? 'Bildungsaustausch' : 'Educational Exchange',
          desc: currentLang === 'mn'
            ? 'Академик хамтын ажиллагаа болон оюутан солилцооны хөтөлбөрүүдийн замыг бий болгох.'
            : currentLang === 'de'
            ? 'Schaffung von Wegen für akademische Zusammenarbeit und Studentenaustauschprogramme.'
            : 'Creating pathways for academic collaboration and student exchange programs.',
          fullDesc: currentLang === 'mn'
            ? 'Боловсролд хөрөнгө оруулах нь бидний ирээдүйд хийж буй хөрөнгө оруулалт юм. Бидний Боловсролын солилцооны санаачилга нь гадаадад суралцах оюутнуудад тэтгэлэг олгох, их дээд сургуулиудын хамтарсан сургалт зохион байгуулах, залуу эрдэмтдийг зөвлөхүүдтэй холбох зорилготой юм.'
            : currentLang === 'de'
            ? 'Die Investition in Bildung ist ein Investment in unsere Zukunft. Unsere Initiative zum Bildungsaustausch bietet Stipendien für Auslandsaufenthalte von Studenten, organisiert Partnerworkshops an Universitäten und verbindet junge Wissenschaftler mit Mentoren über Grenzen hinweg.'
            : "Investing in education is investing in our future. Our Educational Exchange initiative provides scholarships for students to study abroad, organizes university partner workshops, and connects young scholars with mentors across borders. We aim to nurture future leaders who appreciate bilateral ties.",
          image: "https://images.unsplash.com/photo-1645539818874-1801c031a86a?q=80&w=880&auto=format&fit=crop",
          goals: currentLang === 'mn'
            ? ["Жил бүр 25 тэтгэлэг олгох", "Их дээд сургууль хоорондын түншлэл тогтоох", "Өвлийн академик солилцооны лагерь ажиллуулах"]
            : currentLang === 'de'
            ? ["Jährlich 25 Stipendien vergeben", "Interuniversitäre Partnerschaften aufbauen", "Akademische Winteraustauschcamps veranstalten"]
            : ["Award 25 annual scholarships", "Run summer leadership camps", "Establish a youth mentorship network"]
        };
      default:
        return null;
    }
  };

  const initiative = getInitiativeData();

  if (!initiative) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center bg-brand-paper px-6">
        <h1 className="text-3xl font-serif text-brand-ink mb-6">
          {currentLang === 'mn' ? 'Санаачилга олдсонгүй' : currentLang === 'de' ? 'Initiative nicht gefunden' : 'Initiative Not Found'}
        </h1>
        <Link to="/impact" className="flex items-center gap-2 text-brand-gold hover:text-brand-ink transition-colors font-sans uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> 
          {currentLang === 'mn' ? 'Хандив руу буцах' : currentLang === 'de' ? 'Zurück zur Wirkung' : 'Return to Impact'}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[110px] pb-24 bg-brand-paper min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link 
          to="/impact" 
          className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors font-sans uppercase tracking-[0.2em] text-[10px] font-bold mb-12"
        >
          <ArrowLeft size={14} /> 
          {currentLang === 'mn' ? 'Ухрах' : currentLang === 'de' ? 'Zurück zur Übersicht' : 'Return to Impact'}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={initiative.image} 
                alt={initiative.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-ink/10 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-4"
          >
            <div className="text-[10px] text-brand-gold font-bold tracking-[0.3em] uppercase mb-4">
              {currentLang === 'mn' ? 'Санаачилга' : currentLang === 'de' ? 'Initiative' : 'Initiative'}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-ink leading-tight mb-8">
              {initiative.title}
            </h1>
            
            <p className="text-lg md:text-xl text-brand-ink/70 leading-relaxed font-light mb-10">
              {initiative.fullDesc}
            </p>
            
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-brand-ink mb-6">
                {currentLang === 'mn' ? 'Гол зорилтууд' : currentLang === 'de' ? 'Hauptziele' : 'Key Goals'}
              </h3>
              <ul className="space-y-4">
                {initiative.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                      <ShieldCheck size={12} />
                    </div>
                    <span className="text-brand-ink/80 text-sm md:text-base">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
