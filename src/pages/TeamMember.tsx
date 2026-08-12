import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Linkedin } from 'lucide-react';
import margadPic from '../assets/media/margadpic.png';
import berniPic from '../assets/media/bernipic.png';
import chinggisPic from '../assets/media/chinggiskhan1.png';
import { useTranslation } from 'react-i18next';

export default function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const members = [
    { 
      id: "margad-erdene-ganbold",
      name: "Margad-Erdene Ganbold", 
      role: t('about.team.roles.director', 'Managing Director'), 
      image: margadPic,
      bio: "Margad-Erdene brings an extensive background in fostering Mongolian-Austrian cultural ties. With his proven leadership, he spearheads overall strategy and curates impactful programs that unite both communities. His proactive vision allows our organizations and partners to continuously thrive and expand.",
      skills: ["Leadership", "Cultural Strategy", "Bilateral Relations"]
    },
    { 
      id: "bernadette-konig",
      name: "Bernadette König", 
      role: t('about.team.roles.manager', 'Operations Manager'), 
      image: berniPic,
      bio: "Bernadette König is an Austrian cellist and accomplished young artist with extensive experience in solo, chamber music, and orchestral performance. She studied at the Music and Arts University of the City of Vienna (MUK), where she completed her Bachelor's degree with a performance scholarship and is currently pursuing her Master's degree.\n\nShe has performed at renowned venues including the Vienna Musikverein, Vienna Rathaus, Hofburg, and Schloss Schönbrunn, and has received multiple First Prizes at the Austrian national Prima la Musica competition in both solo and chamber music categories.\n\nAs the wife of Mongolian Center in Austria founder Margad-Erdene Ganbold, Bernadette is also closely involved in supporting cultural exchange and strengthening the connections between Austrian and Mongolian communities through music and the arts.",
      skills: ["Cellist & Music Performance", "Operations & Event Management", "Austrian-Mongolian Cultural Exchange"]
    },
    { 
      id: "batmunkh-unenbaatar",
      name: "Batmunkh Unenbaatar", 
      role: t('about.team.roles.outreach', 'Community Outreach'), 
      image: chinggisPic,
      bio: "Batmunkh is the community glue of our organization. He specializes in maintaining strong relationships with artists, local institutions, and community leaders. By developing meaningful cultural programs, he promotes cross-border heritage appreciation and widespread engagement.",
      skills: ["Community Building", "Public Relations", "Cultural Outreach"]
    }
  ];

  const member = members.find(m => m.id === id);

  if (!member) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center bg-brand-paper px-6">
        <h1 className="text-3xl font-serif text-brand-ink mb-6">Member Not Found</h1>
        <Link to="/about" className="flex items-center gap-2 text-brand-gold hover:text-brand-ink transition-colors font-sans uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Returns to About
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[110px] pb-24 bg-brand-paper min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link 
          to="/about" 
          className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors font-sans uppercase tracking-[0.2em] text-[10px] font-bold mb-12"
        >
          <ArrowLeft size={14} /> 
          {t('common.back', 'Return to About')}
        </Link>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-[#020202]">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-brand-gold/10 rounded-[2rem] pointer-events-none" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7 pt-4"
          >
            <div className="text-[10px] text-brand-gold font-bold tracking-[0.3em] uppercase mb-4">
              {member.role}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-ink leading-tight mb-8">
              {member.name}
            </h1>
            
            <p className="text-lg md:text-xl text-brand-ink/80 leading-relaxed max-w-2xl font-serif italic mb-10 whitespace-pre-line">
              {member.bio}
            </p>
            
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-brand-ink mb-4">Core Focus</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 border border-brand-ink/10 rounded-full text-xs font-sans text-brand-ink/60 bg-white shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="mailto:contact@mongoliancenter.org" className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/60 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300">
                <Mail size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/60 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
