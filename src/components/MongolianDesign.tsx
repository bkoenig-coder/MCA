import React from 'react';

export const UlziiSymbol = ({ className = "w-12 h-12", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 10 L85 45 L73 57 L50 34 L27 57 L15 45 Z M50 90 L85 55 L73 43 L50 66 L27 43 L15 55 Z M10 50 L22 38 L45 61 L33 73 Z M90 50 L78 38 L55 61 L67 73 Z M42 42 L58 58 M42 58 L58 42" 
      fill="none" 
      stroke={color} 
      strokeWidth="8" 
      strokeLinejoin="bevel" 
    />
  </svg>
);

export const MongolianLine = ({ className = "w-full h-4", color = "currentColor" }) => (
  <svg viewBox="0 0 1000 20" className={className} preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10C50 0 100 20 150 10C200 0 250 20 300 10C350 0 400 20 450 10C500 0 550 20 600 10C650 0 700 20 750 10C800 0 850 20 900 10C950 0 1000 20 1050 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const NineWhiteBannersSymbol = ({ className = "w-16 h-24", color = "currentColor" }) => (
  <svg viewBox="0 0 400 330" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <g id="tug-banner">
        <line x1="0" y1="0" x2="0" y2="240" stroke={color} strokeWidth="4" />
        {/* Spear Tip */}
        <path d="M -8 15 L 0 -5 L 8 15 L 3 15 L 3 25 L -3 25 L -3 15 Z" fill={color} />
        {/* Horse Hair Dome and Skirt */}
        <path d="M -16 35 Q 0 15 16 35 C 25 70 20 160 12 180 Q 0 195 -12 180 C -20 160 -25 70 -16 35 Z" fill={color} opacity="0.95" />
        {/* Decorative Binding Rings */}
        <path d="M -15 45 Q 0 55 15 45" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M -18 60 Q 0 70 18 60" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.3"/>
        
        {/* Mini socket / base for the pole itself so it doesn't float in midair */}
        <ellipse cx="0" cy="240" rx="6" ry="2.5" fill={color} />
        <path d="M -6 240 L -9 246 L 9 246 L 6 240 Z" fill={color} />
        <ellipse cx="0" cy="246" rx="9" ry="3.5" fill={color} opacity="0.9" />
      </g>
    </defs>
    
    {/* Grand Ceremonial Pedestal Platform (Background & mid-tiers) */}
    {/* Step 3 (Back-most tier holding the outer-most banners) */}
    <path d="M 35 230 Q 200 205 365 230 L 370 236 Q 200 212 30 236 Z" fill={color} opacity="0.45" />
    
    {/* Step 2 (Middle-back tier holding mid-outer and mid-inner banners) */}
    <path d="M 75 240 Q 200 220 325 240 L 330 248 Q 200 228 70 248 Z" fill={color} opacity="0.65" />
    
    {/* Step 1 (Middle-front tier holding inner-front banners) */}
    <path d="M 125 250 Q 200 236 275 250 L 280 262 Q 200 248 120 262 Z" fill={color} opacity="0.8" />

    {/* Render the 9 White Banners from back to front with elegant spacing */}
    {/* Outer-most Back (Left and Right) */}
    <use href="#tug-banner" transform="translate(45, 95) scale(0.55)" />
    <use href="#tug-banner" transform="translate(355, 95) scale(0.55)" />
    
    {/* Mid-Outer Back */}
    <use href="#tug-banner" transform="translate(90, 80) scale(0.65)" />
    <use href="#tug-banner" transform="translate(310, 80) scale(0.65)" />

    {/* Mid-Inner Front */}
    <use href="#tug-banner" transform="translate(130, 65) scale(0.75)" />
    <use href="#tug-banner" transform="translate(270, 65) scale(0.75)" />

    {/* Inner Front */}
    <use href="#tug-banner" transform="translate(165, 45) scale(0.85)" />
    <use href="#tug-banner" transform="translate(235, 45) scale(0.85)" />

    {/* Main Center Altar Base Pedestal (Foreground detail, overlaps with center pole placement) */}
    <path d="M 155 264 Q 200 252 245 264 L 255 284 Q 200 272 145 284 Z" fill={color} />
    <path d="M 145 284 Q 200 272 255 284 L 250 305 Q 200 293 150 305 Z" fill={color} opacity="0.95" />
    
    {/* Bottom-most wide support foundation/steps */}
    <path d="M 125 305 Q 200 295 275 305 L 270 320 Q 200 310 130 320 Z" fill={color} opacity="0.85" />

    {/* The Main Center Great Banner - positioned prominently in the foreground center */}
    <use href="#tug-banner" transform="translate(200, 15) scale(1)" />
  </svg>
);

// Alias SoyomboSymbol to the new NineWhiteBannersSymbol to prevent breaking existing imports
export const SoyomboSymbol = NineWhiteBannersSymbol;

export const ArcherSymbol = ({ className = "w-24 h-24", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 80C30 80 35 60 45 50C55 40 70 35 80 35M80 35L70 30M80 35L75 45" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M20 90C20 90 25 70 40 60C55 50 75 50 90 60" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="45" cy="30" r="8" />
    <path d="M45 38L40 60L30 90M45 38L55 60L70 90" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M60 45L85 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const GerSymbol = ({ className = "w-32 h-24", strokeColor = "#d4af37", fillColor = "#fdfbf7" }) => (
  <svg viewBox="0 0 200 150" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Base Shadow */}
    <ellipse cx="100" cy="120" rx="85" ry="8" fill="rgba(0,0,0,0.4)" />
    
    {/* Main Ger structure with solid background to block banners/line patterns behind */}
    <path 
      d="M 15 80 Q 55 47 86 35 L 114 35 Q 145 47 185 80 L 180 118 Q 100 123 20 118 Z" 
      fill={fillColor} 
      stroke={strokeColor} 
      strokeWidth="2.5" 
      strokeLinejoin="round" 
    />
    
    {/* Roof Crown (Toono) */}
    <g transform="translate(0, 5)">
      {/* Golden crown circle */}
      <circle cx="100" cy="30" r="14" fill="#d4af37" stroke={strokeColor} strokeWidth="1.5" />
      {/* Spokes inside Toono */}
      <line x1="100" y1="16" x2="100" y2="44" stroke={strokeColor} strokeWidth="1.5" />
      <line x1="86" y1="30" x2="114" y2="30" stroke={strokeColor} strokeWidth="1.5" />
      {/* Diagonal spokes */}
      <line x1="90" y1="20" x2="110" y2="40" stroke={strokeColor} strokeWidth="1" />
      <line x1="90" y1="40" x2="110" y2="20" stroke={strokeColor} strokeWidth="1" />
      {/* Inner design circle */}
      <circle cx="100" cy="30" r="7" fill="none" stroke={strokeColor} strokeWidth="1" />
    </g>

    {/* Uni (Roof Poles) structure radiating down */}
    <g opacity="0.85">
      <line x1="88" y1="36" x2="25" y2="79" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="92" y1="36" x2="52" y2="80" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="96" y1="36" x2="78" y2="80" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="104" y1="36" x2="122" y2="80" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="108" y1="36" x2="148" y2="80" stroke={strokeColor} strokeWidth="1.2" />
      <line x1="112" y1="36" x2="175" y2="79" stroke={strokeColor} strokeWidth="1.2" />
    </g>

    {/* Roof Cover Flap (Urkh) with rope hanging */}
    <path d="M 92 22 L 108 22 L 118 42 L 82 42 Z" fill="none" stroke={strokeColor} strokeWidth="1.2" />
    <path d="M 82 42 Q 68 70 54 116" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.6" strokeDasharray="2,2" />

    {/* Eaves (Horizontal division band) */}
    <path d="M 15 80 Q 100 83 185 80" fill="none" stroke={strokeColor} strokeWidth="2" />
    {/* Golden pattern / band lining the eaves */}
    <path d="M 15 80 Q 100 83 185 80" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />

    {/* Horizontal bands wrapping walls representing ropes */}
    <path d="M 17 96 Q 100 99 183 96" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4,3" />
    <path d="M 19 108 Q 100 111 181 108" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4,3" />

    {/* Beautiful Orange-Red and Gold Door */}
    <g id="ger-door">
      {/* Outer Door Golden-Orange Frame */}
      <rect x="85" y="77" width="30" height="41" fill="#e5c158" stroke={strokeColor} strokeWidth="1.5" rx="1" />
      {/* Inner Red Fill Panels */}
      <rect x="88" y="80" width="24" height="35" fill="#a82b13" />
      {/* Left Door Panel with patterns/gold color */}
      <rect x="90" y="82" width="9" height="31" fill="#d4af37" stroke={strokeColor} strokeWidth="1" />
      <line x1="94.5" y1="82" x2="94.5" y2="113" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
      {/* Right Door Panel with patterns/gold color */}
      <rect x="101" y="82" width="9" height="31" fill="#d4af37" stroke={strokeColor} strokeWidth="1" />
      <line x1="105.5" y1="82" x2="105.5" y2="113" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
      {/* Traditional Door Handles / Knobs */}
      <circle cx="98" cy="97" r="1.2" fill="#bc341d" />
      <circle cx="102" cy="97" r="1.2" fill="#bc341d" />
      
      {/* Traditional ornament pattern on the door header */}
      <path d="M 85 77 Q 100 70 115 77" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      <path d="M 94 72 Q 100 68 106 72" fill="none" stroke="#d4af37" strokeWidth="1" />
    </g>
    
    {/* Some ultra traditional Mongolian cloud pattern (horn pattern) elements on sides for extreme elegance */}
    <path d="M 35 90 Q 40 85 45 90" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
    <path d="M 165 90 Q 160 85 155 90" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
  </svg>
);
