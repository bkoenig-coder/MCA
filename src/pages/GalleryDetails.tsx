import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { db, doc, onSnapshot, handleFirestoreError, OperationType } from '../firebase';
import { SoyomboSymbol } from '../components/MongolianDesign';

export default function GalleryDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'gallery', id), (doc) => {
      if (doc.exists()) {
        setItem({ id: doc.id, ...doc.data() });
      } else {
        navigate('/gallery');
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `gallery/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) return null;

  const lang = i18n.language;
  const dTitle = lang === 'mn' ? (item.titleMn || item.title) : lang === 'de' ? (item.titleDe || item.title) : (item.titleEn || item.title);
  const dArtist = lang === 'mn' ? (item.artistMn || item.artist) : lang === 'de' ? (item.artistDe || item.artist) : (item.artistEn || item.artist);
  const dDesc = lang === 'mn' ? (item.descriptionMn || item.description) : lang === 'de' ? (item.descriptionDe || item.description) : (item.descriptionEn || item.description);
  const dCat = lang === 'mn' ? (item.categoryMn || item.category) : lang === 'de' ? (item.categoryDe || item.category) : (item.categoryEn || item.category);

  return (
    <div className="pt-32 pb-20 bg-brand-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          to="/gallery" 
          className="inline-flex items-center gap-2 text-brand-ink/60 hover:text-brand-gold transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs uppercase tracking-widest font-bold">{t('gallery.back')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={item.imageUrl} 
                alt={dTitle} 
                className="w-full h-full object-contain bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold rounded-full flex items-center justify-center text-brand-ink shadow-xl hidden md:flex">
              <SoyomboSymbol className="w-12 h-12" />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-gold/20">
                  {dCat}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-brand-ink mb-6 leading-tight">
                {dTitle}
              </h1>
              <div className="flex flex-wrap gap-8 text-brand-ink/60">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm italic">{dArtist}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm">{item.year}</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-brand-ink/5" />

            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-ink/40">About this piece</h3>
              <p className="text-lg text-brand-ink/70 font-light leading-relaxed whitespace-pre-wrap">
                {dDesc || "No description provided for this artwork."}
              </p>
            </div>

            <div className="pt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  navigator.share?.({
                    title: dTitle,
                    text: `Check out this artwork: ${dTitle} by ${dArtist}`,
                    url: window.location.href
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  });
                }}
                className="flex items-center gap-3 px-8 py-4 bg-brand-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/20"
              >
                <Share2 className="w-4 h-4" />
                Share Artwork
              </button>
              <Link 
                to="/contact" 
                className="flex items-center gap-3 px-8 py-4 bg-white text-brand-ink border border-brand-ink/10 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-paper transition-all"
              >
                Inquire About Piece
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
