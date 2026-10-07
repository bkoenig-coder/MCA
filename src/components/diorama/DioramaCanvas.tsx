import { useState } from 'react';
import DioramaStage from './DioramaStage';
import { MoodPicker } from './MoodPicker';
import { Mood } from './atmosphere/moods';

/** The 3D steppe settlement for the Heritage page. Kept in its own file so the heavy 3D code loads only when needed. */
export default function DioramaCanvas({ onSelect }: { onSelect: (id: string | null) => void }) {
  const [mood, setMood] = useState<Mood>('sunset');
  return (
    <>
      <DioramaStage mood={mood} onSelect={onSelect} shadowSize={1024} />
      <MoodPicker mood={mood} onChange={setMood} className="absolute top-4 right-4 z-10" />
    </>
  );
}
