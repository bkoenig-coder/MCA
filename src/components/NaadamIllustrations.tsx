import React from 'react';

/**
 * Flat illustrations of the Three Manly Games of Naadam (Eriin gurvan naadam):
 * wrestling (bokh), archery (sur kharvaa) and horse racing (morin uraldaan).
 * Each is drawn in a 160x160 round medallion with a gold rim, in the same style as the waving boy.
 */

const skin = '#E8B58C';
const ink = '#15161B';
const gold = '#D4AF37';
const cream = '#F6EEDC';
const red = '#D6283A';
const blue = '#3C8FE0';
const horse = '#9A5232';
const horseDark = '#6E361C';

function Medallion({ id, children, label }: { id: string; children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full" role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx="80" cy="80" r="73" />
        </clipPath>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#0E4C8E" />
          <stop offset="100%" stopColor="#06284F" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="78" fill={gold} />
      <circle cx="80" cy="80" r="75" fill={`url(#bg-${id})`} />
      <g clipPath={`url(#clip-${id})`}>{children}</g>
      <circle cx="80" cy="80" r="70" fill="none" stroke={gold} strokeWidth="1" strokeOpacity="0.55" />
    </svg>
  );
}

/** Bokh: a wrestler in the eagle dance, arms spread, in the traditional zodog vest and shuudag briefs. */
export function WrestlerMedallion() {
  return (
    <Medallion id="bokh" label="A Mongolian wrestler performing the eagle dance">
      {/* ground */}
      <ellipse cx="80" cy="150" rx="56" ry="7" fill="#000" opacity="0.2" />
      {/* legs */}
      <path d="M64 104 L48 138 L58 142 L76 112 Z" fill={skin} />
      <path d="M96 104 L112 138 L102 142 L84 112 Z" fill={skin} />
      {/* boots (gutal) with upturned toes */}
      <path d="M42 135 L60 139 L62 148 L34 148 Q28 148 33 142 Z" fill={ink} />
      <path d="M118 135 L100 139 L98 148 L126 148 Q132 148 127 142 Z" fill={ink} />
      <path d="M44 143 H60 M100 143 H116" stroke={gold} strokeWidth="2" strokeLinecap="round" />
      {/* shuudag briefs */}
      <path d="M62 92 L98 92 L104 112 L56 112 Z" fill={blue} />
      <path d="M56 112 L104 112" stroke={gold} strokeWidth="2.5" />
      {/* arms spread like an eagle */}
      <path d="M58 50 L20 62 L16 73 L60 69 Z" fill={skin} />
      <path d="M102 50 L140 62 L144 73 L100 69 Z" fill={skin} />
      <circle cx="16" cy="68" r="6.5" fill={skin} />
      <circle cx="144" cy="68" r="6.5" fill={skin} />
      {/* zodog vest */}
      <path d="M58 50 L102 50 L98 94 L62 94 Z" fill={red} />
      <path d="M58 50 L42 55 L45 69 L60 69 Z" fill={red} />
      <path d="M102 50 L118 55 L115 69 L100 69 Z" fill={red} />
      <path d="M72 50 L88 50 L80 82 Z" fill={skin} />
      <path d="M62 94 H98" stroke={gold} strokeWidth="2.5" />
      {/* head */}
      <circle cx="80" cy="33" r="12" fill={skin} />
      <path d="M68 31 Q70 18 80 18 Q90 18 92 31 Q86 25 80 25 Q74 25 68 31 Z" fill={ink} />
      <circle cx="75.5" cy="35" r="1.4" fill={ink} />
      <circle cx="84.5" cy="35" r="1.4" fill={ink} />
      <path d="M76 40 Q80 43 84 40" fill="none" stroke="#7A3B2E" strokeWidth="1.5" strokeLinecap="round" />
    </Medallion>
  );
}

/** Sur kharvaa: an archer in a deel drawing a traditional bow. */
export function ArcherMedallion() {
  return (
    <Medallion id="sur" label="A Mongolian archer drawing a bow">
      <ellipse cx="78" cy="150" rx="56" ry="7" fill="#000" opacity="0.2" />
      {/* legs and boots */}
      <path d="M62 120 L62 142 L72 142 L72 120 Z" fill="#7A4A2A" />
      <path d="M78 120 L78 142 L88 142 L88 120 Z" fill="#7A4A2A" />
      <path d="M58 140 L74 140 L74 148 L52 148 Q47 148 52 143 Z" fill={ink} />
      <path d="M78 140 L94 140 Q99 143 96 148 L76 148 Z" fill={ink} />
      {/* deel */}
      <path d="M60 56 L88 56 L92 100 L96 128 L54 128 L58 100 Z" fill={gold} />
      <path d="M54 128 L96 128" stroke="#AA7C11" strokeWidth="3" />
      <path d="M72 56 L82 74 L90 98" fill="none" stroke="#AA7C11" strokeWidth="2.2" strokeLinecap="round" />
      {/* red sash */}
      <path d="M58 88 L92 88 L92 98 L58 98 Z" fill={red} />
      {/* head and cap */}
      <circle cx="74" cy="42" r="11" fill={skin} />
      <path d="M62 38 Q64 28 74 28 Q84 28 86 38 Z" fill={blue} />
      <path d="M74 12 L66 30 L82 30 Z" fill={blue} />
      <circle cx="74" cy="11" r="2.4" fill={gold} />
      <path d="M62 38 H86" stroke={gold} strokeWidth="2" />
      <circle cx="78" cy="44" r="1.3" fill={ink} />
      <path d="M77 49 Q81 50 83 48" fill="none" stroke="#7A3B2E" strokeWidth="1.4" strokeLinecap="round" />
      {/* bow arm stretched forward, string arm bent back */}
      <path d="M82 62 L130 63 L130 70 L82 71 Z" fill={gold} />
      <circle cx="132" cy="66" r="5" fill={skin} />
      <path d="M82 64 L58 56 L56 64 L84 72 Z" fill={gold} />
      <circle cx="56" cy="60" r="4.6" fill={skin} />
      {/* bow, string and arrow */}
      <path d="M136 22 C162 50 162 84 136 112" fill="none" stroke={cream} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M136 22 L90 66 L136 112" fill="none" stroke={cream} strokeWidth="1.4" />
      <path d="M90 66 L150 66" stroke={cream} strokeWidth="2" strokeLinecap="round" />
      <path d="M150 66 L141 61.5 L141 70.5 Z" fill={red} />
      <path d="M92 66 L98 62 M92 66 L98 70 M97 66 L103 62 M97 66 L103 70" stroke={red} strokeWidth="1.6" strokeLinecap="round" />
    </Medallion>
  );
}

