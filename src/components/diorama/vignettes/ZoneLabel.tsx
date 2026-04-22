import React from 'react';
import { Html } from '@react-three/drei';
import { motion } from 'motion/react';

interface ZoneLabelProps {
  title: string;
  position: [number, number, number];
  hide?: boolean;
}

export function ZoneLabel({ title, position, hide }: ZoneLabelProps) {
  if (hide) return null;
  return (
    <Html position={position} center distanceFactor={15} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <motion.div 
        animate={{ y: [0, -4, 0] }} 
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <div className="bg-brand-paper/95 backdrop-blur-md border border-brand-gold/50 px-4 py-2 shadow-xl flex items-center gap-3 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-b border-r border-brand-gold" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-b border-l border-brand-gold" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-t border-r border-brand-gold" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-t border-l border-brand-gold" />
          
          <div className="w-1.5 h-1.5 bg-brand-gold rotate-45" />
          <span className="font-serif text-brand-ink text-sm font-bold tracking-[0.2em] uppercase whitespace-nowrap">
            {title}
          </span>
          <div className="w-1.5 h-1.5 bg-brand-gold rotate-45" />
        </div>
        {/* Pointer triangle */}
        <div className="w-3 h-3 bg-brand-paper/95 border-b border-r border-brand-gold/50 rotate-45 -mt-1.5 shadow-sm" />
      </motion.div>
    </Html>
  );
}
