import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { db, collection, query, orderBy, limit, onSnapshot } from '../../firebase';

interface Row {
  id: string;
  name: string;
  score: number;
}

/** The leaderboard on the game page: always visible, loaded from the database. */
export default function HallOfHeroes() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'game_scores'), orderBy('score', 'desc'), limit(10));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFailed(false);
        setRows(
          snapshot.docs.map((d: any) => {
            const data = d.data();
            return { id: d.id, name: String(data.player_name ?? data.name ?? '?'), score: Number(data.score) || 0 };
          })
        );
      },
      (error) => {
        console.error('Could not load the Hall of Heroes:', error);
        setFailed(true);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 rounded-3xl border border-brand-gold/30 bg-brand-ink text-white p-6 md:p-8 shadow-[0_20px_60px_-25px_rgba(10,17,40,0.6)]">
      <h2 className="text-2xl font-serif text-brand-gold text-center flex items-center justify-center gap-3 mb-6">
        <Trophy size={20} />
        {t('heritagePage.runner.hall')}
      </h2>
      {failed ? (
        <p className="text-center text-sm text-red-300">{t('heritagePage.runner.loadError')}</p>
      ) : rows === null ? (
        <p className="text-center text-sm text-white/50">…</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-sm text-white/60 italic">{t('heritagePage.runner.noHeroes')}</p>
      ) : (
        <ol className="space-y-2.5">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="flex items-center gap-4 min-w-0">
                <span className={`w-6 text-center font-serif ${i === 0 ? 'text-2xl text-brand-gold' : i === 1 ? 'text-xl text-gray-300' : i === 2 ? 'text-lg text-amber-600' : 'text-white/50'}`}>{i + 1}</span>
                <span className="font-medium truncate">{r.name}</span>
              </span>
              <span className="font-mono text-sm text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
