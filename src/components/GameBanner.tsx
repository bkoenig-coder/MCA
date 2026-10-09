import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Gamepad2 } from 'lucide-react';

/** A picture banner that opens the Steppe Runner game page. */
export default function GameBanner() {
  const { t } = useTranslation();
  return (
    <section className="px-6 lg:px-8 py-14 max-w-7xl mx-auto">
      <Link
        to="/game"
        className="group relative block overflow-hidden rounded-3xl bg-brand-ink border border-brand-gold/30 shadow-[0_30px_70px_-30px_rgba(10,17,40,0.65)] hover:shadow-[0_40px_80px_-30px_rgba(212,175,55,0.45)] transition-shadow"
      >
        <img
          src="/og-game.jpg"
          alt={t('heritagePage.game.previewAlt')}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1500ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128]/95 via-[#0A1128]/65 to-transparent" />
        <div className="relative p-8 md:p-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 bg-amber-50/95 px-3 py-1 rounded-lg border border-amber-200 text-xs uppercase tracking-widest font-mono text-amber-900 font-bold">
            <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t('heritagePage.game.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">
            {t('heritagePage.game.title')} <span className="italic text-brand-gold">{t('heritagePage.game.titleNative')}</span>
          </h2>
          <p className="text-white/80 leading-relaxed mb-7 max-w-xl">{t('heritagePage.game.blurb')}</p>
          <span className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D4AF37] text-[#0A1128] rounded-lg text-xs uppercase tracking-widest font-bold group-hover:bg-white transition-colors">
            {t('heritagePage.game.play')} <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </section>
  );
}
