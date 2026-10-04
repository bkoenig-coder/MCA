import React from 'react';
import { motion } from 'motion/react';
import { MAP_WIDTH, MAP_HEIGHT, VIENNA, ULAANBAATAR, DISTANCE_KM, LAND_DOTS } from '../data/eurasiaDots';

const VB = { x: -1, y: -8, w: MAP_WIDTH + 2, h: MAP_HEIGHT + 14 };

// Arc between the two cities, lifted so it reads as a bridge rather than a straight line.
const [vx, vy] = VIENNA;
const [ux, uy] = ULAANBAATAR;
const ARC = `M${vx} ${vy} Q${(vx + ux) / 2} ${Math.min(vy, uy) - (ux - vx) * 0.22} ${ux} ${uy}`;

const pct = (x: number, y: number) => ({
  left: `${((x - VB.x) / VB.w) * 100}%`,
  top: `${((y - VB.y) / VB.h) * 100}%`,
});

export const BRIDGE_DISTANCE_KM = DISTANCE_KM;

/** Dot-matrix map of Europe and Asia with an animated arc from Vienna to Ulaanbaatar. */
export default function BridgeMap({ viennaLabel = 'Vienna', ulaanbaatarLabel = 'Ulaanbaatar' }: { viennaLabel?: string; ulaanbaatarLabel?: string }) {
  return (
    <div
      className="relative w-full"
      role="img"
      aria-label={`${viennaLabel} to ${ulaanbaatarLabel}, about ${DISTANCE_KM.toLocaleString('en')} kilometres`}
    >
      <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="w-full h-auto" fill="none" aria-hidden="true">
        <path d={LAND_DOTS} stroke="currentColor" strokeWidth="0.55" strokeLinecap="round" className="text-brand-blue/25" />
        <motion.path
          d={ARC}
          className="stroke-brand-gold"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeDasharray="1.1 1.1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {[VIENNA, ULAANBAATAR].map(([x, y], i) => (
          <g key={i}>
            <motion.circle
              cx={x}
              cy={y}
              r="2.4"
              className="fill-brand-blue/20"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={{ scale: [0.7, 1.6, 0.7], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.6 }}
            />
            <circle cx={x} cy={y} r="1.4" className="fill-brand-blue stroke-white" strokeWidth="0.5" />
          </g>
        ))}
      </svg>
      <span
        className="absolute -translate-x-1/2 mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink whitespace-nowrap"
        style={pct(vx, vy)}
      >
        {viennaLabel}
      </span>
      <span
        className="absolute -translate-x-1/2 mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink whitespace-nowrap"
        style={pct(ux, uy)}
      >
        {ulaanbaatarLabel}
      </span>
    </div>
  );
}
