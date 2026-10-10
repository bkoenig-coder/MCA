import { Gamepad2, Trophy, Users, Timer, Trash2 } from 'lucide-react';

export interface GameScoreRow {
  id: string;
  name: string;
  score: number;
  when: Date | null;
}

export interface GameEventRow {
  event: 'start' | 'end';
  score?: number;
  seconds?: number;
  character?: string;
  lang?: string;
  quality?: number;
  when: Date | null;
}

const CHARACTERS: Record<string, string> = { herder: 'Herder', khan: 'Khan', warrior: 'Warrior', queen: 'Queen' };
const LANGUAGES: Record<string, string> = { en: 'English', de: 'German', mn: 'Mongolian', tr: 'Turkish' };
const card = 'bg-white p-6 rounded-3xl border border-slate-200 shadow-sm';

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString([], { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

function Bars({ rows, label }: { rows: [string, number][]; label: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="space-y-3">
      {rows.length === 0 && <p className="text-sm text-slate-400 italic">No plays recorded yet.</p>}
      {rows.map(([k, n]) => (
        <div key={k}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700">{label(k)}</span>
            <span className="text-slate-500">{n}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-brand-gold" style={{ width: `${(n / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function countBy(rows: GameEventRow[], key: 'character' | 'lang'): [string, number][] {
  const out: Record<string, number> = {};
  rows.forEach((r) => {
    const k = r[key] || 'unknown';
    out[k] = (out[k] || 0) + 1;
  });
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

/** Admin view of the Steppe Runner game: leaderboard (with delete), plays and who plays what. */
export default function GameStats({ scores, events, onDelete }: { scores: GameScoreRow[]; events: GameEventRow[]; onDelete: (id: string) => void }) {
  const starts = events.filter((e) => e.event === 'start');
  const ends = events.filter((e) => e.event === 'end');
  const best = scores.reduce((m, s) => Math.max(m, s.score), 0);
  const avgScore = ends.length ? Math.round(ends.reduce((s, e) => s + (e.score || 0), 0) / ends.length) : 0;
  const avgSeconds = ends.length ? Math.round(ends.reduce((s, e) => s + (e.seconds || 0), 0) / ends.length) : 0;
  const players = new Set(scores.map((s) => s.name.trim().toLowerCase())).size;
  const byCharacter = countBy(starts, 'character');
  const byLang = countBy(starts, 'lang');

  const perDay: Record<string, number> = {};
  starts.forEach((s) => {
    if (!s.when) return;
    const k = s.when.toISOString().slice(0, 10);
    perDay[k] = (perDay[k] || 0) + 1;
  });
  const days = Object.entries(perDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
  const maxDay = Math.max(1, ...days.map((d) => d[1]));

  const kpis = [
    { label: 'Plays', value: starts.length, icon: <Gamepad2 className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Players (saved scores)', value: players, icon: <Users className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Best score', value: best, icon: <Trophy className="text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Average score', value: avgScore, icon: <Trophy className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Average run', value: `${avgSeconds}s`, icon: <Timer className="text-rose-600" />, bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={card}>
            <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center mb-3`}>{k.icon}</div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{k.label}</p>
            <h3 className="text-2xl font-serif font-bold text-slate-900">{k.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={card}>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Riders chosen</h3>
          <Bars rows={byCharacter} label={(k) => CHARACTERS[k] || k} />
        </div>
        <div className={card}>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Language of players</h3>
          <Bars rows={byLang} label={(k) => LANGUAGES[k] || k} />
        </div>
        <div className={card}>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Plays per day</h3>
          {days.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No plays recorded yet.</p>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {days.map(([d, n]) => (
                <div key={d} className="flex-1 flex flex-col items-center justify-end gap-1 h-full" title={`${d}: ${n}`}>
                  <span className="text-[10px] text-slate-500">{n}</span>
                  <div className="w-full rounded-t bg-slate-800" style={{ height: `${(n / maxDay) * 70}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-slate-400">{d.slice(8)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-slate-900">Hall of Heroes</h3>
          <span className="text-xs text-slate-500">{scores.length} saved scores</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                <th className="py-2 pr-3 w-12">#</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Saved</th>
                <th className="py-2 w-12" />
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">No scores saved yet.</td>
                </tr>
              )}
              {scores.map((s, i) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-3 font-serif text-slate-500">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-2.5 pr-3 font-mono text-slate-800">{s.score}</td>
                  <td className="py-2.5 pr-3 text-slate-500">{fmtDate(s.when)}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onDelete(s.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete score of ${s.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">Plays, riders and languages are counted from the latest 1,000 recorded events.</p>
      </div>
    </div>
  );
}
