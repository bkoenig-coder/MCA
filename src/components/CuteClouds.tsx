import { motion } from 'motion/react';
import { CLOUD_SHAPES } from './cloudShapes';

export type CloudVariant = 'a' | 'b' | 'c';
export type CloudTone = 'blue' | 'deep' | 'gold' | 'coral';

const TONES: Record<CloudTone, { body: string; shade: string }> = {
  blue: { body: '#3C8FE0', shade: '#0E4C8E' },
  deep: { body: '#0E5AA8', shade: '#06284F' },
  gold: { body: '#E2BE52', shade: '#9A7410' },
  coral: { body: '#EE6A6E', shade: '#9C2330' },
};
const CREAM = '#F6EEDC';

/**
 * A soft, hand-drawn style cloud: a filled body with curling cream spirals and a trailing tail.
 * The spirals sway and the sparkles twinkle (CSS animations in index.css).
 */
export const CuteCloud = ({
  variant = 'a',
  tone = 'blue',
  className = 'w-48 h-auto',
  sparkles = true,
}: {
  variant?: CloudVariant;
  tone?: CloudTone;
  className?: string;
  sparkles?: boolean;
}) => {
  const shape = CLOUD_SHAPES[variant];
  const { body, shade } = TONES[tone];
  return (
    <svg viewBox="0 0 300 170" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Body: overlapping puffs give one soft silhouette */}
      <g fill={body}>
        {shape.circles.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
        <ellipse cx={shape.ellipse[0]} cy={shape.ellipse[1]} rx={shape.ellipse[2]} ry={shape.ellipse[3]} />
        {shape.tails.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {/* Shading dashes along the underside */}
      <path d={shape.dashes} fill="none" stroke={shade} strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      {/* Curling spirals */}
      <g fill="none" stroke={CREAM} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
        {shape.spirals.map((d, i) => (
          <path key={i} d={d} className="cloud-spiral" style={{ animationDelay: `${i * -2.2}s` }} />
        ))}
      </g>
      {sparkles && (
        <g fill={tone === 'gold' ? '#FFFFFF' : '#F6A65A'}>
          {shape.sparks.map((s, i) => (
            <path key={i} d={s.d} className="cloud-spark" style={{ animationDelay: `${s.delay}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
};

/** Decorative cloud that drifts slowly. Place inside a `relative overflow-hidden` section. */
export const CloudDrift = ({
  className = '',
  delay = 0,
  duration = 22,
  tone = 'blue',
  variant = 'a',
}: {
  className?: string;
  delay?: number;
  duration?: number;
  tone?: CloudTone;
  variant?: CloudVariant;
}) => (
  <motion.div
    aria-hidden="true"
    className={`absolute pointer-events-none ${className}`}
    animate={{ x: [0, 34, 0], y: [0, -8, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <CuteCloud variant={variant} tone={tone} className="w-full h-auto" />
  </motion.div>
);

const SKY: Array<{ v: CloudVariant; t: CloudTone; w: number; y: number }> = [
  { v: 'a', t: 'blue', w: 150, y: 14 },
  { v: 'c', t: 'deep', w: 110, y: 34 },
  { v: 'b', t: 'blue', w: 170, y: 6 },
  { v: 'a', t: 'gold', w: 120, y: 28 },
  { v: 'c', t: 'blue', w: 130, y: 10 },
  { v: 'b', t: 'deep', w: 140, y: 30 },
];

/** A slow strip of clouds crossing the sky. Fixed height, loops seamlessly. */
export const CloudSky = ({ className = '', duration = 90 }: { className?: string; duration?: number }) => {
  const row = (
    <div className="flex shrink-0 items-start gap-16 pr-16">
      {SKY.map((c, i) => (
        <div key={i} className="relative shrink-0" style={{ width: c.w, marginTop: c.y }}>
          <CuteCloud variant={c.v} tone={c.t} className="w-full h-auto" sparkles={i % 2 === 0} />
        </div>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      <motion.div className="flex w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration, repeat: Infinity, ease: 'linear' }}>
        {row}
        {row}
      </motion.div>
    </div>
  );
};
