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
    <div className="pt-20">
      {/* Executive Hero */}
      <section className="relative min-h-[35vh] md:h-[50vh] flex items-center px-6 bg-[#0A1128] overflow-hidden border-b border-brand-gold/20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1723002573937-940912b58eb7?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/80 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <UlziiSymbol className="w-5 h-5 text-brand-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-brand-gold">{t('news.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight">
              {t('news.title')} <br className="hidden md:block" /><span className="italic text-brand-gold font-light">{t('news.titleItalic')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* News & Press Grid Section */}
      <section className="py-16 md:py-24 px-6 bg-brand-paper">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="animate-spin text-brand-gold" size={44} />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-16 md:space-y-24">
              {/* Featured Lead Publication Spotlight */}
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                {(() => {
                  const p = posts[0];
                  const lang = i18n.language;
                  const dTitle = lang === 'mn' ? (p.titleMn || p.title) : lang === 'de' ? (p.titleDe || p.title) : (p.titleEn || p.title);
                  const dContent = lang === 'mn' ? (p.contentMn || p.content) : lang === 'de' ? (p.contentDe || p.content) : (p.contentEn || p.content);
                  const linkUrl = `/news/${p.slug || p.id}`;
                  return (
                    <div className="bg-white border border-brand-gold/30 rounded-[32px] md:rounded-[48px] shadow-2xl p-8 md:p-12 relative overflow-hidden">
                      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
                        <div className="lg:col-span-7">
                          <Link to={linkUrl} className="aspect-[16/10] rounded-[24px] overflow-hidden relative group/img block bg-slate-900 border border-slate-200">
                            <img 
                              src={p.imageUrl} 
                              alt={dTitle} 
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-transparent transition-colors duration-300" />
                          </Link>
                        </div>
                        <div className="lg:col-span-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3.5 py-1 bg-slate-900 text-brand-gold text-[9px] uppercase tracking-[0.2em] font-extrabold rounded-full">
                                {t('news.featured')}
                              </span>
                              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-sans">
                                <Calendar size={12} className="text-brand-gold" />
                                <span>{p.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            </div>
                            <Link to={linkUrl}>
                              <h2 className="text-2xl md:text-4xl font-serif text-slate-900 mb-4 leading-tight group-hover:text-brand-gold transition-colors duration-300 font-semibold">{dTitle}</h2>
                            </Link>
                            <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed mb-8 line-clamp-4 font-light">
                              {dContent}
                            </p>
                          </div>
                          <Link 
                            to={linkUrl} 
                            className="inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-brand-gold hover:text-slate-950 px-8 py-4 rounded-full text-xs uppercase tracking-[0.18em] font-extrabold transition-all duration-300 w-max shadow-md"
                          >
                            <span>{t('news.readFull')}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.article>

              <MongolianKhasDivider className="max-w-4xl mx-auto my-12" />

              {/* Publication Archive Grid */}
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-1.5 rotate-45 bg-brand-gold" />
                  <h3 className="text-xs uppercase tracking-[0.3em] font-extrabold text-slate-900">Recent Publications & Statements</h3>
                  <div className="h-px bg-slate-200 flex-1 ml-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(1).map((post, index) => {
                    const lang = i18n.language;
                    const dTitle = lang === 'mn' ? (post.titleMn || post.title) : lang === 'de' ? (post.titleDe || post.title) : (post.titleEn || post.title);
                    const dContent = lang === 'mn' ? (post.contentMn || post.content) : lang === 'de' ? (post.contentDe || post.content) : (post.contentEn || post.content);
                    const linkUrl = `/news/${post.slug || post.id}`;
                    return (
                      <motion.article 
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white border border-brand-gold/30 rounded-[24px] md:rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg hover:shadow-xl hover:border-brand-gold transition-all duration-300"
                      >
                        {/* Top Gold Border Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold/30 via-brand-gold to-brand-gold/30 group-hover:h-1.5 transition-all" />

                        <div>
                          <Link to={linkUrl} className="aspect-[16/10] rounded-[20px] overflow-hidden mb-6 block relative bg-slate-100 border border-slate-200/80">
                            <img 
                              src={post.imageUrl} 
                              alt={dTitle} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-300" />
                          </Link>

                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] uppercase tracking-wider font-extrabold rounded-full">
                              {t('news.update')}
                            </span>
                            <span className="text-[10px] font-sans text-slate-400 font-medium flex items-center gap-1">
                              <Calendar size={11} className="text-brand-gold" />
                              {post.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          <Link to={linkUrl}>
                            <h3 className="text-xl font-serif text-slate-900 mb-3 group-hover:text-brand-gold transition-colors duration-300 font-semibold line-clamp-2">{dTitle}</h3>
                          </Link>

                          <p className="text-xs text-slate-600 font-sans font-light leading-relaxed mb-6 line-clamp-3">
                            {dContent}
                          </p>
                        </div>

                        <Link 
                          to={linkUrl} 
                          className="inline-flex items-center justify-between text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-900 hover:text-brand-gold transition-colors pt-4 border-t border-slate-100"
                        >
                          <span>{t('news.readMore')}</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-brand-gold" />
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-brand-gold/30 shadow-sm max-w-xl mx-auto">
              <UlziiSymbol className="w-16 h-16 text-brand-gold/30 mx-auto mb-6" />
              <p className="text-slate-600 font-serif text-xl italic">{t('news.noNews')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Official Newsletter Suite */}
      <section className="py-16 md:py-24 px-6 bg-[#0A1128] text-white relative overflow-hidden border-t border-brand-gold/20">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-slate-900/90 border border-brand-gold/40 p-8 md:p-14 rounded-[32px] md:rounded-[48px] shadow-2xl text-center">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">
              {t('news.newsletter.title')} <span className="italic text-brand-gold font-light">{t('news.newsletter.titleItalic')}</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-sans font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('news.newsletter.desc')}
            </p>
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
