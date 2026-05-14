import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Users, Calendar, Award, CheckCircle2, ChevronRight, Building2, GraduationCap, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import amoxLogo from '../assets/media/amoxlogo.png';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euactiveLogo from '../assets/media/euactivelogo.png';
import mcaLogo from '../assets/media/mcalogo-1.png';

const partners = [
  { name: "AMOX", logo: amoxLogo },
  { name: "Deutschothek", logo: deutschotekLogo },
  { name: "EU Active", logo: euactiveLogo },
  { name: "MCA", logo: mcaLogo },
];

export default function Membership() {
  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-ink">
          <img 
            src="https://images.unsplash.com/photo-1577563908411-5079b62ca060?auto=format&fit=crop&q=80&w=2000" 
            alt="Diplomacy and Networking" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-brand-ink/50 to-brand-ink" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-brand-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">Membership</span>
            <div className="h-px w-12 bg-brand-gold/50" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 tracking-tight"
          >
            Become a <span className="italic text-brand-gold">Member</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Join a growing platform connecting Austria and Mongolia through culture, education, business, and international cooperation.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 group">
              Individual Membership
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-500 flex items-center justify-center gap-3">
              Institutional Partnership
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-6">
              Why <span className="italic text-brand-gold">Join Us?</span>
            </h2>
            <p className="text-xl text-brand-ink/60 font-light max-w-2xl mx-auto">
              Unlock exclusive opportunities and become part of a premier bilateral network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users size={24} />,
                title: "Professional Network",
                desc: "Connect with professionals, students, institutions, and cultural leaders."
              },
              {
                icon: <Calendar size={24} />,
                title: "Exclusive Events",
                desc: "Access forums, conferences, cultural evenings, and networking receptions."
              },
              {
                icon: <Globe size={24} />,
                title: "International Cooperation",
                desc: "Participate in Austria–Mongolia initiatives and collaborations."
              },
              {
                icon: <Award size={24} />,
                title: "Community & Identity",
                desc: "Become part of a modern Mongolia-focused international community in Austria."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="group bg-white p-10 rounded-[32px] border border-brand-ink/5 hover:border-brand-gold/30 hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
                
                <div className="w-16 h-16 rounded-2xl bg-brand-ink/5 text-brand-gold flex items-center justify-center mb-8 relative z-10 group-hover:bg-brand-gold group-hover:text-brand-ink transition-colors duration-500">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-serif text-brand-ink mb-4 relative z-10">{feature.title}</h3>
                <p className="text-brand-ink/60 font-light leading-relaxed relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Value Proposition */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-6 leading-tight">
                Empowering Your <br/>
                <span className="italic text-brand-gold">Corporate Vision</span>
              </h2>
              <p className="text-lg text-brand-ink/60 font-light mb-8 leading-relaxed">
                We bridge the gap between Austrian precision and Mongolian potential. As a corporate partner, you gain direct access to political, economic, and cultural stakeholders in both markets. 
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: "Bilateral Trade Network", desc: "Access verified business contacts and navigate new market opportunities with our institutional support." },
                  { title: "Brand Elevation", desc: "Showcase your organization's commitment to international cooperation across our premium communications." },
                  { title: "Talent & Mobility", desc: "Connect with high-potential bilingual professionals and students bridging both cultures." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif text-brand-ink mb-1">{item.title}</h4>
                      <p className="text-sm text-brand-ink/60 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden"
            >
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" alt="Corporate Meeting" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-brand-ink/20" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-ink">
                      <Award size={24} />
                    </div>
                    <div>
                      <h5 className="text-white font-bold tracking-wider uppercase text-xs">Excellence Guarantee</h5>
                      <div className="text-white/60 font-light text-xs">Verified by the Board</div>
                    </div>
                  </div>
                  <p className="text-white/80 font-light text-sm italic">
                    "Partnering with the Center has opened unprecedented doors for our cross-border projects, providing cultural context and essential business diplomacy."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 md:py-40 px-6 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-gold/5 rounded-[100%] blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-32 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-6">
                Membership <span className="italic text-brand-gold">Tiers</span>
              </h2>
              <p className="text-xl text-brand-ink/60 font-light leading-relaxed">
                Choose the level of engagement that best aligns with your goals and organizational structure.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">
              <span>Annual</span>
              <div className="w-12 h-6 bg-brand-gold/20 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-brand-gold rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Tier 1: Student */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-brand-paper p-10 md:p-12 rounded-[40px] border border-brand-ink/5 hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full bg-brand-ink/5 flex items-center justify-center text-brand-ink mb-8">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-serif text-brand-ink mb-2">Student & Youth</h3>
              <p className="text-brand-ink/60 font-light text-sm mb-8 h-10">Affordable annual membership for students and young professionals.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-brand-ink">€25</span>
                <span className="text-brand-ink/40 font-light"> / year</span>
              </div>
              <div className="space-y-4 mb-10">
                {['Access to community events', 'Student networking sessions', 'Newsletter updates', 'Voting rights at general assembly'].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-brand-ink/70 font-light text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full border border-brand-ink/20 text-brand-ink text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300">
                Apply Now
              </button>
            </motion.div>

            {/* Tier 2: Professional (Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-brand-ink text-white p-10 md:p-14 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden transform lg:-translate-y-4"
            >
              {/* Premium Background Effects */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/20 rounded-full blur-[80px]" />
              
              <div className="absolute top-8 right-8">
                <span className="bg-brand-gold text-brand-ink px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold">Recommended</span>
              </div>

              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-brand-gold mb-8 relative z-10 backdrop-blur-md">
                <Briefcase size={24} />
              </div>
              <h3 className="text-3xl font-serif mb-2 relative z-10">Professional</h3>
              <p className="text-white/60 font-light text-sm mb-8 h-10 relative z-10">For professionals, entrepreneurs, academics, and creatives.</p>
              <div className="mb-8 relative z-10">
                <span className="text-5xl font-serif">€80</span>
                <span className="text-white/40 font-light"> / year</span>
              </div>
              <div className="space-y-4 mb-10 relative z-10">
                {['Full access to professional network', 'Discounted event tickets', 'Exclusive networking dinners', 'Priority registration for forums', 'Directory listing', 'Voting rights at general assembly'].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-white/80 font-light text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-5 rounded-full bg-brand-gold text-brand-ink text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300 shadow-xl relative z-10">
                Apply as Professional
              </button>
            </motion.div>

            {/* Tier 3: Institutional */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-brand-paper p-10 md:p-12 rounded-[40px] border border-brand-ink/5 hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full bg-brand-ink/5 flex items-center justify-center text-brand-ink mb-8">
                <Building2 size={24} />
              </div>
              <h3 className="text-2xl font-serif text-brand-ink mb-2">Institutional</h3>
              <p className="text-brand-ink/60 font-light text-sm mb-8 h-10">For companies, universities, embassies, NGOs, and organizations.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-brand-ink">Custom</span>
              </div>
              <div className="space-y-4 mb-10">
                {['Up to 5 delegate memberships', 'Logo placement as partner', 'Co-hosting opportunities', 'B2B/B2G matchmaking support', 'Premium directory profile'].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-brand-ink/70 font-light text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-full border border-brand-ink/20 text-brand-ink text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300">
                Contact Foundation
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-24 md:py-32 px-6 bg-brand-ink text-white relative border-y border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 inline-flex flex-col items-center">
              <span className="text-brand-gold block mb-2 text-sm uppercase tracking-[0.5em] font-sans font-bold">Trusted By</span>
              Our Corporate & Institutional Partners
            </h2>
            <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
              Join a distinguished network of organizations committed to fostering bilateral relationships, cultural exchange, and sustainable growth.
            </p>
          </div>

          {/* Partner & Corporate Logos Marquee */}
          <div className="relative w-full overflow-hidden flex bg-white/5 py-12 rounded-[32px] border border-white/10">
            {/* Gradient masks for smooth fade on edges */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-brand-ink to-transparent z-10" />
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-brand-ink to-transparent z-10" />
            
            <motion.div 
              className="flex items-center gap-16 md:gap-32 w-max px-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 20
              }}
            >
              {/* First set of logos */}
              {partners.map((partner, idx) => (
                <div key={`partner-1-${idx}`} className="flex items-center justify-center w-40 md:w-56 h-24 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, idx) => (
                <div key={`partner-2-${idx}`} className="flex items-center justify-center w-40 md:w-56 h-24 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
              {/* Triple set to ensure no empty space on large screens */}
              {partners.map((partner, idx) => (
                <div key={`partner-3-${idx}`} className="flex items-center justify-center w-40 md:w-56 h-24 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 md:py-48 px-6 bg-brand-paper relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-brand-ink mb-8"
          >
            Join the Austria–Mongolia <span className="italic text-brand-gold">Network</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-brand-ink/60 font-light mb-12 leading-relaxed"
          >
            Become part of a platform for cultural exchange, professional collaboration, and international connection.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="px-10 py-5 bg-brand-ink text-brand-paper rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-gold hover:text-brand-ink transition-all duration-500 shadow-xl flex items-center gap-4 mx-auto group"
          >
            Apply for Membership
            <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </section>

    </div>
  );
}
