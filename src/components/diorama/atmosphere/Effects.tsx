import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, SMAA, TiltShift2, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { MOODS, Mood } from './moods';

/** Film-like finish: glow on flames and gold, soft edges, gentle depth blur and a filmic colour curve. */
export function Effects({ mood, quality = 'high' }: { mood: Mood; quality?: 'high' | 'low' }) {
  const bloomRef = useRef<any>(null);

  useFrame((_, delta) => {
    const b = bloomRef.current;
    if (!b) return;
    const target = MOODS[mood].bloom;
    b.intensity += (target - b.intensity) * (1 - Math.exp(-delta * 2.4));
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom ref={bloomRef} intensity={MOODS[mood].bloom} luminanceThreshold={0.82} luminanceSmoothing={0.25} mipmapBlur radius={0.7} />
      <Vignette offset={0.28} darkness={0.55} />
      {quality === 'high' ? <TiltShift2 blur={0.07} taper={0.6} /> : <></>}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {quality === 'high' ? <SMAA /> : <></>}
    </EffectComposer>
  );
}
