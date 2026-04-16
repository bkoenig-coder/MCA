import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MapControls, Sky } from '@react-three/drei';
import { DioramaScene } from '../components/diorama/DioramaScene';
import { Overlay } from '../components/diorama/Overlay';
import { AudioSetup } from '../components/diorama/AudioSetup';
import { Loader } from 'lucide-react';

export default function EasterEgg() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <div className="w-full h-screen bg-sky-100 relative overflow-hidden">
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50 z-50">
          <Loader className="w-12 h-12 text-amber-600 animate-spin mb-4" />
          <p className="text-amber-800 font-medium font-serif">Loading the Steppe...</p>
        </div>
      }>
        <Canvas shadows camera={{ position: [15, 15, 15], fov: 45 }}>
          <AudioSetup />
          <color attach="background" args={['#87CEEB']} />
          <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[10, 20, 10]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          <DioramaScene onSelect={setActivePopup} />
          
          <MapControls 
            makeDefault 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2.5} 
            minDistance={10}
            maxDistance={40}
            target={[0, 0, 0]}
          />
        </Canvas>
      </Suspense>

      <Overlay activePopup={activePopup} onClose={() => setActivePopup(null)} />
      
      <div className="absolute bottom-6 left-6 text-slate-800 text-sm font-serif pointer-events-none drop-shadow-md bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
