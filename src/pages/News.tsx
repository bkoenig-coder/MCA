import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, ArcherSymbol, MongolianFormalFrame, MongolianKhasDivider } from '../components/MongolianDesign';
import NewsletterForm from '../components/NewsletterForm';

export default function News() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-20 bg-brand-paper min-h-screen">
      {/* Newspaper Front Page Container */}
      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        {/* Newspaper Masthead */}
        <div className="text-center mb-8 border-b-4 border-slate-900 pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <UlziiSymbol className="w-5 h-5 text-brand-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-slate-500">Official Publication of the Austrian-Mongolian Center</span>
            <UlziiSymbol className="w-5 h-5 text-brand-gold" />
          </div>
          
          <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-slate-900 my-2 leading-none">
            THE MCA GAZETTE
          </h1>
          
          <p className="font-serif italic text-sm md:text-base text-slate-600 tracking-wide font-medium">
            Bridging Cultural Heritage, Bilateral Trade & Academic Diplomacy in Vienna
          </p>

          {/* Newspaper Metadata Double Line Bar */}
          <div className="border-t-2 border-b-2 border-slate-900 my-4 py-2 flex flex-wrap items-center justify-between text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-sans font-extrabold text-slate-800 gap-2">
            <div>VOL. I • VIENNA EDITION</div>
            <div className="hidden sm:block">ESTABLISHED 2026 • AUSTRIA & MONGOLIA</div>
            <div>{new Date().toLocaleDateString(t('common.locale'), { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-gold" size={44} />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-16">
            {/* Front Page Lead Headline Story */}
            {(() => {
              const p = posts[0];
              const lang = i18n.language;
              const dTitle = lang === 'mn' ? (p.titleMn || p.title) : lang === 'de' ? (p.titleDe || p.title) : (p.titleEn || p.title);
              const dContent = lang === 'mn' ? (p.contentMn || p.content) : lang === 'de' ? (p.contentDe || p.content) : (p.contentEn || p.content);
              const linkUrl = `/news/${p.slug || p.id}`;
              return (
                <article className="border-b-2 border-slate-900 pb-12">
                  <div className="text-center max-w-4xl mx-auto mb-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-brand-gold bg-slate-900 text-white px-3 py-1 inline-block mb-3">
                      {t('news.featured', 'LEAD DISPATCH')}
                    </span>
                    <Link to={linkUrl}>
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 leading-[1.08] hover:text-[#0066B3] transition-colors tracking-tight">
                        {dTitle}
                      </h2>
                    </Link>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
                    {/* Photo with Newspaper Caption Frame */}
                    <div className="lg:col-span-7">
                      <Link to={linkUrl} className="block group">
                        <div className="border border-slate-300 p-2 bg-white shadow-md">
                          <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                            <img 
                              src={p.imageUrl} 
                              alt={dTitle} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <p className="font-serif italic text-xs text-slate-600 pt-2 text-center border-t border-slate-200 mt-2">
                            Official Press Photograph — Austrian-Mongolian Center Dispatch
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Broadsheet Text Column */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                      <div className="font-serif text-slate-800 text-base md:text-lg leading-relaxed font-normal">
                        <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-brand-gold first-letter:leading-none">
                          {dContent}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-300 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 flex items-center gap-1.5">
                          <Calendar size={12} className="text-brand-gold" />
                          {p.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>

                        <Link 
                          to={linkUrl} 
                          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-[0.2em] font-extrabold text-slate-900 hover:text-brand-gold transition-colors border-b-2 border-slate-900 pb-0.5"
                        >
                          <span>READ FULL DISPATCH →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })()}

            {/* Broadsheet Columnist Archive Grid */}
            <div>
              <div className="border-y-2 border-slate-900 py-2 mb-10 text-center bg-slate-100">
                <h3 className="font-serif text-sm md:text-base font-bold uppercase tracking-[0.3em] text-slate-900">
                  RECENT DISPATCHES & BILATERAL STATEMENTS
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {posts.slice(1).map((post, index) => {
                  const lang = i18n.language;
                  const dTitle = lang === 'mn' ? (post.titleMn || post.title) : lang === 'de' ? (post.titleDe || post.title) : (post.titleEn || post.title);
                  const dContent = lang === 'mn' ? (post.contentMn || post.content) : lang === 'de' ? (post.contentDe || post.content) : (post.contentEn || post.content);
                  const linkUrl = `/news/${post.slug || post.id}`;
                  return (
                    <article 
                      key={post.id}
                      className="border-b md:border-b-0 md:border-r border-slate-300 md:pr-8 last:border-r-0 pb-8 md:pb-0 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-extrabold text-slate-500 mb-3 border-b border-slate-200 pb-2">
                          <span>VIENNA JOURNAL</span>
                          <span>{post.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <Link to={linkUrl}>
                          <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-4 leading-snug hover:text-[#0066B3] transition-colors">
                            {dTitle}
                          </h3>
                        </Link>

                        <Link to={linkUrl} className="block mb-4">
                          <div className="border border-slate-300 p-1 bg-white">
                            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                              <img 
                                src={post.imageUrl} 
                                alt={dTitle} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        </Link>

                        <p className="font-serif text-xs md:text-sm text-slate-700 leading-relaxed line-clamp-4 font-normal mb-6">
                          {dContent}
                        </p>
                      </div>

                      <Link 
                        to={linkUrl} 
                        className="inline-flex items-center gap-1.5 font-serif text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-900 hover:text-brand-gold transition-colors pt-3 border-t border-slate-200"
                      >
                        <span>FULL ARTICLE →</span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-slate-300 shadow-sm max-w-xl mx-auto p-8">
            <UlziiSymbol className="w-16 h-16 text-brand-gold/40 mx-auto mb-6" />
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
          <p className="text-sm md:text-base text-slate-300 font-sans font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            {t('news.newsletter.desc')}
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
