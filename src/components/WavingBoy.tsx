import React from 'react';
import { motion } from 'motion/react';

/**
 * Flat illustration of a Mongolian boy in a deel (traditional robe) waving hello.
 * Blue deel with gold trim and a sash, black gutal boots with upturned toes.
 * The raised arm waves gently; respects reduced-motion through the global CSS rule.
 */
export default function WavingBoy({ className = 'h-48 w-auto' }: { className?: string }) {
  const skin = '#F1C7A0';
  const skinShade = '#E0AE85';
  const deel = '#0A5FA8';
  const deelDark = '#084F8C';
  const gold = '#D4AF37';
  const sash = '#C8102E';
  const ink = '#17181C';

  return (
    <svg viewBox="0 0 200 300" className={className} role="img" aria-label="A Mongolian boy in a deel waving hello" xmlns="http://www.w3.org/2000/svg">
      {/* ground shadow */}
      <ellipse cx="100" cy="290" rx="58" ry="6" fill="#0F172A" opacity="0.12" />

      {/* boots (gutal) with upturned toes */}
      <path d="M62 248 H92 V274 Q92 284 83 284 H56 Q50 284 54 278 L62 268 Z" fill={ink} />
      <path d="M108 248 H138 V268 L146 278 Q150 284 144 284 H117 Q108 284 108 274 Z" fill={ink} />
      <path d="M62 256 H92 M108 256 H138" stroke={gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

      {/* deel: long wrap robe */}
      <path d="M68 112 Q100 100 132 112 L148 258 Q100 270 52 258 Z" fill={deel} />
      {/* shading on the left side */}
      <path d="M68 112 L52 258 Q64 262 76 263 L84 124 Z" fill={deelDark} opacity="0.45" />
      {/* hem trim */}
      <path d="M52 258 Q100 270 148 258" fill="none" stroke={gold} strokeWidth="4" strokeLinecap="round" />
      {/* wrap-over closure: diagonal from the collar down the right side */}
      <path d="M92 108 L128 150 L139 258" fill="none" stroke={gold} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      {/* buttons on the shoulder */}
      <circle cx="115" cy="127" r="2.6" fill={gold} />
      <circle cx="121" cy="136" r="2.6" fill={gold} />
      <circle cx="127" cy="145" r="2.6" fill={gold} />
      {/* high collar */}
      <path d="M82 102 Q100 92 118 102 L114 118 Q100 112 86 118 Z" fill={gold} />
      <path d="M86 108 Q100 102 114 108" fill="none" stroke="#AA7C11" strokeWidth="1.5" />

      {/* sash (bus) with hanging end */}
      <path d="M56 182 Q100 192 144 182 L142 198 Q100 208 58 198 Z" fill={sash} />
      <path d="M118 196 L126 232 L134 230 L128 195 Z" fill={sash} />
      <path d="M124 232 L136 232" stroke={gold} strokeWidth="2.5" strokeLinecap="round" />

      {/* arm hanging down (his left) */}
      <path d="M130 114 L152 122 L158 196 L140 200 L132 150 Z" fill={deel} />
      <path d="M140 198 L158 194 L159 206 L141 210 Z" fill={gold} />
      <circle cx="150" cy="214" r="9" fill={skin} />

      {/* neck */}
      <rect x="92" y="88" width="16" height="18" rx="4" fill={skinShade} />

      {/* waving arm (his right), pivoting at the shoulder */}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '72px 116px' }}
        animate={{ rotate: [-7, 9, -7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M74 112 L54 96 L30 56 L45 47 L70 84 L84 102 Z" fill={deel} />
        {/* gold cuff */}
        <path d="M31 58 L46 49 L51 60 L36 69 Z" fill={gold} />
        {/* open hand */}
        <ellipse cx="34" cy="42" rx="10" ry="11" fill={skin} />
        <path d="M27 34 L24 24 M33 31 L32 20 M39 31 L41 21 M44 35 L50 27" stroke={skin} strokeWidth="5" strokeLinecap="round" />
        {/* wave marks */}
        <path d="M12 38 Q6 46 12 54" fill="none" stroke={gold} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5 34 Q-3 46 5 58" fill="none" stroke={gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      </motion.g>

      {/* head */}
      <circle cx="73" cy="68" r="5.5" fill={skinShade} />
      <circle cx="127" cy="68" r="5.5" fill={skinShade} />
      <circle cx="100" cy="66" r="29" fill={skin} />
      {/* hair */}
      <path d="M71 60 Q72 34 100 34 Q128 34 129 60 Q122 47 100 47 Q78 47 71 60 Z" fill={ink} />
      <path d="M84 47 Q92 52 100 47" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {/* face */}
      <path d="M85 58 Q89 55 93 58" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M107 58 Q111 55 115 58" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="89" cy="67" rx="2.6" ry="3.2" fill={ink} />
      <ellipse cx="111" cy="67" rx="2.6" ry="3.2" fill={ink} />
      <circle cx="82" cy="77" r="5" fill="#F29A8A" opacity="0.5" />
      <circle cx="118" cy="77" r="5" fill="#F29A8A" opacity="0.5" />
      <path d="M91 79 Q100 89 109 79" fill="none" stroke="#7A3B2E" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
