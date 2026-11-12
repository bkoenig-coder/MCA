export type CloudVariant = 'a' | 'b' | 'c';
export type CloudTone = 'blue' | 'deep' | 'gold' | 'coral';

const TONES: Record<CloudTone, string> = {
  blue: 'text-brand-blue',
  deep: 'text-brand-blue',
  gold: 'text-brand-gold',
  coral: 'text-brand-door',
};

/**
 * Üülen khee, the cloud ornament: a flat base with curling lobes, drawn as one weight of line
 * the way it is painted on furniture and stitched on a deel. It does not move.
 * (`variant` and `sparkles` are accepted for older call sites; every cloud is the same motif.)
 */
export const CuteCloud = ({
  tone = 'blue',
  className = 'w-48 h-auto',
}: {
  variant?: CloudVariant;
  tone?: CloudTone;
  className?: string;
  sparkles?: boolean;
}) => (
  <svg
    viewBox="0 0 220 90"
    className={`${TONES[tone]} ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* base line with a tail that curls up at each end */}
    <path d="M6 74C6 66 14 64 18 68C21 71 17 76 13 74" />
    <path d="M18 78H202" />
    <path d="M214 74C214 66 206 64 202 68C199 71 203 76 207 74" />
    {/* left lobe */}
    <path d="M30 78C24 56 44 40 62 50C74 57 70 74 58 72C49 70 50 60 58 60" />
    {/* centre lobe, the largest */}
    <path d="M72 78C66 42 98 18 128 30C148 38 148 64 130 64C116 64 114 48 126 46C134 45 138 52 133 56" />
    {/* right lobe */}
    <path d="M150 78C150 57 172 44 188 54C198 60 194 74 183 72C175 70 176 61 184 61" />
  </svg>
);

/** A cloud ornament placed in a corner of a section. Kept for older call sites; it stays still. */
export const CloudDrift = ({
  className = '',
  tone = 'blue',
}: {
  className?: string;
  delay?: number;
  duration?: number;
  tone?: CloudTone;
  variant?: CloudVariant;
}) => (
  <div aria-hidden="true" className={`absolute pointer-events-none ${className}`}>
    <CuteCloud tone={tone} className="w-full h-auto" />
  </div>
);
