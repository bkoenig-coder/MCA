import { motion } from 'motion/react';
import CloudHeader from '../components/CloudHeader';
import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, ArcherSymbol, MongolianFormalFrame, MongolianKhasDivider } from '../components/MongolianDesign';
import NewsletterForm from '../components/NewsletterForm';


function formatNewsDate(val: any, locale: string = 'en', options?: Intl.DateTimeFormatOptions): string {
  if (!val) return 'Recent';
  try {
    let d: Date;
    if (typeof val?.toDate === 'function') {
      d = val.toDate();
    } else if (val instanceof Date) {
      d = val;
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString(locale, options || { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

const NOISE = "url(\"data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E\")";

/** Plain-text excerpt: strips markdown marks from article content. */
const plain = (text?: string) =>
  (text || '')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-•>]\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export default function News() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setPosts([]);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
      setPosts([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-[140px] md:pt-[152px] bg-white min-h-screen">
      {/* Header */}
      <CloudHeader tag={t('news.tag')} title={t('news.title')} italic={t('news.titleItalic')} subtitle={t('news.subtitle')} />

      {/* Newspaper front page: a paper sheet on the page */}
      <section className="relative mx-auto w-[calc(100%-2rem)] max-w-7xl my-6 md:my-10 px-5 md:px-12 py-8 md:py-12 bg-[#FAF7EF] border border-slate-300 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        {/* Paper grain */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: NOISE }} />

        {/* Masthead */}
        <header className="relative mb-8 md:mb-10">
          <div aria-hidden="true" className="border-t-[4px] border-slate-900" />
          <div className="flex items-center justify-between gap-4 py-2.5 text-xs uppercase tracking-[0.16em] font-sans font-semibold text-slate-600">
            <span>Vienna</span>
            <span>{new Date().toLocaleDateString(t('common.locale'), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div aria-hidden="true" className="border-t border-slate-900" />

          <div className="text-center py-4 md:py-5">
            <h1 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-slate-900 leading-none">
              The MCA Gazette
            </h1>
            <p className="mt-2 font-serif italic text-sm text-slate-600">{t('news.tagline')}</p>
          </div>

          <div aria-hidden="true" className="border-t border-slate-900" />
          <div aria-hidden="true" className="border-t-[4px] border-slate-900 mt-1" />
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-gold" size={44} />
          </div>
        ) : posts.length > 0 ? (
          <div className="relative space-y-16 md:space-y-20">
            {/* Lead story */}
            {(() => {
              const p = posts[0];
              const lang = i18n.language;
              const dTitle = lang === 'mn' ? (p.titleMn || p.title) : lang === 'de' ? (p.titleDe || p.title) : lang === 'tr' ? (p.titleTr || p.titleEn || p.title) : (p.titleEn || p.title);
              const dContent = lang === 'mn' ? (p.contentMn || p.content) : lang === 'de' ? (p.contentDe || p.content) : lang === 'tr' ? (p.contentTr || p.contentEn || p.content) : (p.contentEn || p.content);
              const linkUrl = `/news/${p.slug || p.id}`;
              const count = Array.isArray(p.galleryImages)
                ? p.galleryImages.length
                : typeof p.galleryImages === 'string' && p.galleryImages.trim()
                  ? p.galleryImages.split(/[,;\n]/).filter((s: string) => s.trim().length > 0).length
                  : 0;
              return (
                <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-14 md:pb-16 border-b border-slate-900">
                  <Link to={linkUrl} className="lg:col-span-7 block group">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-300">
                      <img src={p.imageUrl} alt={dTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                  </Link>

                  <div className="lg:col-span-5">
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold mb-4">{t('news.latest')}</p>
                    <Link to={linkUrl}>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-[1.15] hover:text-[#0066B3] transition-colors">{dTitle}</h2>
                    </Link>
                    <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-brand-gold" />
                        {formatNewsDate(p.createdAt, t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {count > 0 && <span>+{count} {count === 1 ? 'photo' : 'photos'}</span>}
                    </p>
                    <p className="mt-5 font-serif text-base md:text-lg text-slate-700 leading-relaxed line-clamp-5">{plain(dContent)}</p>
                    <Link to={linkUrl} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-slate-900 hover:text-brand-blue transition-colors group">
                      {t('news.readMore')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })()}

            {/* More stories */}
            {posts.length > 1 && (
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-slate-900 mb-8 pb-3 border-b border-slate-300">{t('news.moreNews')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {posts.slice(1).map((post) => {
                    const lang = i18n.language;
                    const dTitle = lang === 'mn' ? (post.titleMn || post.title) : lang === 'de' ? (post.titleDe || post.title) : lang === 'tr' ? (post.titleTr || post.titleEn || post.title) : (post.titleEn || post.title);
                    const dContent = lang === 'mn' ? (post.contentMn || post.content) : lang === 'de' ? (post.contentDe || post.content) : lang === 'tr' ? (post.contentTr || post.contentEn || post.content) : (post.contentEn || post.content);
                    const linkUrl = `/news/${post.slug || post.id}`;
                    return (
                      <article key={post.id} className="flex flex-col group">
                        <Link to={linkUrl} className="block mb-4">
                          <div className="aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-300">
                            <img src={post.imageUrl} alt={dTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          </div>
                        </Link>
                        <p className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-500 mb-2">
                          {formatNewsDate(post.createdAt, t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <Link to={linkUrl}>
                          <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 leading-snug group-hover:text-[#0066B3] transition-colors line-clamp-3">{dTitle}</h3>
                        </Link>
                        <p className="mt-3 font-serif text-sm md:text-base text-slate-700 leading-relaxed line-clamp-3 flex-1">{plain(dContent)}</p>
                        <Link to={linkUrl} className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-slate-900 hover:text-brand-blue transition-colors">
                          {t('news.readMore')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative text-center py-20 max-w-xl mx-auto">
            <UlziiSymbol className="w-14 h-14 text-brand-gold/40 mx-auto mb-6" />
            <p className="text-slate-700 font-serif text-xl italic">{t('news.noNews')}</p>
          </div>
        )}
      </section>

      {/* Broadsheet Newsletter Suite */}
      <section className="py-16 md:py-24 px-6 bg-[#0A1128] text-white relative overflow-hidden border-t-4 border-slate-900">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">
            {t('news.newsletter.title')} <span className="italic text-brand-gold font-light">{t('news.newsletter.titleItalic')}</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-sans font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            {t('news.newsletter.desc')}
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
