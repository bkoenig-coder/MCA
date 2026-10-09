import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Landmark, Users, Handshake, Palette, Building2, Gift, CheckCircle2, ArrowRight } from 'lucide-react';
import CloudHeader from '../components/CloudHeader';
import { EyebrowMark, MeanderBand } from '../components/MongolianDesign';

const WHAT = [
  { key: 'culture', icon: Palette },
  { key: 'community', icon: Users },
  { key: 'exchange', icon: Handshake },
] as const;

const WAYS = [
  { key: 'funding', icon: Landmark },
  { key: 'sponsor', icon: Building2 },
  { key: 'inkind', icon: Gift },
  { key: 'partner', icon: Handshake },
] as const;

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } };

export default function Partners() {
  const { t } = useTranslation();
  const p = (k: string) => t(`partnersPage.${k}`);

  return (
    <div className="bg-white">
      <CloudHeader tag={p('tag')} title={p('title')} italic={p('titleItalic')} subtitle={p('intro')} />

      {/* What we do */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fade} className="flex items-center gap-3 mb-8">
            <EyebrowMark />
            <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{p('do.title')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHAT.map(({ key, icon: Icon }) => (
              <motion.div key={key} {...fade} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <Icon className="text-brand-blue mb-5" size={26} strokeWidth={1.6} />
                <h3 className="font-serif text-2xl text-brand-ink mb-2">{p(`do.${key}.title`)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p(`do.${key}.text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to partner */}
      <section className="py-14 md:py-20 bg-[#F4F8FD]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h2 {...fade} className="font-serif text-3xl md:text-4xl text-brand-ink mb-10">{p('ways.title')}</motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {WAYS.map(({ key, icon: Icon }) => (
              <motion.div key={key} {...fade} className="flex gap-5 rounded-2xl bg-white border border-slate-200 p-7">
                <span className="shrink-0 w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-serif text-xl text-brand-ink mb-1.5">{p(`ways.${key}.title`)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p(`ways.${key}.text`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What partners receive */}
      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.h2 {...fade} className="font-serif text-3xl md:text-4xl text-brand-ink mb-8">{p('offer.title')}</motion.h2>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <motion.li key={n} {...fade} className="flex gap-3 text-slate-700 leading-relaxed">
                <CheckCircle2 className="text-brand-gold shrink-0 mt-0.5" size={20} />
                <span>{p(`offer.${n}`)}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative bg-brand-ink text-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-4">{p('cta.title')}</h2>
          <p className="text-white/75 mb-8 leading-relaxed">{p('cta.text')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-gold text-slate-950 px-8 py-3.5 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:bg-amber-400 transition-colors">
              {p('cta.contact')} <ArrowRight size={14} />
            </Link>
            <Link to="/impact" className="inline-flex items-center justify-center border border-white/30 px-8 py-3.5 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors">
              {p('cta.donate')}
            </Link>
          </div>
          <p className="mt-10 text-xs text-white/50 leading-relaxed">{p('facts')}</p>
        </div>
        <MeanderBand className="absolute bottom-0 left-0 right-0 bg-brand-gold/40" />
      </section>
    </div>
  );
}
