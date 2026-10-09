import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { EyebrowMark, MeanderBand, MongolianKhasDivider, UlziiSymbol } from './MongolianDesign';

const SCRIPT = 'ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ'; // "Mongol bichig" (Mongolian script)

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Fine gold frame set inside a tile, with small diamonds at the corners. */
const Frame = () => (
  <>
    <div aria-hidden="true" className="absolute inset-3 rounded-xl border border-brand-gold/45 pointer-events-none transition-all duration-500 group-hover:inset-2 group-hover:border-brand-gold/80" />
    {['top-2.5 left-2.5', 'top-2.5 right-2.5', 'bottom-2.5 left-2.5', 'bottom-2.5 right-2.5'].map((c) => (
      <i key={c} aria-hidden="true" className={`absolute w-2 h-2 rotate-45 bg-brand-gold pointer-events-none ${c}`} />
    ))}
  </>
);

/** Large gold numeral in the corner of a tile. */
const Numeral = ({ n }: { n: string }) => (
  <span className="absolute top-7 left-8 font-serif italic text-brand-gold/90 text-2xl md:text-3xl select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{n}</span>
);

function Caption({ title, text }: { title: string; text: string }) {
  return (
    <figcaption className="absolute left-5 right-5 bottom-5 md:left-7 md:right-7 md:bottom-7 rounded-xl border border-white/15 bg-[#0A1128]/55 backdrop-blur-md p-5 md:p-6">
      <span className="block w-10 h-px bg-brand-gold mb-3 transition-all duration-500 group-hover:w-24" />
      <h3 className="font-serif text-2xl md:text-3xl text-white mb-1.5">{title}</h3>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    </figcaption>
  );
}

function PhotoTile({ src, pos, title, text, n, className, delay }: { src: string; pos: string; title: string; text: string; n: string; className: string; delay: number }) {
  return (
    <motion.figure {...reveal(delay)} className={`group relative overflow-hidden rounded-3xl bg-brand-ink shadow-[0_30px_70px_-30px_rgba(10,17,40,0.65)] hover:shadow-[0_40px_80px_-30px_rgba(212,175,55,0.45)] transition-shadow duration-500 ${className}`}>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
        style={{ objectPosition: pos }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/85 via-[#0A1128]/10 to-[#0A1128]/30" />
      <Frame />
      <Numeral n={n} />
      <Caption title={title} text={text} />
    </motion.figure>
  );
}

/** "Our culture": a small mosaic of cultural items, in photos and gold lettering. */
export default function CultureShowcase() {
  const { t } = useTranslation();
  const s = (k: string) => t(`heritagePage.showcase.${k}`);

  return (
    <section className="relative py-16 md:py-24 border-t border-slate-200 bg-gradient-to-b from-[#FBF6EA] via-white to-white overflow-hidden">
      {/* soft gold glow */}
      <div aria-hidden="true" className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[320px] rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...reveal()} className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-4 text-brand-gold">
            <EyebrowMark />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold">{s('badge')}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.08] mb-5">
            {s('title1')} <span className="italic text-[#C5A059]">{s('title2')}</span>
          </h2>
          <MongolianKhasDivider className="my-5" />
          <p className="text-slate-600 leading-relaxed">{s('intro')}</p>
        </motion.div>

        <div className="grid md:grid-cols-5 md:grid-rows-2 gap-5 md:gap-6 md:h-[760px]">
          <PhotoTile src="/media/heritage-deel.jpg" pos="38% 50%" title={s('deel.title')} text={s('deel.text')} n="01" delay={0} className="md:col-span-3 md:row-span-2 min-h-[460px]" />

          {/* The script, in gold on deep blue */}
          <motion.div {...reveal(0.12)} className="group relative overflow-hidden rounded-3xl md:col-span-2 min-h-[340px] bg-[linear-gradient(155deg,#16295a_0%,#0A1128_65%)] shadow-[0_30px_70px_-30px_rgba(10,17,40,0.65)] hover:shadow-[0_40px_80px_-30px_rgba(212,175,55,0.45)] transition-shadow duration-500">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_55%,rgba(212,175,55,0.22),transparent_62%)]" />
            <UlziiSymbol className="absolute -right-10 -bottom-10 w-56 h-56 text-brand-gold/[0.07] rotate-12" />
            <MeanderBand className="absolute top-0 left-0 right-0 bg-brand-gold/30" />
            <Frame />
            <Numeral n="02" />
            <div className="relative h-full flex items-center gap-6 md:gap-8 px-9 md:px-10 pt-16 pb-8">
              <h3
                lang="mn-Mong"
                aria-label={s('script.title')}
                className="shrink-0 select-none leading-none"
                style={{
                  writingMode: 'vertical-lr',
                  fontFamily: '"Noto Sans Mongolian", "Mongolian Baiti", serif',
                  fontSize: 'clamp(64px, 7vw, 96px)',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(180deg, #9a7410 0%, #f0d98a 30%, #fff3c4 45%, #d4af37 65%, #9a7410 100%)',
                  filter: 'drop-shadow(0 2px 16px rgba(212,175,55,0.4))',
                }}
              >
                {SCRIPT}
              </h3>
              <div>
                <span className="block w-10 h-px bg-brand-gold mb-4 transition-all duration-500 group-hover:w-24" />
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{s('script.title')}</h3>
                <p className="text-sm text-white/75 leading-relaxed">{s('script.text')}</p>
              </div>
            </div>
          </motion.div>

          <PhotoTile src="/media/heritage-stage.jpg" pos="50% 40%" title={s('stage.title')} text={s('stage.text')} n="03" delay={0.24} className="md:col-span-2 min-h-[340px]" />
        </div>
      </div>
    </section>
  );
}
