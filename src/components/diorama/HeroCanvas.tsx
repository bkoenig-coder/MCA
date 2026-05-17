import { Canvas } from '@react-three/fiber';
import { DioramaScene } from './DioramaScene';
import { BakeShadows, Preload, AdaptiveEvents, PerformanceMonitor, OrbitControls, Stars } from '@react-three/drei';
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
      <color attach="background" args={['#050B14']} />
      <PerformanceMonitor onIncline={() => setDpr(1.2)} onDecline={() => setDpr(0.5)} />
      <fog attach="fog" args={['#050B14', 15, 65]} />
      
      {/* Luxury Night Sky Elements */}
      <Stars radius={50} depth={50} count={3500} factor={3} saturation={0} fade speed={1.5} />
      
      {/* Elegant Night Lighting Setup */}
      <ambientLight intensity={0.15} color="#8ca4d8" />
      
      {/* Primary Moon Light */}
      <directionalLight
        castShadow
        position={[-25, 30, -15]}
        intensity={1.2}
        color="#a2bcfc"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />
      
      {/* Golden accent/rim light for elegance */}
      <directionalLight
        position={[25, 5, 25]}
        intensity={0.8}
        color="#d4af37"
      />
      
      <DioramaScene onSelect={() => {}} hideLabels={true} />
      <OrbitControls 
         autoRotate 
         autoRotateSpeed={0.3} 
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

