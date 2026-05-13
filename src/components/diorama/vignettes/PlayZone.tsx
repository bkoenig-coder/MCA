import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

export function PlayZone({ onSelect, hideLabels }: { onSelect: () => void; hideLabels?: boolean }) {
    const [hovered, setHovered] = useState(false);
const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 1.5;
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
      <ZoneLabel title="Shagai Play" position={[0, 1.8, 0]} hide={hideLabels} />
      
      {/* Invisible Hitbox for easier clicking */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2, 2, 1.5, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={groupRef}>
        {/* Children running in a circle (in colorful Deels) */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} castShadow position={[Math.cos(i * Math.PI * 0.66) * 1.5, 0.4, Math.sin(i * Math.PI * 0.66) * 1.5]}>
            <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
            <meshStandardMaterial color={['#e74c3c', '#3498db', '#f1c40f'][i]} />
          </mesh>
        ))}
      </group>
      {/* Center object: Pile of Shagai (Ankle bones) */}
      <group position={[0, 0.05, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} castShadow position={[(Math.random() - 0.5) * 0.4, Math.random() * 0.1, (Math.random() - 0.5) * 0.4]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
            <meshStandardMaterial color="#ecf0f1" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
