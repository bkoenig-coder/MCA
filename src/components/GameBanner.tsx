import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

/** A banner that opens the Steppe Runner game page. */
export default function GameBanner() {
  const { t } = useTranslation();
  return (
    <section className="px-6 lg:px-8 py-14 max-w-7xl mx-auto">
      <Link
        to="/game"
        className="group grid md:grid-cols-5 overflow-hidden rounded-2xl bg-brand-indigo"
      >
        {/*
          The picture has a different title painted into its sky. It is framed from the horizon
          down (the frame is taller than the cell and anchored to its lower edge), so only the scene shows.
        */}
        <div className="relative md:col-span-3 md:order-2 aspect-[5/2] md:aspect-auto md:min-h-[320px] overflow-hidden">
          <img
            src="/media/steppe-runner.jpg"
            alt={t('heritagePage.game.previewAlt')}
            width={2000}
            height={1116}
            loading="lazy"
            className="absolute bottom-0 left-0 w-full h-[142%] object-cover object-bottom"
          />
        </div>

        <div className="md:col-span-2 md:order-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          <p className="text-sm text-brand-felt-soft mb-3">{t('heritagePage.game.badge')}</p>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-felt leading-[1.15] mb-4">
            {t('heritagePage.game.title')}
            <span className="block mt-1 font-sans text-base text-brand-felt-soft tracking-normal">{t('heritagePage.game.titleNative')}</span>
          </h2>
          <p className="text-brand-felt-soft leading-relaxed mb-8">{t('heritagePage.game.blurb')}</p>
          <span className="inline-flex self-start items-center gap-2 h-11 px-5 rounded-lg bg-brand-felt text-brand-ink text-[15px] font-medium transition-colors duration-150 group-hover:bg-white">
            {t('heritagePage.game.play')}
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </section>
  );
}
