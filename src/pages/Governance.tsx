import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Users, ShieldCheck, FileText, Award, Scale } from 'lucide-react';

export default function Governance() {
  const { t } = useTranslation();

  return (
    <div className="pt-20">
      <section className="relative py-24 md:py-32 px-6 bg-brand-paper overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">
                Legal & Compliance
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-12 tracking-tight text-brand-ink">
              Governance <span className="italic text-brand-gold">& Ethics</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-light leading-relaxed space-y-12">
              <p className="text-xl text-brand-ink font-normal italic">
                The Mongolian Center in Vienna is committed to the highest standards of transparency, accountability, and ethical conduct in all its operations.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <ShieldCheck className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">Integrity</h3>
                  <p className="text-sm">We maintain absolute integrity in our financial and operational reporting.</p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <Users className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">Inclusivity</h3>
                  <p className="text-sm">Our governance structure ensures diverse representation and inclusive decision-making.</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">1. Organizational Structure</h2>
                <p>
                  As a registered organization (Verein) in Austria, our structure consists of the General Assembly, the Executive Board, and the Auditors. The General Assembly is the supreme body of the organization and meets annually.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">2. Board of Directors</h2>
                <p>
                  The Executive Board is responsible for the strategic direction and day-to-day management of the center. Board members are elected by the General Assembly for a term of two years.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">3. Ethical Standards</h2>
                <p>
                  We adhere to a strict Code of Conduct that prohibits conflicts of interest, bribery, and discrimination. All staff and volunteers are required to sign and uphold these standards.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">4. Financial Transparency</h2>
                <p>
                  Our financial records are audited annually by independent auditors. We publish an annual report detailing our activities and financial performance to ensure full transparency for our members and donors.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">5. Compliance with Austrian Law</h2>
                <p>
                  We operate in full compliance with the Austrian Association Act (Vereinsgesetz) and all other relevant legal and regulatory requirements.
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">Governance Inquiries</h2>
                <p className="font-medium">Mongolian Center in Vienna</p>
                <p>Email: info@mongoliancenter.org</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
