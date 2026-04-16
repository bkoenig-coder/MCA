import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, MongolianLine } from './MongolianDesign';

const MENU_OPTIONS = '[ 📅 Upcoming Events ]\n[ ℹ️ About Us ]\n[ 🛠️ How To ]';
const INITIAL_MESSAGE = `Hi! What information would you like to get today?\n\n${MENU_OPTIONS}`;

const RESPONSES: Record<string, string> = {
  '📅 Upcoming Events': 'We regularly host cultural events, workshops, and exhibitions. These include traditional music performances (Morin Khuur), Mongolian calligraphy workshops, and Shagai (ankle bone) game nights. You can view the full schedule and RSVP on our Events page!',
  'ℹ️ About Us': 'The Mongolian Center in Vienna, Austria, is a cultural hub dedicated to preserving and promoting Mongolian heritage. We offer a space for the community to gather, learn, and celebrate traditional arts, language, and nomadic customs.',
  '🛠️ How To': 'Here are some quick guides:\n• How to join: You can sign up via our website\'s Sign In button or visit us in Vienna.\n• How to volunteer: We are always looking for passionate volunteers! Contact us through the Contact page.\n• How to explore: Check out our interactive 3D Diorama from the menu to learn about the Ger, Shagai, and the Three Manly Skills!'
};

export default function AIAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: INITIAL_MESSAGE }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            className="group relative block w-full text-center mt-3 px-4 py-3 bg-[#FDFBF7] hover:bg-brand-gold text-brand-ink hover:text-brand-ink border border-brand-gold/40 rounded-sm text-sm font-serif font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-default shadow-sm"
          >
            {/* Corner accents */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-brand-gold/50 group-hover:bg-brand-ink/30 transition-colors" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-brand-gold/50 group-hover:bg-brand-ink/30 transition-colors" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-brand-gold/50 group-hover:bg-brand-ink/30 transition-colors" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-brand-gold/50 group-hover:bg-brand-ink/30 transition-colors" />
            
            <span className="relative z-10 tracking-wide">
              {buttonText}
            </span>
          </button>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-ink text-brand-gold shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-brand-gold hover:text-brand-ink border-2 border-brand-gold/30 ring-4 ring-brand-ink/10",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <UlziiSymbol className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-[#FDFBF7] rounded-xl shadow-2xl border-2 border-brand-gold/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-ink text-brand-gold px-6 py-4 flex items-center justify-between relative overflow-hidden">
              <UlziiSymbol className="absolute -right-4 -top-4 w-24 h-24 text-brand-gold/10 rotate-12" />
              <div className="flex items-center gap-3 relative z-10">
                <UlziiSymbol className="w-6 h-6" />
                <div>
                  <h3 className="font-serif text-lg leading-none tracking-wide">Information</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Mongolian Center</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative z-10"
              >
                <X size={16} />
              </button>
            </div>
            <MongolianLine className="w-full text-brand-gold h-1.5 opacity-80" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 relative">
              <UlziiSymbol className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-brand-gold/5 pointer-events-none" />
              
              {messages.map((msg, idx) => {
                const isLatestModelMessage = msg.role === 'model' && idx === messages.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[85%] px-4 py-3 text-sm relative z-10 shadow-sm",
                      msg.role === 'user' 
                        ? "bg-brand-ink text-[#FDFBF7] self-end rounded-xl rounded-tr-sm border border-brand-gold/30" 
                        : "bg-white border-2 border-brand-gold/20 text-brand-ink self-start rounded-xl rounded-tl-sm"
                    )}
                  >
                    {msg.role === 'model' ? renderMessageText(msg.text, isLatestModelMessage) : <span className="whitespace-pre-wrap">{msg.text}</span>}
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-brand-ink/10 text-brand-ink self-start rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
