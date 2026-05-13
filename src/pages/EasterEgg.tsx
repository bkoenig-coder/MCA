import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls, Sky, BakeShadows, Preload, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { DioramaScene } from '../components/diorama/DioramaScene';
import { Overlay } from '../components/diorama/Overlay';
import { AudioSetup } from '../components/diorama/AudioSetup';
import { Loader } from 'lucide-react';

export default function EasterEgg() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [dpr, setDpr] = useState(1);

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50">
          <Loader className="w-12 h-12 text-amber-600 animate-spin mb-4" />
          <p className="text-amber-800 font-medium font-serif">Loading the Steppe...</p>
        </div>
      }>
        <Canvas 
          shadows 
          dpr={dpr} 
          performance={{ min: 0.1 }}
          camera={{ position: [25, 20, 25], fov: 45 }}
          gl={{ powerPreference: "high-performance", antialias: false }}
        >
          <PerformanceMonitor onIncline={() => setDpr(1.2)} onDecline={() => setDpr(0.5)} />
          <AudioSetup />
          <color attach="background" args={['#d88c5e']} />
          <fog attach="fog" args={['#d88c5e', 20, 85]} />
          
          {/* Dimmer ambient and directional lights for moody atmosphere */}
          <ambientLight intensity={0.2} />
          <directionalLight
            castShadow
            position={[25, 20, 15]}
            intensity={0.6}
            color="#ffd0aa"
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-bias={-0.0005}
          />
          
          <DioramaScene onSelect={setActivePopup} />
          
          <MapControls 
            makeDefault 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2.5} 
            minDistance={5}
            maxDistance={60}
            target={[0, 0, 0]}
          />

          <BakeShadows />
          <Preload all />
          <AdaptiveEvents />
        </Canvas>
      </Suspense>

      <Overlay activePopup={activePopup} onClose={() => setActivePopup(null)} />
      
      <div className="absolute bottom-6 left-6 text-slate-800 text-sm font-serif pointer-events-none drop-shadow-md bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
