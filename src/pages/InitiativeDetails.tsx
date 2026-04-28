import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InitiativeDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const initiatives = [
    {
      id: "preservation",
      title: t('impact.initiatives.preservation', 'Cultural Preservation'),
      desc: t('impact.initiatives.preservationDesc', 'Protecting and promoting traditional Mongolian arts, music, and literature through dedicated workshops and archival projects.'),
      fullDesc: "Our Cultural Preservation initiative is at the heart of what we do. We host specialized workshops, support artists in residence, and actively digitize rare Mongolian manuscripts and musical recordings. By safeguarding these treasures, we ensure that future generations can experience and learn from Mongolia's rich heritage.",
      image: "https://images.unsplash.com/photo-1745155541633-da6d9bb28f5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      goals: ["Archive 500+ oral histories", "Support 10 traditional artists annually", "Publish translated literary works"]
    },
    {
      id: "bridge",
      title: t('impact.initiatives.bridge', 'Community Bridge'),
      desc: t('impact.initiatives.bridgeDesc', 'Creating meaningful connections between the Mongolian diaspora and local Austrian communities via shared events and festivals.'),
      fullDesc: "The Community Bridge program brings people together. Through cross-cultural festivals, food tasting events, and language exchange programs, we break down barriers and foster mutual understanding. It's about celebrating diversity while finding common ground in our shared humanity.",
      image: "https://images.unsplash.com/photo-1623266880158-c683344cd073?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      goals: ["Host quarterly community festivals", "Facilitate language exchange pairings", "Organize joint cultural exhibitions"]
    },
    {
      id: "exchange",
      title: t('impact.initiatives.exchange', 'Youth Exchange'),
      desc: t('impact.initiatives.exchangeDesc', 'Empowering the next generation with scholarships and cross-cultural study programs to build a connected future.'),
      fullDesc: "Investing in youth is investing in our future. Our Youth Exchange initiative provides scholarships for students to study abroad, organizes summer camps focusing on leadership, and connects young professionals with mentors across borders. We aim to nurture global citizens who appreciate their roots.",
      image: "https://images.unsplash.com/photo-1645539818874-1801c031a86a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      goals: ["Award 25 annual scholarships", "Run summer leadership camps", "Establish a youth mentorship network"]
    }
  ];

  const initiative = initiatives.find(i => i.id === id);

  if (!initiative) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center bg-brand-paper px-6">
        <h1 className="text-3xl font-serif text-brand-ink mb-6">Initiative Not Found</h1>
        <Link to="/impact" className="flex items-center gap-2 text-brand-gold hover:text-brand-ink transition-colors font-sans uppercase tracking-widest text-xs font-bold">
          <ArrowLeft size={16} /> Return to Impact
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
          {t('common.back', 'Return to Impact')}
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
              Initiative
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-ink leading-tight mb-8">
              {initiative.title}
            </h1>
            
            <p className="text-lg md:text-xl text-brand-ink/70 leading-relaxed font-light mb-10">
              {initiative.fullDesc}
            </p>
            
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-brand-ink mb-6">Key Goals</h3>
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
