import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine } from '../components/MongolianDesign';
import { cn } from '@/src/lib/utils';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export default function Gallery() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArtworks(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const categories = [
    { id: 'All', label: t('gallery.all') },
    { id: 'Traditional', label: t('gallery.traditional') },
    { id: 'Contemporary', label: t('gallery.contemporary') },
    { id: 'Cross-Cultural', label: t('gallery.crossCultural') }
  ];

  const filteredArt = artworks.filter(art => filter === 'All' || art.category === filter);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1536611004753-2ceaea518206?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-brand-gold/40" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('gallery.tag')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9]">
                {t('gallery.title')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('gallery.titleItalic')}</span>
              </h1>
            </motion.div>
            
            {/* Filter UI */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={cn(
                    "px-6 md:px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border",
                    filter === cat.id 
                      ? "bg-brand-gold text-brand-ink border-brand-gold shadow-xl" 
                      : "bg-white/10 text-white/60 border-white/10 hover:border-brand-gold hover:text-brand-gold"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 md:py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredArt.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <AnimatePresence mode="popLayout">
                {filteredArt.map((art) => (
                  <motion.div
                    key={art.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <Link to={`/gallery/${art.id}`}>
                      <div className="aspect-[16/10] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl relative">
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="text-center text-white p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold mb-4 block">
                              {art.category}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-serif mb-4">{art.title}</h3>
                            <p className="text-sm md:text-base text-white/60 font-light italic">{t('gallery.by')} {art.artist} • {art.year}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-brand-paper rounded-[40px] border border-brand-ink/5">
              <p className="text-brand-ink/40 italic">No artworks found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Artist Submission CTA */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-12 text-brand-gold">
            <SoyomboSymbol className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-8 md:mb-10 tracking-tight">
            {t('gallery.submission.title')} <span className="italic text-brand-gold">{t('gallery.submission.titleItalic')}</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-ink/60 font-light leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('gallery.submission.desc')}
          </p>
          <Link to="/contact" className="w-full sm:w-auto inline-block bg-brand-ink text-white px-12 py-6 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-2xl shadow-brand-ink/20">
            {t('gallery.submission.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
