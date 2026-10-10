import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Gamepad2 } from 'lucide-react';

/** A banner that opens the Steppe Runner game page. The whole picture is shown, never cropped. */
export default function GameBanner() {
  const { t } = useTranslation();
  return (
    <section className="px-6 lg:px-8 py-14 max-w-7xl mx-auto">
      <Link
        to="/game"
        className="group grid md:grid-cols-5 overflow-hidden rounded-3xl bg-brand-ink border border-brand-gold/30 shadow-[0_30px_70px_-30px_rgba(10,17,40,0.65)] hover:shadow-[0_40px_80px_-30px_rgba(212,175,55,0.45)] transition-shadow"
      >
        {/* the full picture (2000 x 1116): no cropping at any screen size */}
        <div className="md:col-span-3 md:order-2 bg-black">
          <img
            src="/media/steppe-runner.jpg"
            alt={t('heritagePage.game.previewAlt')}
            width={2000}
            height={1116}
            loading="lazy"
            className="block w-full h-auto"
          />
        </div>

        <div className="md:col-span-2 md:order-1 p-8 md:p-10 flex flex-col justify-center bg-[radial-gradient(ellipse_at_20%_20%,#16295a_0%,#0A1128_70%)]">
          <div className="inline-flex self-start items-center gap-2 mb-4 bg-amber-50/95 px-3 py-1 rounded-lg border border-amber-200 text-xs uppercase tracking-widest font-mono text-amber-900 font-bold">
            <Gamepad2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t('heritagePage.game.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">
            {t('heritagePage.game.title')} <span className="italic text-brand-gold">{t('heritagePage.game.titleNative')}</span>
          </h2>
          <p className="text-white/80 leading-relaxed mb-7">{t('heritagePage.game.blurb')}</p>
          <span className="inline-flex self-start items-center gap-2 px-7 py-3.5 bg-[#D4AF37] text-[#0A1128] rounded-lg text-xs uppercase tracking-widest font-bold group-hover:bg-white transition-colors">
            {t('heritagePage.game.play')} <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </section>
  );
}
