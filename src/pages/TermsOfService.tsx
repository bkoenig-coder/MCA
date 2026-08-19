import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="pt-[140px] md:pt-[152px]">
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
              Terms of <span className="italic text-brand-gold">Service</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-light leading-relaxed space-y-8">
              <p className="text-xl text-brand-ink font-normal italic">
                Last updated: April 2026. These terms apply to all visitors and users of the Mongolian Center in Vienna platform.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <Scale className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">Legal Framework</h3>
                  <p className="text-sm">Our services are governed by the laws of the Republic of Austria.</p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <CheckCircle className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">User Responsibility</h3>
                  <p className="text-sm">By using our platform, you agree to act in accordance with our community standards.</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">1. Scope</h2>
                <p>
                  These General Terms and Conditions (GTC) apply to all legal transactions concluded via the online platform of the Mongolian Center in Vienna.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">2. Services</h2>
                <p>
                  The Mongolian Center in Vienna provides information, event registration, and cultural resources. We reserve the right to modify or discontinue services at any time.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">3. Registration and Account</h2>
                <p>
                  Registration may be required for certain services. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">4. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, and images, is the property of the Mongolian Center in Vienna or its content suppliers and is protected by copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">5. Limitation of Liability</h2>
                <p>
                  The Mongolian Center in Vienna shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">6. Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of Austria. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Vienna.
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">Questions about our Terms?</h2>
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
