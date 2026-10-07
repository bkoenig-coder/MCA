import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  /** When true, closing by backdrop click or the X asks for confirmation first. */
  isDirty?: boolean;
  /** Action bar that stays visible below the scrolling content. */
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, className, isDirty, footer }: ModalProps) {
  const requestClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Close without saving?')) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={requestClose}
            className="fixed inset-0 bg-brand-ink/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1.5rem)] ${className || 'max-w-2xl'} bg-white rounded-[24px] md:rounded-[32px] shadow-2xl z-[201] overflow-hidden flex flex-col max-h-[94vh]`}
          >
            <div className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 pb-4 shrink-0">
              <h3 className="text-2xl md:text-3xl font-serif">{title}</h3>
              <button onClick={requestClose} aria-label="Close" className="p-2 hover:bg-brand-sand rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="px-6 md:px-10 pb-6 overflow-y-auto no-scrollbar flex-1 min-h-0">{children}</div>
            {footer && <div className="shrink-0 px-6 md:px-10 py-4 bg-white border-t border-slate-200 shadow-[0_-8px_20px_-12px_rgba(15,23,42,0.25)]">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
