import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
              Privacy <span className="italic text-brand-gold">Policy</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-light leading-relaxed space-y-8">
              <p className="text-xl text-brand-ink font-normal italic">
                Last updated: April 2026. This policy is designed to comply with the Austrian Data Protection Act (DSGVO).
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <Shield className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">Data Security</h3>
                  <p className="text-sm">We implement state-of-the-art encryption and security measures to protect your personal information.</p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <Eye className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">Transparency</h3>
                  <p className="text-sm">We are committed to being clear about what data we collect and how it is used.</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">1. General Information</h2>
                <p>
                  The protection of your personal data is of particular concern to us. We therefore process your data exclusively on the basis of the legal provisions (GDPR, TKG 2003). In this data protection information, we inform you about the most important aspects of data processing within the framework of our website.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">2. Contact with us</h2>
                <p>
                  If you contact us via the form on the website or by e-mail, the data you provide will be stored by us for six months for the purpose of processing the inquiry and in case of follow-up questions. We do not pass on this data without your consent.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">3. Data Storage</h2>
                <p>
                  For contract processing, we also process the following personal data: name, postal address, email address, and, where necessary, telephone number and billing details.
                </p>
                <p>
                  Payment processing is carried out via our payment service provider (e.g. Stripe/PayPal). In this context, payment data (such as credit card details) are processed directly by the payment service provider; we do not store full credit card numbers ourselves.
                </p>
                <p>
                  In addition, for the purpose of contract processing, the following data is also stored by us: Name, Address, Email. The data provided by you is necessary for the fulfillment of the contract or for the implementation of pre-contractual measures. Without this data we cannot conclude the contract with you.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">4. Cookies</h2>
                <p>
                  Our website uses so-called cookies. These are small text files that are stored on your end device with the help of the browser. They do not cause any damage. We use cookies to make our offer user-friendly. Some cookies remain stored on your end device until you delete them. They enable us to recognize your browser on your next visit.
                </p>
                <p>
                  If you do not wish this, you can set up your browser so that it informs you about the setting of cookies and you only allow this in individual cases. If cookies are deactivated, the functionality of our website may be limited.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">5. Web Analysis</h2>
                <p>
                  Our website uses functions of the web analysis service Google Analytics. For this purpose, cookies are used which enable an analysis of the use of the website by your users. The information generated in this way is transferred to the provider's server and stored there.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">6. Your Rights</h2>
                <p>
Here are the updated versions incorporating the email address for data removal:

Option 1: Clear and User-Friendly

You have the right to access, correct, delete, or restrict the processing of your personal data. You also have the right to data portability, and you can revoke your consent or object to data processing at any time. To request the removal of your data, please contact us at info@mongoliancenter.org.                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">Contact for Data Protection</h2>
                <p className="font-medium">Mongolian Center in Vienna</p>
                <p>Email: info@mongoliancenter.org</p>
                <p>Address: Vienna, Austria</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
