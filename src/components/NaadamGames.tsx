import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { EyebrowMark } from './MongolianDesign';

type IconProps = { className?: string };

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Two wrestlers leaning in, gripping each other. */
const WrestlingIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} {...strokeProps} aria-hidden="true">
    <circle cx="22" cy="13" r="4.5" />
    <circle cx="42" cy="13" r="4.5" />
    <path d="M24 19L19 38M40 19L45 38" />
    <path d="M19 38L12 56M19 38L26 55" />
    <path d="M45 38L52 56M45 38L38 55" />
    <path d="M24 25L38 31M40 25L26 31" />
  </svg>
);

/** Target with an arrow. */
const ArcheryIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} {...strokeProps} aria-hidden="true">
    <circle cx="28" cy="36" r="20" />
    <circle cx="28" cy="36" r="12.5" />
    <circle cx="28" cy="36" r="5" />
    <path d="M28 36L55 9" />
    <path d="M55 9V19M55 9H45" />
    <path d="M50 14V22M50 14H42" opacity="0.6" />
  </svg>
);

/** Horseshoe with speed lines. */
const HorseRacingIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} {...strokeProps} aria-hidden="true">
    <path d="M20 56V34C20 20 25 12 36 12C47 12 52 20 52 34V56H43V34C43 28 40.5 22 36 22C31.5 22 29 28 29 34V56Z" />
    <circle cx="24.5" cy="44" r="0.9" fill="currentColor" />
    <circle cx="47.5" cy="44" r="0.9" fill="currentColor" />
    <circle cx="24.5" cy="30" r="0.9" fill="currentColor" />
    <circle cx="47.5" cy="30" r="0.9" fill="currentColor" />
    <path d="M4 26H13M2 36H12M6 46H14" opacity="0.7" />
  </svg>
);

/** "Eriin gurvan naadam": the three games at the heart of Mongolia's national festival. */
export default function NaadamGames() {
  const { t } = useTranslation();

  const games = [
    {
      key: 'wrestling',
      Icon: WrestlingIcon,
      mn: 'Бөх',
      title: t('naadam.wrestling.title', { defaultValue: 'Wrestling' }),
      text: t('naadam.wrestling.text', {
        defaultValue: 'No weight classes and no time limit: a bout ends when any part of the body other than the feet and hands touches the ground.',
      }),
    },
    {
      key: 'archery',
      Icon: ArcheryIcon,
      mn: 'Сур харваа',
      title: t('naadam.archery.title', { defaultValue: 'Archery' }),
      text: t('naadam.archery.text', {
        defaultValue: 'Traditional archery with a recurve bow, in which both men and women compete.',
      }),
    },
    {
      key: 'horse',
      Icon: HorseRacingIcon,
      mn: 'Морин уралдаан',
      title: t('naadam.horse.title', { defaultValue: 'Horse racing' }),
      text: t('naadam.horse.text', {
        defaultValue: 'Long-distance races across the open steppe, ridden by young jockeys.',
      }),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div className="max-w-2xl mb-12">
        <div className="flex items-center gap-4 mb-3">
          <EyebrowMark />
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">
            {t('naadam.tag', { defaultValue: 'Naadam' })}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-ink mb-5">
          {t('naadam.titleNormal', { defaultValue: 'The Three Games of ' })}
          <span className="italic text-brand-gold">{t('naadam.titleItalic', { defaultValue: 'Naadam' })}</span>
        </h2>
        <p className="text-base md:text-lg text-brand-ink/80 leading-relaxed">
          {t('naadam.desc', {
            defaultValue: 'Eriin gurvan naadam, the festival at the heart of Mongolian culture, brings together wrestling, archery and horse racing each summer.',
          })}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {games.map(({ key, Icon, mn, title, text }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white border border-slate-200 rounded-xl p-8 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300"
          >
            <Icon className="w-14 h-14 text-brand-blue mb-6 transition-transform duration-500 group-hover:-translate-y-0.5" />
            <h3 className="text-2xl font-serif text-brand-ink mb-1">{title}</h3>
            <p className="text-xs uppercase tracking-[0.14em] font-semibold text-brand-gold mb-4">{mn}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
