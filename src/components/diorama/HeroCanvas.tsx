import { Canvas } from '@react-three/fiber';
import { DioramaScene } from './DioramaScene';

export default function HeroCanvas() {
  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]} 
      camera={{ position: [15, 15, 15], fov: 45 }}
      gl={{ powerPreference: "high-performance", antialias: false }}
    >
      <fog attach="fog" args={['#0A1128', 15, 45]} />
      <ambientLight intensity={0.15} />
      <directionalLight
        castShadow
        position={[10, 5, 10]}
        intensity={0.5}
        color="#ffcfaa"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <DioramaScene onSelect={() => {}} hideLabels={true} />
    </Canvas>
  );
}
