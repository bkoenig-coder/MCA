import React from 'react';

export const UlziiSymbol = ({ className = "w-12 h-12", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L95 50L50 95L5 50L50 5Z" stroke={color} strokeWidth="2" />
    <path d="M50 20L80 50L50 80L20 50L50 20Z" stroke={color} strokeWidth="2" />
    <path d="M50 35L65 50L50 65L35 50L50 35Z" stroke={color} strokeWidth="2" />
    <path d="M50 5V95M5 50H95" stroke={color} strokeWidth="2" />
  </svg>
);

export const MongolianLine = ({ className = "w-full h-4", color = "currentColor" }) => (
  <svg viewBox="0 0 1000 20" className={className} preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10C50 0 100 20 150 10C200 0 250 20 300 10C350 0 400 20 450 10C500 0 550 20 600 10C650 0 700 20 750 10C800 0 850 20 900 10C950 0 1000 20 1050 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SoyomboSymbol = ({ className = "w-16 h-24", color = "currentColor" }) => (
  <svg viewBox="0 0 200 320" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    {/* Flame */}
    <path d="M 100 10 Q 115 35 100 55 Q 85 35 100 10 Z" />
    <path d="M 100 42 Q 116 25 119 28 Q 125 45 105 55 Z" />
    <path d="M 100 42 Q 84 25 81 28 Q 75 45 95 55 Z" />
    
    {/* Sun and Moon */}
    <circle cx="100" cy="74" r="14" />
    <path d="M 68 86 Q 100 115 132 86 Q 100 100 68 86 Z" />
    
    {/* Top Triangle */}
    <polygon points="65,120 135,120 100,144" />
    
    {/* Top Horizontal Rectangle */}
    <rect x="65" y="152" width="70" height="18" />
    
    {/* Taijitu (Yin-Yang) */}
    <circle cx="100" cy="208" r="30" fill="none" stroke={color} strokeWidth="3" />
    <path fillRule="evenodd" clipRule="evenodd" d="M 70 208 A 30 30 0 0 1 130 208 A 15 15 0 0 1 100 208 A 15 15 0 0 0 70 208 Z M 81 208 A 4 4 0 1 0 89 208 A 4 4 0 1 0 81 208 Z" fill={color} />
    <circle cx="115" cy="208" r="4" fill={color} />
    
    {/* Bottom Horizontal Rectangle */}
    <rect x="65" y="246" width="70" height="18" />
    
    {/* Bottom Triangle */}
    <polygon points="65,272 135,272 100,296" />
    
    {/* Left and Right Pillars */}
    <rect x="15" y="120" width="35" height="176" />
    <rect x="150" y="120" width="35" height="176" />
  </svg>
);

export const ArcherSymbol = ({ className = "w-24 h-24", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 80C30 80 35 60 45 50C55 40 70 35 80 35M80 35L70 30M80 35L75 45" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M20 90C20 90 25 70 40 60C55 50 75 50 90 60" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="45" cy="30" r="8" />
    <path d="M45 38L40 60L30 90M45 38L55 60L70 90" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M60 45L85 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
