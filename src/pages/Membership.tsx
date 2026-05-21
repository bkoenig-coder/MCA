import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Users, Calendar, Award, CheckCircle2, ChevronRight, Building2, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import amoxLogo from '../assets/media/amoxlogo.png';
import deutschotekLogo from '../assets/media/deutschoteklogo.jpg';
import euactiveLogo from '../assets/media/euactivelogo.png';
import mcaLogo from '../assets/media/mcalogo-1.png';

const partners = [
  { name: "Embassy of Mongolia in Vienna", logo: "/embassy logo.png" },
  { name: "AMOX", logo: amoxLogo },
  { name: "Deutschothek", logo: deutschotekLogo },
  { name: "EU Active", logo: euactiveLogo },
  { name: "Gmax Mongolischer Kinder-und Jugendverein", logo: "/gmax logo.jpg" },
  { name: "MCA", logo: mcaLogo },
];

export default function Membership() {
  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-40 overflow-hidden bg-[#020202]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/10 blur-[120px] rounded-[100%] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-brand-gold/5 blur-[100px] rounded-[100%] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
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
            <a href="#tiers" className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 group">
              Individual Membership
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/membership/apply-institutional" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-500 flex items-center justify-center gap-3">
              Institutional Partnership
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 px-6 bg-brand-paper relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="w-full md:w-1/3 md:sticky md:top-32">
              <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6 relative">
                <span className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-px bg-brand-gold hidden md:block" />
                Value Proposition
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6">
                Become a member and <span className="italic text-brand-gold">benefit</span> from our offerings
              </h2>
              <p className="text-xl text-brand-ink/60 font-light mb-8">
                Unlock exclusive opportunities and become part of a premier bilateral network connecting Austria and Mongolia.
              </p>
              <button 
                onClick={() => {
                  document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden md:inline-flex items-center gap-3 px-8 py-4 bg-brand-ink text-brand-paper rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-gold transition-colors duration-300 group"
              >
                View Plans <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Users size={24} />,
                  title: "Networking opportunities & events",
                  desc: "Connect with professionals, diplomats, and business leaders through our exclusive forums, cultural evenings, and networking receptions."
                },
                {
                  icon: <Globe size={24} />,
                  title: "Access to inclusive information",
                  desc: "Stay informed with detailed insights into bilateral relations, cultural developments, and economic opportunities."
                },
                {
                  icon: <Building2 size={24} />,
                  title: "Access to embassy & decision makers",
                  desc: "Direct channels to the Mongolian Embassy in Vienna and high-level political decision makers in both nations."
                },
                {
                  icon: <Award size={24} />,
                  title: "Advocacy & Lobbying",
                  desc: "A collective voice representing the interests of the Mongolian-Austrian community in business and cultural spheres."
                },
                {
                  icon: <Sparkles size={24} />,
                  title: "And many more...",
                  desc: "From mentorship programs to priority access for collaborative initiatives and community projects."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                  className="group bg-white p-8 rounded-[32px] border border-brand-ink/5 hover:border-brand-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-ink/5 text-brand-gold flex items-center justify-center mb-6 transition-colors duration-500 group-hover:bg-brand-gold group-hover:text-brand-ink">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif text-brand-ink mb-3">{feature.title}</h3>
                  <p className="text-brand-ink/60 font-light leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-6">
              How to <span className="italic text-brand-gold">Apply</span>
            </h2>
            <p className="text-lg text-brand-ink/60 font-light max-w-2xl mx-auto">
              Joining the Mongolian Center is a straightforward process designed to ensure our community remains vibrant and engaged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[28px] left-1/6 right-1/6 h-[1px] bg-brand-ink/10" />
            
            {[
              {
                step: "01",
                title: "Submit Application",
                desc: "Complete our online membership application form with your details and professional background."
              },
              {
                step: "02",
                title: "Board Review",
                desc: "Our board reviews applications monthly to ensure alignment with our values and goals."
              },
              {
                step: "03",
                title: "Welcome aboard!",
                desc: "Upon approval, you'll receive your membership welcome package and access to the network."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative text-center px-4"
              >
                <div className="w-14 h-14 mx-auto bg-brand-gold text-brand-ink rounded-full flex items-center justify-center font-serif text-xl relative z-10 mb-6 shadow-lg shadow-brand-gold/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-serif text-brand-ink mb-3">{item.title}</h3>
                <p className="text-brand-ink/60 font-light text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 md:py-32 px-6 bg-brand-ink relative overflow-hidden rounded-[40px] md:rounded-[80px] mx-4 md:mx-6 mb-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-gold/20 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                Membership <span className="italic text-brand-gold">Tiers</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                Choose the level of engagement that best aligns with your goals and organizational structure.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">
              <span>Annual</span>
              <div className="w-12 h-6 bg-brand-gold/20 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-brand-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Student */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/[0.02] rounded-[40px] border border-white/10 hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all duration-500 relative flex flex-col h-full group backdrop-blur-sm overflow-hidden"
            >
              {/* Card Image Header */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-t-[40px]">
                <div className="absolute inset-0 bg-brand-ink/40 group-hover:bg-brand-ink/10 transition-colors duration-500 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" 
                  alt="Student Membership" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#11131c] to-transparent z-10" />
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/40 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 z-20 group-hover:bg-brand-gold group-hover:text-brand-ink group-hover:border-transparent transition-all duration-500">
                  <GraduationCap size={20} />
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-grow bg-[#11131c]">
                <h3 className="text-2xl font-serif text-white mb-3 relative z-10">Student & Youth</h3>
                <p className="text-white/50 font-light text-sm mb-8 h-12 relative z-10">Affordable annual membership for students and young professionals.</p>
                <div className="mb-10 relative z-10">
                  <span className="text-5xl font-serif text-brand-gold">€25</span>
                  <span className="text-white/40 font-light ml-1">/ year</span>
                </div>
                
                <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mb-8" />
                
                <div className="space-y-4 mb-auto relative z-10 pb-10">
                  {['Access to community events', 'Student networking sessions', 'Newsletter updates', 'Voting rights at general assembly'].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle2 size={18} className="text-brand-gold/70 shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="w-full flex items-center justify-center py-5 rounded-full border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-brand-ink transition-colors duration-300 relative z-10 mt-auto">
                  Contact Foundation
                </Link>
              </div>
            </motion.div>

            {/* Tier 2: Professional (Highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-brand-gold/5 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col h-full transform lg:-translate-y-4 border border-brand-gold/30 hover:border-brand-gold/60 transition-all duration-500 group backdrop-blur-xl"
            >
              {/* Premium Background Effects */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-gold/20 rounded-full blur-[80px] group-hover:bg-brand-gold/30 transition-colors duration-700 pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute inset-0 border-[4px] border-double border-brand-gold/10 pointer-events-none rounded-[40px] m-1 z-30"></div>
              
              <div className="absolute top-6 right-6 z-30 shadow-lg">
                <span className="bg-gradient-to-r from-brand-gold to-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.4)] text-brand-ink px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold">Recommended</span>
              </div>

              {/* Card Image Header */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-t-[40px] z-10">
                <div className="absolute inset-0 bg-brand-ink/30 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply" />
                <img 
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Professional Membership" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0" 
                />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#151722] to-transparent z-10" />
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-md flex items-center justify-center text-brand-gold z-20 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-brand-ink transition-all duration-500 shadow-lg shadow-brand-gold/20">
                  <Briefcase size={22} />
                </div>
              </div>
              
              <div className="p-8 md:p-10 flex flex-col flex-grow bg-gradient-to-b from-[#151722] to-[#11131c] relative z-20">
                <h3 className="text-3xl font-serif text-white mb-3">Professional</h3>
                <p className="text-white/60 font-light text-sm mb-8 h-12">For professionals, entrepreneurs, academics, and creatives.</p>
                <div className="mb-10">
                  <span className="text-6xl font-serif text-white">€80</span>
                  <span className="text-white/40 font-light ml-2">/ year</span>
                </div>
                
                <div className="h-[1px] w-full bg-gradient-to-r from-brand-gold/30 to-transparent mb-8 opacity-50" />
                
                <div className="space-y-4 mb-auto pb-10">
                  {['Full access to professional network', 'Discounted event tickets', 'Exclusive networking dinners', 'Priority registration for forums', 'Directory listing', 'Voting rights at general assembly'].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle2 size={18} className="text-brand-gold shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      <span className="text-white/90 font-light text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="w-full flex items-center justify-center py-5 rounded-full bg-gradient-to-r from-brand-gold to-amber-500 text-brand-ink text-[10px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-500 shadow-[0_10px_20px_rgba(212,175,55,0.2)] mt-auto hover:scale-[1.02]">
                  Contact Foundation
                </Link>
              </div>
            </motion.div>

            {/* Tier 3: Institutional */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/[0.02] rounded-[40px] border border-white/10 hover:bg-white/[0.04] hover:border-brand-gold/30 transition-all duration-500 relative flex flex-col h-full group backdrop-blur-sm overflow-hidden"
            >
              {/* Card Image Header */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-t-[40px]">
                <div className="absolute inset-0 bg-brand-ink/40 group-hover:bg-brand-ink/10 transition-colors duration-500 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1571645163064-77faa9676a46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Institutional Membership" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#11131c] to-transparent z-10" />
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/40 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 z-20 group-hover:bg-brand-gold group-hover:text-brand-ink group-hover:border-transparent transition-all duration-500">
                  <Building2 size={20} />
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-grow bg-[#11131c]">
                <h3 className="text-2xl font-serif text-white mb-3 relative z-10">Institutional</h3>
                <p className="text-white/50 font-light text-sm mb-8 h-12 relative z-10">For companies, universities, embassies, NGOs, and organizations.</p>
                <div className="mb-10 relative z-10">
                  <span className="text-5xl font-serif text-brand-gold">Custom</span>
                </div>
                
                <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mb-8" />
                
                <div className="space-y-4 mb-auto relative z-10 pb-10">
                  {['Up to 5 delegate memberships', 'Logo placement as partner', 'Co-hosting opportunities', 'B2B/B2G matchmaking support', 'Premium directory profile'].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle2 size={18} className="text-brand-gold/70 shrink-0 mt-0.5" />
                      <span className="text-white/70 font-light text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="w-full flex items-center justify-center py-5 rounded-full border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-brand-ink transition-colors duration-300 relative z-10 mt-auto">
                  Contact Foundation
                </Link>
              </div>
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

      {/* Directory Access */}
      <section className="py-24 bg-brand-ink text-white px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ink via-brand-ink to-[#1a1f33] z-0" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white drop-shadow-lg">
            Explore Our <span className="italic text-brand-gold">Community</span>
          </h2>
          <p className="text-lg text-white/70 font-light mb-10 leading-relaxed max-w-2xl mx-auto">
            Our members range from students to diplomats, artists to corporate leaders. Browse our directory to see who is already making an impact in the Austria-Mongolia network.
          </p>
          <Link 
            to="/members"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-brand-gold text-brand-gold rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-gold hover:text-brand-ink transition-all duration-300"
          >
            View Members Directory
            <ArrowRight size={14} />
          </Link>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <a 
              href="#tiers"
              className="px-10 py-5 bg-brand-ink text-brand-paper rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-gold hover:text-brand-ink transition-all duration-500 shadow-xl flex items-center gap-4 group"
            >
              Apply for Membership
              <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
