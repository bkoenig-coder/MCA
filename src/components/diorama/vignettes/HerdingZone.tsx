import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

export function HerdingZone({ onSelect, hideLabels }: { onSelect: () => void; hideLabels?: boolean }) {
    const [hovered, setHovered] = useState(false);
const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
      <ZoneLabel title="The Herds" position={[0, 2.2, 0]} hide={hideLabels} />
      {/* Mother (kneeling in Deel) */}
      <mesh castShadow position={[-1, 0.4, 0]}>
        <capsuleGeometry args={[0.25, 0.3, 4, 8]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
      {/* Milking Arm */}
      <group position={[-0.8, 0.5, 0]} ref={armRef}>
        <mesh castShadow position={[0.2, -0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 6]} />
          <meshStandardMaterial color="#f39c12" />
        </mesh>
      </group>
      
      {/* Wooden Bucket */}
      <mesh castShadow position={[-0.5, 0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 6]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>

      {/* Horse (Takhi style) */}
      <group position={[0.5, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Body */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.8, 0.7]} />
          <meshStandardMaterial color="#cda434" />
        </mesh>
        {/* Neck */}
        <mesh castShadow position={[0.8, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.8, 0.4, 0.4]} />
          <meshStandardMaterial color="#cda434" />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[1.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.5, 0.4, 0.35]} />
          <meshStandardMaterial color="#cda434" />
        </mesh>
        {/* Mane */}
        <mesh castShadow position={[0.7, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.7, 0.1, 0.1]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        {/* Tail */}
        <mesh castShadow position={[-0.9, -0.1, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      </group>

      {/* Foal */}
      <group position={[0.5, 0.4, 1.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.9, 0.5, 0.3]} />
          <meshStandardMaterial color="#a67c00" />
        </mesh>
        <mesh castShadow position={[0.5, 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.4, 0.2, 0.2]} />
          <meshStandardMaterial color="#a67c00" />
        </mesh>
      </group>
    </group>
  );
}
