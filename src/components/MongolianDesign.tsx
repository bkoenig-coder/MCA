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
  <svg viewBox="0 0 200 320" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
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
      </g>
    </defs>
    
    {/* Render the 9 White Banners from back to front to create a V-shaped or circular depth */}
    {/* Outer-most Back (Left and Right) */}
    <use href="#tug-banner" transform="translate(20, 95) scale(0.55)" />
    <use href="#tug-banner" transform="translate(180, 95) scale(0.55)" />
    
    {/* Mid-Outer Back */}
    <use href="#tug-banner" transform="translate(42, 80) scale(0.65)" />
    <use href="#tug-banner" transform="translate(158, 80) scale(0.65)" />

    {/* Mid-Inner Front */}
    <use href="#tug-banner" transform="translate(64, 65) scale(0.75)" />
    <use href="#tug-banner" transform="translate(136, 65) scale(0.75)" />

    {/* Inner Front */}
    <use href="#tug-banner" transform="translate(85, 45) scale(0.85)" />
    <use href="#tug-banner" transform="translate(115, 45) scale(0.85)" />

    {/* The Main Center Great Banner */}
    <use href="#tug-banner" transform="translate(100, 20) scale(1)" />
    
    {/* Decorative Stone/Metal Stand for the Center Banner */}
    <path d="M 80 260 Q 100 250 120 260 L 130 275 Q 100 290 70 275 Z" fill={color} opacity="0.8" />
    <path d="M 70 275 Q 100 290 130 275 L 125 295 Q 100 310 75 295 Z" fill={color} />
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
