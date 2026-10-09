import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { EyebrowMark, MeanderBand } from './MongolianDesign';

const SCRIPT = 'ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ'; // "Mongol bichig" (Mongolian script)

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };

/** Gold corner brackets that frame a tile. */
const Corners = () => (
  <>
    {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((c) => (
      <i key={c} aria-hidden="true" className={`absolute w-6 h-6 border-brand-gold/70 pointer-events-none ${c}`} />
    ))}
  </>
);

function PhotoTile({ src, pos, title, text, className }: { src: string; pos: string; title: string; text: string; className: string }) {
  return (
    <motion.figure {...reveal} className={`group relative overflow-hidden rounded-2xl bg-brand-ink shadow-[0_24px_60px_-28px_rgba(10,17,40,0.6)] ${className}`}>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        style={{ objectPosition: pos }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-[#0A1128]/25 to-transparent" />
      <Corners />
      <figcaption className="absolute left-0 right-0 bottom-0 p-6 md:p-8">
        <span className="block w-10 h-px bg-brand-gold mb-4 transition-all duration-500 group-hover:w-20" />
        <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{title}</h3>
        <p className="text-sm text-white/80 leading-relaxed max-w-md">{text}</p>
      </figcaption>
    </motion.figure>
  );
}

/** "Our culture": a small mosaic of cultural items, in photos and gold lettering. */
export default function CultureShowcase() {
  const { t } = useTranslation();
  const s = (k: string) => t(`heritagePage.showcase.${k}`);

  return (
    <section className="py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
      <motion.div {...reveal} className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
        <div className="inline-flex items-center gap-3 mb-4 text-brand-gold">
          <EyebrowMark />
          <span className="text-xs uppercase tracking-[0.18em] font-semibold">{s('badge')}</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-brand-ink leading-[1.1] mb-4">
          {s('title1')} <span className="italic text-[#C5A059]">{s('title2')}</span>
        </h2>
        <p className="text-slate-600 leading-relaxed">{s('intro')}</p>
      </motion.div>

      <div className="grid md:grid-cols-5 md:grid-rows-2 gap-5 md:gap-6 md:h-[720px]">
        <PhotoTile src="/media/heritage-deel.jpg" pos="38% 50%" title={s('deel.title')} text={s('deel.text')} className="md:col-span-3 md:row-span-2 min-h-[420px]" />

        {/* The script, in gold on deep blue */}
        <motion.div {...reveal} className="group relative overflow-hidden rounded-2xl md:col-span-2 min-h-[320px] bg-[linear-gradient(160deg,#12234a_0%,#0A1128_70%)] shadow-[0_24px_60px_-28px_rgba(10,17,40,0.6)]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.18),transparent_65%)]" />
          <MeanderBand className="absolute top-0 left-0 right-0 bg-brand-gold/35" />
          <Corners />
          <div className="relative h-full flex items-center gap-6 md:gap-8 p-7 md:p-9 pt-10">
            <h3
              lang="mn-Mong"
              aria-label={s('script.title')}
              className="shrink-0 select-none leading-none"
              style={{
                writingMode: 'vertical-lr',
                fontFamily: '"Noto Sans Mongolian", "Mongolian Baiti", serif',
                fontSize: 'clamp(60px, 7vw, 92px)',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(180deg, #9a7410 0%, #f0d98a 30%, #fff3c4 45%, #d4af37 65%, #9a7410 100%)',
                filter: 'drop-shadow(0 2px 14px rgba(212,175,55,0.35))',
              }}
            >
              {SCRIPT}
            </h3>
            <div>
              <span className="block w-10 h-px bg-brand-gold mb-4 transition-all duration-500 group-hover:w-20" />
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">{s('script.title')}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{s('script.text')}</p>
            </div>
          </div>
        </motion.div>

        <PhotoTile src="/media/heritage-stage.jpg" pos="50% 40%" title={s('stage.title')} text={s('stage.text')} className="md:col-span-2 min-h-[320px]" />
      </div>
    </section>
  );
}
