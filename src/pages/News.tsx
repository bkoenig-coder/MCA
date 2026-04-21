import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, MongolianLine, ArcherSymbol } from '../components/MongolianDesign';
import NewsletterForm from '../components/NewsletterForm';

export default function News() {
  const { t } = useTranslation();
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
      {/* Hero */}
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1723002573937-940912b58eb7?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('news.tag')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9]">
              {t('news.title')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('news.titleItalic')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24 md:py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24 md:py-40">
              <Loader2 className="animate-spin text-brand-gold" size={48} />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-24 md:space-y-40">
              {/* Featured Post */}
              <motion.article 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
              >
                <Link to={`/news/${posts[0].id}`} className="aspect-[16/10] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl relative group block">
                  <img 
                    src={posts[0].imageUrl} 
                    alt={posts[0].title} 
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-700" />
                </Link>
                <div>
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('news.featured')}</span>
                    <div className="h-px w-8 bg-brand-gold/30" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">
                      {posts[0].createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <Link to={`/news/${posts[0].id}`}>
                    <h2 className="text-3xl md:text-5xl font-serif text-brand-ink mb-6 md:mb-8 leading-tight group-hover:text-brand-gold transition-colors duration-500">{posts[0].title}</h2>
                  </Link>
                  <p className="text-lg md:text-xl text-brand-ink/60 font-light leading-relaxed mb-10 md:mb-12 line-clamp-4">
                    {posts[0].content}
                  </p>
                  <Link to={`/news/${posts[0].id}`} className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink group/btn">
                    {t('news.readFull')}
                    <div className="w-10 h-10 md:w-12 md:h-12 border border-brand-ink/10 rounded-full flex items-center justify-center group-hover/btn:border-brand-gold group-hover/btn:text-brand-gold transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              </motion.article>

              {/* Other Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                {posts.slice(1).map((post) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link to={`/news/${post.id}`} className="aspect-[16/10] rounded-[32px] md:rounded-[40px] overflow-hidden mb-8 md:mb-10 shadow-lg relative block">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-700" />
                    </Link>
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('news.update')}</span>
                      <div className="h-px w-6 bg-brand-gold/30" />
                      <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">
                        {post.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <Link to={`/news/${post.id}`}>
                      <h3 className="text-2xl md:text-3xl font-serif text-brand-ink mb-4 md:mb-6 group-hover:text-brand-gold transition-colors duration-500">{post.title}</h3>
                    </Link>
                    <p className="text-sm md:text-base text-brand-ink/60 font-light leading-relaxed mb-6 md:mb-8 line-clamp-3">
                      {post.content}
                    </p>
                    <Link to={`/news/${post.id}`} className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink border-b border-brand-ink/10 pb-2 hover:border-brand-gold hover:text-brand-gold transition-all">
                      {t('news.readMore')}
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 md:py-40 bg-brand-paper rounded-[40px] md:rounded-[80px] border border-dashed border-brand-gold/20">
              <UlziiSymbol className="w-16 h-16 md:w-20 md:h-20 text-brand-gold/20 mx-auto mb-8" />
              <p className="text-brand-ink/40 font-serif text-xl md:text-2xl italic">{t('news.noNews')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 md:py-40 px-6 bg-brand-ink text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.05] translate-x-1/4 -translate-y-1/4">
          <UlziiSymbol className="w-[400px] md:w-[600px] h-[400px] md:h-[600px] text-brand-gold" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 md:mb-10 tracking-tight">
            {t('news.newsletter.title')} <span className="italic text-brand-gold">{t('news.newsletter.titleItalic')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('news.newsletter.desc')}
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
