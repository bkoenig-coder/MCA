import { motion, AnimatePresence } from 'motion/react';
import CloudHeader from '../components/CloudHeader';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine, SectionSeam } from '../components/MongolianDesign';
import { cn } from '@/src/lib/utils';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';


export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtworks(items);
      } else {
        setArtworks([]);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gallery');
      setArtworks([]);
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
    <div className="pt-[140px] md:pt-[152px]">
      {/* Header */}
      <CloudHeader tag={t('gallery.tag')} title={t('gallery.title')} italic={t('gallery.titleItalic')} subtitle={t('gallery.subtitle')}>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={cn(
                'px-5 md:px-6 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-semibold transition-colors border',
                filter === cat.id
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-white/70 text-brand-ink/70 border-brand-ink/20 hover:border-brand-blue hover:text-brand-blue'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </CloudHeader>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredArt.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <AnimatePresence mode="popLayout">
                {filteredArt.map((art) => {
                  const lang = i18n.language;
                  const dTitle = lang === 'mn' ? (art.titleMn || art.title) : lang === 'de' ? (art.titleDe || art.title) : (art.titleEn || art.title);
                  const dArtist = lang === 'mn' ? (art.artistMn || art.artist) : lang === 'de' ? (art.artistDe || art.artist) : (art.artistEn || art.artist);
                  const dCat = lang === 'mn' ? (art.categoryMn || art.category) : lang === 'de' ? (art.categoryDe || art.category) : (art.categoryEn || art.category);
                  return (
                  <motion.div
                    key={art.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <Link to={`/gallery/${art.id}`}>
                      <div className="aspect-[16/10] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg relative">
                        <img 
                          src={art.imageUrl} 
                          alt={dTitle} 
                          className="w-full h-full object-cover bg-brand-paper/20 transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="text-center text-white p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold mb-4 block">
                              {dCat}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-serif mb-4">{dTitle}</h3>
                            <p className="text-sm md:text-base text-white/60 font-light italic">{t('gallery.by')} {dArtist} • {art.year}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-brand-ink/5">
              <p className="text-brand-ink/40 italic">No artworks found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <SectionSeam />
      {/* Artist Submission CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-12 text-brand-gold">
            <SoyomboSymbol className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-8 md:mb-10 tracking-tight">
            {t('gallery.submission.title')} <span className="italic text-brand-gold">{t('gallery.submission.titleItalic')}</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-ink/60 font-normal leading-relaxed mb-10 md:mb-12 max-w-2xl mx-auto">
            {t('gallery.submission.desc')}
          </p>
          <Link to="/contact" className="w-full sm:w-auto inline-block bg-brand-ink text-white px-12 py-6 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-lg shadow-brand-ink/20">
            {t('gallery.submission.cta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
