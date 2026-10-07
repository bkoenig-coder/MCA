import { Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MOOD_LIST, Mood } from './atmosphere/moods';

const ICONS = { dawn: Sunrise, day: Sun, sunset: Sunset, night: Moon };

/** Time-of-day switch shown on top of the 3D scene. */
export function MoodPicker({ mood, onChange, className = '' }: { mood: Mood; onChange: (m: Mood) => void; className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center gap-1 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg ${className}`} role="radiogroup">
      {MOOD_LIST.map((m) => {
        const Icon = ICONS[m];
        const active = m === mood;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            title={t(`siteUi.diorama.mood.${m}`)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              active ? 'bg-white text-slate-900' : 'text-white/85 hover:bg-white/15'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{t(`siteUi.diorama.mood.${m}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
