import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Globe, Info } from 'lucide-react';

export default function Imprint() {
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
              Imprint <span className="italic text-brand-gold">(Impressum)</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-light leading-relaxed space-y-12">
              <p className="text-xl text-brand-ink font-normal italic">
                Information according to § 5 ECG, § 14 UGB, § 25 MedienG and § 63 GewO.
              </p>

              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Info className="text-brand-gold" size={24} />
                    Operator Information
                  </h2>
                  <div className="space-y-2">
                    <p className="font-bold text-brand-ink">Mongolian Center in Vienna i.G.</p>
                    <p>ZVR-Zahl: 1673049268 (in Gründung) from Magistrat der Stadt Wien (Vereinsregister)</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <MapPin className="text-brand-gold" size={24} />
                    Address
                  </h2>
                  <div className="space-y-2">
                    <p>Schöpfleuthergasse 25, Vienna, Austria, 1210</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Mail className="text-brand-gold" size={24} />
                    Contact
                  </h2>
                  <div className="space-y-2">
                    <p>Phone: +4367761160389</p>
                    <p>Email: info@mongoliancenter.org</p>
                    <p>Web: www.mongoliancenter.org</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Globe className="text-brand-gold" size={24} />
                    Supervisory Authority
                  </h2>
                  <div className="space-y-2">
                    <p>Magistrat der Stadt Wien</p>
                    <p>District Administration (Bezirkshauptmannschaft)</p>
                  </div>
                </section>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">Liability for Content</h2>
                <p>
                  The contents of our pages were created with great care. However, we cannot guarantee the accuracy, completeness and timeliness of the content. As a service provider, we are responsible for our own content on these pages according to the general laws.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">Liability for Links</h2>
                <p>
                  Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">Copyright</h2>
                <p>
                  The contents and works on these pages created by the site operators are subject to Austrian copyright law. The reproduction, processing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10 text-sm italic">
                <p>Disclosure according to the Austrian Media Act (Offenlegungspflicht gemäß § 25 MedienG).</p>
                <p>Media owner and publisher: Mongolian Center in Vienna.</p>
                <p>Purpose of the association: Promotion of Mongolian culture and heritage in Austria.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
