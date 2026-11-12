import { cn } from '../lib/utils';

// Traditional (vertical) Mongolian script: "Mongol Töv" (Mongolian Center)
const SCRIPT = 'ᠮᠣᠩᠭᠣᠯ ᠲᠥᠪ';

/**
 * The centre's name in Mongol bichig, set the way a name board hangs beside a door:
 * white script on the blue of the logo, read from top to bottom, with the Cyrillic name under it.
 */
export default function ScriptPlaque({ className = '' }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Монгол Төв"
      className={cn(
        'relative flex shrink-0 flex-col items-center rounded-md bg-brand-blue text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
        'px-4 py-5 md:px-6 md:py-7 lg:px-8 lg:py-9',
        className
      )}
    >
      {/* the painted line a name board carries inside its edge */}
      <span aria-hidden="true" className="absolute inset-1.5 rounded-[3px] border border-white/30 pointer-events-none" />
      <span
        lang="mn-Mong"
        aria-hidden="true"
        className="select-none leading-[1.15] text-[34px] md:text-[56px] lg:text-[clamp(56px,8.5vh,88px)]"
        style={{ writingMode: 'vertical-lr', fontFamily: '"Noto Sans Mongolian", "Mongolian Baiti", serif' }}
      >
        {SCRIPT}
      </span>
      <span aria-hidden="true" className="hidden md:block mt-4 lg:mt-5 text-sm lg:text-[15px] text-white/85 whitespace-nowrap">
        Монгол Төв
      </span>
    </div>
  );
}
