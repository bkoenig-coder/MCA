import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { CloudDrift } from './CuteClouds';
import { EyebrowMark, MeanderBand } from './MongolianDesign';

/**
 * Page header on a soft sky: the title sits on the left (or centre), cute animated clouds
 * drift behind and beside it. Replaces the photo headers.
 */
export default function CloudHeader({
  tag,
  title,
  italic,
  subtitle,
  align = 'left',
  children,
}: {
  tag: string;
  title: string;
  italic?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}) {
  const center = align === 'center';
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#D8E9FA] via-[#EAF3FC] to-white">
      {/* Clouds */}
      <CloudDrift variant="b" tone="deep" className="-right-8 top-4 w-48 md:w-[26rem] opacity-[0.55] md:opacity-95" duration={34} />
      <CloudDrift variant="a" tone="blue" className={`bottom-2 hidden md:block w-56 opacity-90 ${center ? "left-[5%]" : "right-[18%]"}`} delay={3} duration={28} />
      <CloudDrift variant="c" tone="gold" className="right-[6%] bottom-4 w-24 md:w-40" delay={1} duration={24} />
      {!center && <CloudDrift variant="c" tone="blue" className="-left-6 bottom-0 hidden lg:block w-48 opacity-50" delay={6} duration={30} />}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 min-h-[300px] md:min-h-[360px] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full ${center ? 'text-center' : 'max-w-3xl'}`}
        >
          <div className={`flex items-center gap-4 mb-5 ${center ? 'justify-center' : ''}`}>
            <EyebrowMark />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{tag}</span>
            {center && <EyebrowMark />}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-ink leading-[1.1] tracking-tight">
            {title}
            {italic && <> <span className="italic text-brand-blue">{italic}</span></>}
          </h1>
          {subtitle && (
            <p className={`mt-5 text-base md:text-lg text-brand-ink/75 leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>{subtitle}</p>
          )}
          {children && <div className={`mt-8 ${center ? 'flex justify-center' : ''}`}>{children}</div>}
        </motion.div>
      </div>
      <MeanderBand className="absolute bottom-0 inset-x-0 bg-brand-gold/40" />
    </section>
  );
}
