import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader } from 'lucide-react';
import CloudHeader from '../components/CloudHeader';

const LetsPlayGame = lazy(() => import('../components/game/LetsPlayGame'));

/** The Steppe Runner game on its own page. */
export default function Game() {
  const { t } = useTranslation();
  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen">
      <CloudHeader tag={t('heritagePage.game.badge')} title={t('heritagePage.game.title')} italic={t('heritagePage.game.titleNative')} subtitle={t('heritagePage.game.blurb')} />

      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-6xl mx-auto">
        <Suspense
          fallback={
            <div className="h-[620px] rounded-[32px] bg-brand-ink flex items-center justify-center">
              <Loader className="w-8 h-8 text-brand-gold animate-spin" />
            </div>
          }
        >
          <LetsPlayGame />
        </Suspense>

        <div className="mt-8 text-center">
          <Link to="/heritage" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-gold transition-colors">
            <ArrowLeft size={16} />
            {t('nav.heritage')}
          </Link>
        </div>
      </section>
    </div>
  );
}
