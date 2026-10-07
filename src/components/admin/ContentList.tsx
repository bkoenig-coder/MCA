import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, ExternalLink, Plus, Search, Trash2 } from 'lucide-react';

export type LangState = 'ok' | 'copy' | 'missing';

export interface ContentRow {
  id: string;
  title: string;
  thumb?: string;
  meta: ReactNode;
  secondary?: ReactNode;
  href?: string;
  /** state of each language: ok = written, copy = text still in another language, missing = empty */
  langs: { mn: LangState; en: LangState; de: LangState; tr: LangState };
}

const CYRILLIC = /[Ѐ-ӿ]/;

/** ok if the language has its own text, copy if the field only holds Mongolian text, missing if empty. */
export function langState(lang: 'mn' | 'en' | 'de' | 'tr', text?: string): LangState {
  const t = (text || '').trim();
  if (!t) return 'missing';
  if (lang !== 'mn' && CYRILLIC.test(t)) return 'copy';
  return 'ok';
}

const chipStyle: Record<LangState, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  copy: 'bg-amber-50 text-amber-700 border-amber-200',
  missing: 'bg-slate-50 text-slate-400 border-slate-200',
};
const chipHint: Record<LangState, string> = {
  ok: 'written',
  copy: 'not translated yet (still shows Mongolian text)',
  missing: 'empty',
};

/** One tidy list for news, events and gallery: thumbnail, title, details, language status and actions. */
export default function ContentList({
  rows,
  search,
  onSearch,
  searchPlaceholder,
  newLabel,
  onNew,
  onEdit,
  onDelete,
  emptyText,
  Icon,
  showLangs = true,
}: {
  rows: ContentRow[];
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder: string;
  newLabel: string;
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyText: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  showLangs?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-200">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/25 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{rows.length} {rows.length === 1 ? 'item' : 'items'}</span>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Plus size={16} /> {newLabel}
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="py-16 text-center">
          <Icon size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">{emptyText}</p>
          <button onClick={onNew} className="mt-4 px-5 py-2.5 bg-[#0A1128] text-white rounded-xl text-sm font-semibold">
            {newLabel}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-[72px_1fr_auto] md:grid-cols-[104px_1fr_auto_auto] items-center gap-4 p-4 hover:bg-slate-50/70 transition-colors">
              <div className="w-[72px] md:w-[104px] aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {r.thumb ? <img src={r.thumb} alt="" loading="lazy" className="w-full h-full object-cover" /> : <Icon size={22} className="text-slate-300" />}
              </div>

              <div className="min-w-0">
                <p className="font-serif text-lg text-slate-900 leading-snug line-clamp-2">{r.title}</p>
                <p className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-0.5">{r.meta}</p>
                {r.secondary && <p className="mt-0.5 text-xs text-slate-400 truncate">{r.secondary}</p>}
              </div>

              {showLangs ? (
                <div className="hidden md:flex items-center gap-1" aria-label="Languages">
                  {(['mn', 'en', 'de', 'tr'] as const).map((l) => (
                    <span
                      key={l}
                      title={`${l.toUpperCase()}: ${chipHint[r.langs[l]]}`}
                      className={`w-8 text-center py-1 rounded-md border text-[11px] font-bold ${chipStyle[r.langs[l]]}`}
                    >
                      {l.toUpperCase()}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="hidden md:block" />
              )}

              <div className="flex items-center gap-1.5">
                {r.href && (
                  <Link to={r.href} title="View on the website" className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                    <ExternalLink size={16} />
                  </Link>
                )}
                <button onClick={() => onEdit(r.id)} title="Edit" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 hover:border-brand-gold hover:text-brand-gold cursor-pointer">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => onDelete(r.id)} title="Delete" className="p-2.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showLangs && rows.length > 0 && (
        <p className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          Language boxes: <span className="text-emerald-700 font-semibold">green</span> = written, <span className="text-amber-700 font-semibold">orange</span> = still Mongolian text (not translated), grey = empty.
        </p>
      )}
    </div>
  );
}