/** Morin uraldaan: a young jockey racing across the steppe at full gallop. */
export function HorseRacerMedallion() {
  return (
    <Medallion id="morin" label="A young jockey racing a galloping horse">
      {/* steppe line and sky hint */}
      <path d="M0 126 Q80 116 160 126 L160 160 L0 160 Z" fill="#0A3A6E" />
      <path d="M0 126 Q80 116 160 126" fill="none" stroke={gold} strokeOpacity="0.45" strokeWidth="1.2" />
      {/* dust */}
      <ellipse cx="34" cy="128" rx="14" ry="4" fill={cream} opacity="0.25" />
      <ellipse cx="22" cy="124" rx="9" ry="3" fill={cream} opacity="0.18" />

      <g transform="translate(-9 30) scale(0.74)">
        {/* tail */}
        <path d="M54 68 C34 60 18 70 4 90 C22 84 36 86 56 82 Z" fill={horseDark} />
        {/* hind legs stretched back */}
        <path d="M64 86 L28 112 L34 122 L74 98 Z" fill={horse} />
        <path d="M78 92 L50 124 L58 132 L88 102 Z" fill={horse} />
        <path d="M24 111 L38 123 L32 128 L20 117 Z" fill={ink} />
        <path d="M46 123 L60 133 L54 138 L42 128 Z" fill={ink} />
        {/* front legs stretched forward */}
        <path d="M134 90 L170 108 L166 120 L126 100 Z" fill={horse} />
        <path d="M122 94 L152 124 L144 132 L114 102 Z" fill={horse} />
        <path d="M164 106 L176 114 L170 122 L160 114 Z" fill={ink} />
        <path d="M146 123 L156 132 L148 138 L140 130 Z" fill={ink} />
        {/* body */}
        <path d="M52 72 C52 56 80 50 108 52 C128 53 140 60 142 74 C143 88 126 98 104 98 C76 98 52 92 52 72 Z" fill={horse} />
        {/* neck and head */}
        <path d="M128 60 C138 44 150 34 162 30 L174 46 C164 54 156 68 146 84 Z" fill={horse} />
        <path d="M160 28 L190 40 C195 44 192 51 186 52 L172 48 C164 50 158 45 156 38 Z" fill={horse} />
        <path d="M158 30 L160 20 L166 30 Z" fill={horseDark} />
        <circle cx="173" cy="40" r="1.8" fill={ink} />
        {/* mane */}
        <path d="M128 58 C138 44 148 34 160 28 L162 36 C152 42 142 52 134 66 Z" fill={horseDark} />
        {/* saddle cloth */}
        <path d="M92 52 L116 54 L114 66 L92 64 Z" fill={red} />
        {/* jockey leaning forward */}
        <path d="M98 52 L124 34 L132 42 L106 64 Z" fill={blue} />
        <path d="M96 62 L86 80 L98 82 L108 66 Z" fill={blue} />
        <path d="M82 80 L100 84 L98 90 L80 86 Z" fill={ink} />
        <path d="M124 38 L146 50 L144 56 L122 44 Z" fill={blue} />
        <circle cx="147" cy="53" r="4.4" fill={skin} />
        <circle cx="133" cy="28" r="9.5" fill={skin} />
        <path d="M124 26 Q126 16 134 16 Q142 16 142 26 Z" fill={red} />
        <path d="M133 2 L125 18 L141 18 Z" fill={red} />
        <circle cx="133" cy="1.5" r="2.4" fill={gold} />
        <circle cx="137" cy="30" r="1.3" fill={ink} />
        {/* reins */}
        <path d="M147 53 L170 44" fill="none" stroke={cream} strokeWidth="1.4" />
      </g>
    </Medallion>
  );
}

/** The three medallions in a row, with their Mongolian names. */
export default function NaadamMedallions({ className = '' }: { className?: string }) {
  const items = [
    { Art: WrestlerMedallion, label: 'Бөх' },
    { Art: ArcherMedallion, label: 'Сур харваа' },
    { Art: HorseRacerMedallion, label: 'Морин уралдаан' },
  ];
  return (
    <div className={`flex items-start justify-center gap-5 sm:gap-8 md:gap-12 ${className}`}>
      {items.map(({ Art, label }) => (
        <div key={label} className="flex flex-col items-center gap-[1vh]">
          <div className="w-[clamp(52px,min(20vw,14vh),128px)] h-[clamp(52px,min(20vw,14vh),128px)] drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
            <Art />
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.16em] text-brand-gold/90 font-medium whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  );
}
