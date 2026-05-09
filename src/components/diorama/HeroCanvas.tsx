import { Canvas } from '@react-three/fiber';
import { DioramaScene } from './DioramaScene';
import { BakeShadows, Preload, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useState } from 'react';

export default function HeroCanvas() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas 
      shadows 
      dpr={dpr} 
      performance={{ min: 0.5 }}
      camera={{ position: [10, 10, 10], fov: 45 }}
      gl={{ powerPreference: "high-performance", antialias: false }}
    >
      <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
      <fog attach="fog" args={['#0A1128', 15, 45]} />
      <ambientLight intensity={0.15} />
      <directionalLight
        castShadow
        position={[10, 5, 10]}
        intensity={0.5}
        color="#ffcfaa"
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <DioramaScene onSelect={() => {}} hideLabels={true} />
      <BakeShadows />
      <Preload all />
      <AdaptiveEvents />
    </Canvas>
  );
}
