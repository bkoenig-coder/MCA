import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Building2, Globe, Link as LinkIcon, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Altai Corporation",
    type: "Institutional",
    industry: "Logistics & Trade",
    location: "Vienna, Austria",
    website: "https://example.com",
    logo: "A"
  },
  {
    id: 2,
    name: "Batzorig Vaanchig",
    type: "Professional",
    industry: "Arts & Culture",
    location: "Salzburg, Austria",
    website: "https://example.com",
    logo: "B"
  },
  {
    id: 3,
    name: "Tenger Tech",
    type: "Institutional",
    industry: "Technology",
    location: "Ulaanbaatar, Mongolia",
    website: "https://example.com",
    logo: "T"
  },
  {
    id: 4,
    name: "Elena Schmidt",
    type: "Student & Youth",
    industry: "International Relations",
    location: "Vienna, Austria",
    website: "",
    logo: "E"
  },
  {
    id: 5,
    name: "Steppe Consult",
    type: "Institutional",
    industry: "Consulting",
    location: "Graz, Austria",
    website: "https://example.com",
    logo: "S"
  },
  {
    id: 6,
    name: "Naranbold Ganbold",
    type: "Professional",
    industry: "Finance",
    location: "Vienna, Austria",
    website: "https://example.com",
    logo: "N"
  }
];

export default function MembersDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || member.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-brand-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">Directory</span>
            <div className="h-px w-12 bg-brand-gold/50" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif text-brand-ink mb-6 tracking-tight"
          >
            Our <span className="italic text-brand-gold">Members</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-brand-ink/60 font-light max-w-3xl leading-relaxed"
          >
            Discover the organizations and individuals who make up our vibrant bilateral community. 
            Connect, collaborate, and grow with the Mongolian Center's network.
          </motion.p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[32px] p-6 mb-12 shadow-sm border border-brand-ink/5 flex flex-col md:flex-row gap-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search members by name or industry..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-brand-paper border-none focus:ring-2 focus:ring-brand-gold focus:outline-none placeholder-brand-ink/30 text-brand-ink"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['All', 'Institutional', 'Professional', 'Student & Youth'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`whitespace-nowrap px-6 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                  filterType === type 
                    ? 'bg-brand-gold text-brand-ink' 
                    : 'bg-brand-paper text-brand-ink/60 hover:bg-brand-ink/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white rounded-[24px] p-8 border border-brand-ink/5 hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-paper flex items-center justify-center text-2xl font-serif text-brand-gold border border-brand-ink/5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {member.logo}
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold ${
                  member.type === 'Institutional' ? 'bg-brand-ink/5 text-brand-ink' : 
                  member.type === 'Professional' ? 'bg-brand-gold/10 text-brand-gold' : 
                  'bg-brand-paper text-brand-ink/50 border border-brand-ink/10'
                }`}>
                  {member.type}
                </span>
              </div>
              
              <h3 className="text-xl font-serif text-brand-ink mb-2">{member.name}</h3>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-brand-ink/60 text-sm">
                  <Briefcase size={16} className="text-brand-gold" />
                  <span>{member.industry}</span>
                </div>
                <div className="flex items-center gap-3 text-brand-ink/60 text-sm">
                  <MapPin size={16} className="text-brand-gold" />
                  <span>{member.location}</span>
                </div>
                {member.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <LinkIcon size={16} className="text-brand-gold" />
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-brand-ink/60 hover:text-brand-gold transition-colors truncate">
                      {member.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="col-span-full py-20 text-center text-brand-ink/40">
              <p className="text-lg font-light">No members found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-brand-ink rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
           
           <div className="relative z-10 max-w-2xl mx-auto">
             <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">Not listed yet?</h3>
             <p className="text-white/60 font-light mb-8">
               Join our network to get featured in our directory and connect with other professionals.
             </p>
             <Link 
               to="/membership"
               className="inline-block px-8 py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-colors duration-300"
             >
               Become a Member
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
