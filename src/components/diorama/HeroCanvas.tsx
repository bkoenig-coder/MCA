import { Canvas } from '@react-three/fiber';
import { DioramaScene } from './DioramaScene';
import { BakeShadows, Preload, AdaptiveEvents, PerformanceMonitor, OrbitControls } from '@react-three/drei';
import { useState } from 'react';

export default function HeroCanvas() {
  const [dpr, setDpr] = useState(1);
  return (
    <Canvas 
      shadows 
      dpr={dpr} 
      performance={{ min: 0.1 }}
      camera={{ position: [0, 38, 1], fov: 45 }}
      gl={{ powerPreference: "high-performance", antialias: false }}
      style={{ pointerEvents: 'none', touchAction: 'auto' }}
    >
      <color attach="background" args={['#0f1a2c']} />
      <PerformanceMonitor onIncline={() => setDpr(1.2)} onDecline={() => setDpr(0.5)} />
      <fog attach="fog" args={['#0f1a2c', 20, 75]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[25, 20, 15]}
        intensity={1.0}
        color="#fff9e6"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />
      <DioramaScene onSelect={() => {}} hideLabels={true} />
      <OrbitControls 
         autoRotate 
         autoRotateSpeed={0.5} 
         enableZoom={false} 
         enablePan={false}
         enableRotate={false} 
         maxPolarAngle={Math.PI / 2.2} 
         minPolarAngle={0}
      />
      <BakeShadows />
      <Preload all />
      <AdaptiveEvents />
    </Canvas>
  );
}

