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
  <svg viewBox="0 0 100 150" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    {/* Flame */}
    <path d="M50 0C55 10 60 15 60 25C60 35 50 45 50 45C50 45 40 35 40 25C40 15 45 10 50 0Z" />
    {/* Sun and Moon */}
    <circle cx="50" cy="55" r="10" />
    <path d="M40 70C40 70 45 75 50 75C55 75 60 70 60 70C60 70 55 80 50 80C45 80 40 70 40 70Z" />
    {/* Triangles and Rectangles */}
    <rect x="20" y="85" width="60" height="5" />
    <path d="M20 95L50 110L80 95V100L50 115L20 100V95Z" />
    <rect x="20" y="120" width="25" height="30" />
    <rect x="55" y="120" width="25" height="30" />
    <rect x="20" y="155" width="60" height="5" />
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
