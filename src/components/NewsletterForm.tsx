import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
}

export default function NewsletterForm({ variant = 'dark' }: NewsletterFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || t('news.newsletter.success'));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || t('news.newsletter.error'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('common.error.unexpected'));
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('news.newsletter.placeholder')} 
          required
          disabled={status === 'loading' || status === 'success'}
          className={`flex-1 rounded-full px-8 py-4 transition-all outline-none border ${
            isDark 
              ? 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-brand-gold' 
              : 'bg-white border-brand-ink/10 text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-gold'
          }`}
        />
        <button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center min-w-[140px] ${
            isDark
              ? 'bg-brand-gold text-brand-ink hover:bg-white disabled:bg-white/50'
              : 'bg-brand-ink text-white hover:bg-brand-gold disabled:bg-brand-ink/50'
          }`}
        >
          {status === 'loading' ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            t('news.newsletter.cta')
          )}
        </button>
      </form>

      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 flex items-center gap-2 text-sm justify-center ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
