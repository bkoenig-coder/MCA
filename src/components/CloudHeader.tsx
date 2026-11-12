import { ReactNode } from 'react';
import { motion } from 'motion/react';

/**
 * Page header: the page's label, title and a short introduction on a calm surface.
 * (`italic` is the second part of the title; it is set in the accent colour, not in italics.)
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
    <section className="bg-brand-sand border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20 min-h-[280px] md:min-h-[320px] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full ${center ? 'text-center' : 'max-w-3xl'}`}
        >
          <p className="text-sm text-brand-ink-mute mb-4">{tag}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-ink leading-[1.08] tracking-[-0.02em] text-balance">
            {title}
            {italic && <> <span className="text-brand-blue">{italic}</span></>}
          </h1>
          {subtitle && (
            <p className={`mt-5 text-lg text-brand-ink-soft leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>{subtitle}</p>
          )}
          {children && <div className={`mt-8 ${center ? 'flex justify-center' : ''}`}>{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
