export type LangId = 'mn' | 'en' | 'de' | 'tr';

export const LANGS: Array<{ id: LangId; label: string; suffix: 'Mn' | 'En' | 'De' | 'Tr' }> = [
  { id: 'mn', label: 'Монгол', suffix: 'Mn' },
  { id: 'en', label: 'English', suffix: 'En' },
  { id: 'de', label: 'Deutsch', suffix: 'De' },
  { id: 'tr', label: 'Türkçe', suffix: 'Tr' },
];

/** Language switcher for the editors. A ✓ shows which languages already have text. */
export default function LangTabs<T extends LangId>({
  value,
  onChange,
  done,
  order = ['mn', 'en', 'de', 'tr'],
}: {
  value: T;
  onChange: (l: T) => void;
  done: Partial<Record<LangId, boolean>>;
  order?: LangId[];
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1">Language</span>
      {order.map((id) => {
        const l = LANGS.find((x) => x.id === id)!;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id as T)}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              value === id ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            {l.label} {done[id] ? '✓' : ''}
          </button>
        );
      })}
    </div>
  );
}
