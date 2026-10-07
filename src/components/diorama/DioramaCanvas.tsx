import { Canvas } from '@react-three/fiber';
import { MapControls, BakeShadows, Preload } from '@react-three/drei';
import { DioramaScene } from './DioramaScene';

/** The 3D steppe settlement. Kept in its own file so the heavy 3D code loads only when it is needed. */
export default function DioramaCanvas({ onSelect }: { onSelect: (id: string | null) => void }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 32, 12], fov: 45 }} gl={{ powerPreference: 'high-performance', antialias: false }}>
      <color attach="background" args={['#E8EEF5']} />
      <fog attach="fog" args={['#E8EEF5', 30, 95]} />

      <ambientLight intensity={0.9} />
      <directionalLight castShadow position={[25, 25, 15]} intensity={1.4} color="#fffdf5" shadow-mapSize={[512, 512]} />

      <DioramaScene onSelect={onSelect} />

      <MapControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} minDistance={8} maxDistance={50} target={[0, 0, 0]} />

      <BakeShadows />
      <Preload all />
    </Canvas>
  );
}
