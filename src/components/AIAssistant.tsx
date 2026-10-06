import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import WavingBoy from './WavingBoy';

type Topic = 'events' | 'about' | 'howto';
const TOPICS: Topic[] = ['events', 'about', 'howto'];
type ChatMessage = {
  role: 'user' | 'model';
  text?: string;
  kind?: 'greeting' | 'answer' | 'generic' | 'fallback';
  topic?: Topic;
};

export default function AIAssistant() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', kind: 'greeting' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const [boyVisible, setBoyVisible] = useState(false);
  const boyTimer = useRef<number | undefined>(undefined);
  const boyLastShown = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleGameStart = () => setIsGamePlaying(true);
    const handleGameEnd = () => setIsGamePlaying(false);

    window.addEventListener('game-started', handleGameStart);
    window.addEventListener('game-ended', handleGameEnd);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('game-started', handleGameStart);
      window.removeEventListener('game-ended', handleGameEnd);
    };
  }, []);

  // A friendly boy pops up above the Support button when someone moves, clicks or taps near it,
  // or pauses after scrolling (so touch screens, which have no hover, see him too).
  useEffect(() => {
    if (isOpen || isGamePlaying) {
      setBoyVisible(false);
      return;
    }
    const peek = (ms: number) => {
      setBoyVisible(true);
      boyLastShown.current = Date.now();
      window.clearTimeout(boyTimer.current);
      boyTimer.current = window.setTimeout(() => setBoyVisible(false), ms);
    };
    const isNear = (x: number, y: number, radius: number) => {
      const el = fabRef.current;
      if (!el) return false;
      const b = el.getBoundingClientRect();
      return Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2)) < radius;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' && isNear(e.clientX, e.clientY, 170)) peek(3500);
    };
    const onDown = (e: PointerEvent) => {
      if (isNear(e.clientX, e.clientY, 240)) peek(5000);
    };
    let scrollTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (window.scrollY > 300 && Date.now() - boyLastShown.current > 25000) peek(4500);
      }, 450);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(boyTimer.current);
    };
  }, [isOpen, isGamePlaying]);

  // Canned model messages are stored by kind and translated when shown, so they follow the language switch.
  const menuText = () => TOPICS.map(k => '[ ' + t('siteUi.assistant.menu.' + k) + ' ]').join('\n');
  const modelText = (m: ChatMessage): string => {
    switch (m.kind) {
      case 'greeting':
        return t('siteUi.assistant.greeting') + '\n\n' + menuText();
      case 'answer':
        return t('siteUi.assistant.answers.' + m.topic) + '\n\n' + t('siteUi.assistant.followUp') + '\n\n' + menuText();
      case 'generic':
        return t('siteUi.assistant.generic');
      case 'fallback':
        return t('siteUi.assistant.fallback');
      default:
        return m.text || '';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMobile]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: queryText }]);
    setIsTyping(true);

    // If it matches a quick menu option exactly, answer immediately with the prepared text
    const topic = TOPICS.find(k => t('siteUi.assistant.menu.' + k) === queryText.trim());
    if (topic) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', kind: 'answer', topic }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: i18n.language || 'en'
        })
      });

      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();
      setMessages(prev => [...prev, data.reply ? { role: 'model', text: data.reply } : { role: 'model', kind: 'generic' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', kind: 'fallback' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    sendQuery(text);
  };

  const handleSelection = (selection: string) => {
    sendQuery(selection);
  };

  const renderMessageText = (text: string, isLatest: boolean) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const buttonText = part.slice(1, -1).trim();
        return (
          <button
            key={i}
            onClick={() => handleSelection(buttonText)}
            disabled={!isLatest || isTyping}
            className="block w-full text-center mt-3 px-4 py-3 bg-white hover:bg-brand-paper border border-brand-ink/20 text-xs font-bold uppercase tracking-widest text-brand-ink transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonText}
          </button>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  if (isMobile && isGamePlaying) {
    return null;
  }

  return (
    <div className="font-sans">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            ref={fabRef}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
          >
            {/* The boy rises from behind the button */}
            <AnimatePresence>
              {boyVisible && (
                <motion.button
                  key="hello-boy"
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label={t('siteUi.assistant.sayHello')}
                  initial={{ y: 70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 70, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  className="absolute bottom-[calc(100%-16px)] right-1 z-0 flex items-end gap-1 cursor-pointer"
                >
                  <span className="mb-14 whitespace-nowrap rounded-2xl rounded-br-sm bg-white border border-brand-ink/10 px-3 py-1.5 text-xs font-medium text-brand-ink shadow-md">
                    {t('siteUi.nav.hello')}
                  </span>
                  <WavingBoy className="h-28 w-auto" />
                </motion.button>
              )}
            </AnimatePresence>
            {/* Pulse effect rings */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-brand-ink/50" />
            <div className="absolute -inset-2 rounded-full animate-pulse opacity-10 bg-brand-gold/30" />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-label={t('siteUi.assistant.open')}
              style={{ borderRadius: '24px' }}
              className="relative z-10 flex items-center gap-2 px-5 py-3 bg-brand-ink text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 border border-brand-ink/20 hover:bg-white hover:text-brand-ink hover:border-brand-ink"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span className="font-bold text-[10px] uppercase tracking-widest">{t('siteUi.assistant.support')}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-label={t('siteUi.assistant.dialog')}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] max-h-[82vh] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-brand-ink/10 flex flex-col overflow-hidden rounded-xl"
          >
            {/* Header */}
            <div className="bg-brand-ink text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-brand-gold" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">{t('siteUi.assistant.title')}</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors rounded-lg"
                aria-label={t('siteUi.assistant.close')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#FAFAFA]">
              {messages.map((msg, idx) => {
                const isLatestModelMessage = msg.role === 'model' && idx === messages.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[88%] px-4 py-3 text-xs leading-relaxed shadow-sm rounded-xl",
                      msg.role === 'user' 
                        ? "bg-brand-ink text-white self-end ml-auto" 
                        : "bg-white border border-brand-ink/10 text-brand-ink self-start"
                    )}
                  >
                    {msg.role === 'model' ? renderMessageText(modelText(msg), isLatestModelMessage) : <span className="whitespace-pre-wrap">{msg.text}</span>}
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-brand-ink/10 text-brand-ink self-start px-4 py-3 shadow-sm flex items-center gap-1.5 rounded-xl"
                >
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Query Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('siteUi.assistant.placeholder')}
                aria-label={t('siteUi.assistant.askLabel')}
                disabled={isTyping}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-gold text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                aria-label={t('siteUi.assistant.send')}
                className="p-2.5 bg-brand-ink text-brand-gold rounded-lg hover:bg-brand-indigo transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
