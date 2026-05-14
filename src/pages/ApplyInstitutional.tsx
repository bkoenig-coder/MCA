import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplyInstitutional() {
  return (
    <div className="min-h-screen bg-brand-paper pt-24 md:pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/membership" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 hover:text-brand-gold transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Membership
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-6">Institutional</span>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6">Apply for <span className="italic text-brand-gold">Partnership</span></h1>
          <p className="text-brand-ink/60 font-light leading-relaxed">
            Interested in an Institutional Partnership? Provide details about your organization, and our team will get in touch to discuss collaboration opportunities.
          </p>
        </motion.div>

        <form className="bg-white rounded-[32px] p-8 md:p-12 border border-brand-ink/5 shadow-sm space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Organization Name</label>
            <input type="text" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Primary Contact First Name</label>
              <input type="text" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Primary Contact Last Name</label>
              <input type="text" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Work Email Address</label>
              <input type="email" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Job Title</label>
              <input type="text" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">Organization Website</label>
            <input type="url" className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/60">How would you like to partner with us?</label>
            <textarea rows={4} className="w-full bg-brand-paper border border-brand-ink/10 rounded-xl px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" required></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-brand-gold text-brand-ink rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-ink hover:text-white transition-colors duration-300 shadow-xl mt-8">
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}
