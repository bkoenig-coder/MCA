import { ReactNode, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveEvents, MapControls, PerformanceMonitor, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { DioramaScene } from './DioramaScene';
import { Atmosphere } from './atmosphere/Atmosphere';
import { CloudSea } from './atmosphere/CloudSea';
import { Effects } from './atmosphere/Effects';
import { CameraIntro } from './atmosphere/CameraIntro';
import { Mood } from './atmosphere/moods';

/**
 * The whole 3D steppe world in one place: sky and light, the floating islands, a sea of cloud,
 * film-style effects and camera controls. Used by the full-screen page and by the Heritage page.
 */
export default function DioramaStage({
  mood,
  onSelect,
  hideLabels,
  children,
  shadowSize = 2048,
  intro = true,
}: {
  mood: Mood;
  onSelect: (id: string) => void;
  hideLabels?: boolean;
  children?: ReactNode;
  shadowSize?: number;
  intro?: boolean;
}) {
  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  const [dpr, setDpr] = useState(coarse ? 1 : 1.25);
  const [quality, setQuality] = useState<'high' | 'low'>(coarse ? 'low' : 'high');

  return (
    <Canvas
      shadows
      dpr={dpr}
      performance={{ min: 0.3 }}
      camera={{ position: intro ? [78, 84, 126] : [0, 42, 58], fov: 42, near: 0.5, far: 1600 }}
      gl={{ powerPreference: 'high-performance', antialias: false, toneMapping: THREE.NoToneMapping }}
    >
      <PerformanceMonitor
        onIncline={() => {
          setDpr(1.5);
          setQuality('high');
        }}
        onDecline={() => {
          setDpr(0.85);
          setQuality('low');
        }}
      />
      <Suspense fallback={null}>
        <Atmosphere mood={mood} shadowSize={shadowSize} />
        <DioramaScene onSelect={onSelect} hideLabels={hideLabels} mood={mood} />
        <CloudSea mood={mood} />
        <Effects mood={mood} quality={quality} />
        {children}
        <Preload all />
      </Suspense>

      <MapControls makeDefault enableDamping dampingFactor={0.08} minPolarAngle={0.15} maxPolarAngle={Math.PI / 2.3} minDistance={6} maxDistance={70} target={[0, 0, 0]} />
      {intro && <CameraIntro />}
      <AdaptiveEvents />
    </Canvas>
  );
}
