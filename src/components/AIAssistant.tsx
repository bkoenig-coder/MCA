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
            className="block w-full text-left mt-2 px-3 py-2.5 rounded-lg bg-brand-cream hover:bg-brand-sand border border-brand-line text-sm font-medium text-brand-ink disabled:opacity-50 disabled:cursor-not-allowed"
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
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-[calc(100%-16px)] right-1 z-0 flex items-end gap-1 cursor-pointer"
                >
                  <span className="mb-14 whitespace-nowrap rounded-xl rounded-br-sm bg-brand-cream border border-brand-line px-3 py-1.5 text-sm text-brand-ink">
                    {t('siteUi.nav.hello')}
                  </span>
                  <WavingBoy className="h-28 w-auto" />
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsOpen(true)}
              aria-label={t('siteUi.assistant.open')}
              className="relative z-10 h-11 flex items-center gap-2 px-4 rounded-lg bg-brand-ink text-white text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-brand-blue"
            >
              <MessageSquare size={18} strokeWidth={1.5} />
              <span>{t('siteUi.assistant.support')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label={t('siteUi.assistant.dialog')}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] max-h-[82vh] bg-brand-cream shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-brand-line flex flex-col overflow-hidden rounded-xl"
          >
            {/* Header */}
            <div className="bg-brand-ink text-white pl-5 pr-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare size={18} strokeWidth={1.5} />
                <h3 className="font-sans font-medium text-[15px] tracking-normal">{t('siteUi.assistant.title')}</h3>
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
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-brand-paper">
              {messages.map((msg, idx) => {
                const isLatestModelMessage = msg.role === 'model' && idx === messages.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[88%] px-4 py-3 text-sm leading-relaxed rounded-xl",
                      msg.role === 'user' 
                        ? "bg-brand-ink text-white self-end ml-auto" 
                        : "bg-brand-cream border border-brand-line text-brand-ink self-start"
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
                  className="bg-brand-cream border border-brand-line text-brand-ink self-start px-4 py-3 flex items-center gap-1.5 rounded-xl"
                >
                  <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-ink-mute rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Query Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-brand-cream border-t border-brand-line flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('siteUi.assistant.placeholder')}
                aria-label={t('siteUi.assistant.askLabel')}
                disabled={isTyping}
                className="flex-1 h-10 px-3 text-sm bg-brand-sand border border-brand-line rounded-lg focus:outline-none focus:border-brand-blue text-brand-ink placeholder:text-brand-ink-mute"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                aria-label={t('siteUi.assistant.send')}
                className="w-10 h-10 flex items-center justify-center bg-brand-ink text-white rounded-lg hover:bg-brand-blue disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} strokeWidth={1.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
