import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DioramaStage from '../components/diorama/DioramaStage';
import { MoodPicker } from '../components/diorama/MoodPicker';
import { Overlay } from '../components/diorama/Overlay';
import { AudioSetup } from '../components/diorama/AudioSetup';
import { Mood } from '../components/diorama/atmosphere/moods';
import { Loader } from 'lucide-react';

export default function EasterEgg() {
  const { t } = useTranslation();
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>('sunset');

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50">
            <Loader className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-amber-800 font-medium font-serif">{t('diorama.loading')}</p>
          </div>
        }
      >
        <DioramaStage mood={mood} onSelect={setActivePopup} shadowSize={2048}>
          <AudioSetup />
        </DioramaStage>
      </Suspense>

      <Overlay activePopup={activePopup} onClose={() => setActivePopup(null)} />

      <MoodPicker mood={mood} onChange={setMood} className="absolute top-36 right-6 z-10" />

      <div className="absolute bottom-6 left-6 text-slate-800 text-sm font-serif pointer-events-none drop-shadow-md bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
        {t('diorama.instructions')}
      </div>
    </div>
  );
}
