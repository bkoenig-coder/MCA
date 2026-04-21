import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db, doc, getDoc, OperationType, handleFirestoreError } from '../firebase';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { UlziiSymbol, SoyomboSymbol, MongolianLine } from '../components/MongolianDesign';
import { useTranslation } from 'react-i18next';

export default function NewsDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError(t('news.details.notFound'));
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h1 className="text-3xl font-serif mb-4">{error || t('common.error.unexpected')}</h1>
        <Link to="/news" className="text-brand-gold font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> {t('news.details.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden bg-white">
      {/* Background Symbols */}
      <div className="absolute top-20 right-0 opacity-[0.02] pointer-events-none">
        <UlziiSymbol className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] text-brand-gold" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/news" className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors mb-8 md:mb-12 font-medium group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('news.details.back')}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('news.update')}</span>
              <div className="h-px w-8 bg-brand-gold/30" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/40">
                {post.createdAt?.toDate().toLocaleDateString(t('common.locale'), { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8 text-brand-ink">
              {post.title}
            </h1>
          </div>

          <div className="aspect-[16/9] md:aspect-[21/9] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl mb-12 md:mb-16 relative">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-contain bg-brand-paper/30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <SoyomboSymbol className="w-12 h-12 md:w-16 md:h-16 text-white/30" />
            </div>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-none text-brand-ink/80 font-light leading-relaxed">
            {/* Split content by newlines to render paragraphs */}
            {post.content.split('\n').map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : null
            ))}
          </div>
        </motion.article>

        <div className="mt-16 md:mt-24">
          <MongolianLine className="w-full text-brand-gold/20 h-8" />
        </div>
      </div>
    </div>
  );
}
