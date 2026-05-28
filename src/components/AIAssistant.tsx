import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

const MENU_OPTIONS = '[ Upcoming Events ]\n[ About Us ]\n[ How To ]';
const INITIAL_MESSAGE = `Hi! What information would you like to get today?\n\n${MENU_OPTIONS}`;

const RESPONSES: Record<string, string> = {
  'Upcoming Events': 'We regularly host cultural events, workshops, and exhibitions. These include traditional music performances, Mongolian calligraphy workshops, and Shagai (ankle bone) game nights. You can view the full schedule and RSVP on our Events page.',
  'About Us': 'The Mongolian Center in Vienna, Austria, is a cultural hub dedicated to preserving and promoting Mongolian heritage. We offer a space for the community to gather, learn, and celebrate traditional arts, language, and nomadic customs.',
  'How To': 'Here are some quick guides:\n• How to join: You can sign up via our website\'s Sign In button or visit us in Vienna.\n• How to volunteer: We are always looking for passionate volunteers. Contact us through the Contact page.\n• How to explore: Check out our interactive 3D Diorama from the menu to learn about the Ger, Shagai, and the Three Manly Skills.'
};

export default function AIAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: INITIAL_MESSAGE }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelection = (selection: string) => {
    if (isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: selection }]);
    setIsTyping(true);

    // Simulate a short delay for a natural feel
    setTimeout(() => {
      const responseText = RESPONSES[selection] || "I'm sorry, I don't have information on that.";
      const followUp = `\n\nIs there anything else I can help you with?\n\n${MENU_OPTIONS}`;
      setMessages(prev => [...prev, { role: 'model', text: responseText + followUp }]);
      setIsTyping(false);
    }, 600);
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
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
          >
            {/* Pulse effect rings */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-brand-ink/50" />
            <div className="absolute -inset-2 rounded-full animate-pulse opacity-10 bg-brand-gold/30" />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              style={{ borderRadius: '24px' }}
              className="relative flex items-center gap-2 px-5 py-3 bg-brand-ink text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 border border-brand-ink/20 hover:bg-white hover:text-brand-ink hover:border-brand-ink"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-bold text-[10px] uppercase tracking-widest">Support</span>
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
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-brand-ink/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-ink text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">Help & Support</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Close support chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-[#FAFAFA]">
              {messages.map((msg, idx) => {
                const isLatestModelMessage = msg.role === 'model' && idx === messages.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-brand-ink text-white self-end ml-auto" 
                        : "bg-white border border-brand-ink/10 text-brand-ink self-start"
                    )}
                  >
                    {msg.role === 'model' ? renderMessageText(msg.text, isLatestModelMessage) : <span className="whitespace-pre-wrap">{msg.text}</span>}
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-brand-ink/10 text-brand-ink self-start px-4 py-3 shadow-sm flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 bg-brand-ink/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-ink/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-ink/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
