import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GerCamp } from './vignettes/GerCamp';
import { PlayZone } from './vignettes/PlayZone';
import { HerdingZone } from './vignettes/HerdingZone';
import { TrainingZone } from './vignettes/TrainingZone';

interface DioramaSceneProps {
  onSelect: (id: string) => void;
}

function InstancedGrass() {
  const count = 2000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      // Simple wind sway
      dummy.rotation.x = Math.sin(time * 2 + dummy.position.x) * 0.1;
      dummy.rotation.z = Math.cos(time * 2 + dummy.position.z) * 0.1;
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const r = 11 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Avoid dirt paths
      if (Math.abs(x) < 2 || Math.abs(z) < 2) continue;
      
      dummy.position.set(x, 0.1, z);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.scale.set(1, 1 + Math.random(), 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(0.1, 0.4), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6b9c6a", side: THREE.DoubleSide, roughness: 1 }), []);

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} castShadow receiveShadow />
  );
}

export function DioramaScene({ onSelect }: DioramaSceneProps) {
  const islandRef = useRef<THREE.Group>(null);

  // Subtle floating animation for the whole island
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={islandRef}>
      {/* Floating Island Base */}
      <mesh receiveShadow position={[0, -2, 0]}>
        <cylinderGeometry args={[12, 10, 4, 64]} />
        <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
      </mesh>
      
      {/* Grass Top */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[12, 12, 0.1, 64]} />
        <meshStandardMaterial color="#5b8c5a" roughness={0.8} />
      </mesh>

      <InstancedGrass />

      {/* Dirt Path */}
      <mesh receiveShadow position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshStandardMaterial color="#8b6b4a" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[20, 4]} />
        <meshStandardMaterial color="#8b6b4a" roughness={1} />
      </mesh>

      {/* Vignettes */}
      <group position={[-4, 0.1, -4]}>
        <GerCamp onSelect={() => onSelect('ger')} />
      </group>
      
      <group position={[4, 0.1, -4]}>
        <PlayZone onSelect={() => onSelect('play')} />
      </group>
      
      <group position={[-4, 0.1, 4]}>
        <HerdingZone onSelect={() => onSelect('herding')} />
      </group>
      
      <group position={[4, 0.1, 4]}>
        <TrainingZone onSelect={() => onSelect('training')} />
      </group>
      
      {/* Decorative Trees/Rocks */}
      <DecorativeElements />
    </group>
  );
}

function DecorativeElements() {
  return (
    <group>
      {/* Ovoo (Sacred Stone Heap) */}
      <group position={[7, 0.1, 7]}>
        {/* Stones */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#888c8d" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0.2, 0.4]}>
          <dodecahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#7a7d7e" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.4, 0.2, -0.3]}>
          <dodecahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial color="#919596" roughness={0.9} />
        </mesh>
        {/* Central Pole */}
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Khadag (Blue Silk Scarves) */}
        <mesh castShadow position={[0, 1.5, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshStandardMaterial color="#0066cc" side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow position={[0.2, 1.3, 0]} rotation={[0, Math.PI / 2, -Math.PI / 4]}>
          <planeGeometry args={[0.1, 0.6]} />
          <meshStandardMaterial color="#0066cc" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Scattered Rocks */}
      <mesh castShadow receiveShadow position={[-9, 0.2, 2]}>
        <dodecahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#7a8b7a" />
      </mesh>
      <mesh castShadow receiveShadow position={[2, 0.1, -9]}>
        <dodecahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#7a8b7a" />
      </mesh>
    </group>
  );
}
