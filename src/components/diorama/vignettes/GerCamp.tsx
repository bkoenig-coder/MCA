import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

export function GerCamp({ onSelect, hideLabels }: { onSelect: () => void; hideLabels?: boolean }) {
  const smokeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {

    if (smokeRef.current) {
      smokeRef.current.children.forEach((particle, i) => {
        particle.position.y += 0.02;
        particle.position.x = Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
        particle.scale.setScalar(Math.max(0, 1 - particle.position.y / 3));
        if (particle.position.y > 3) particle.position.y = 0;
      });
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
      <ZoneLabel title="The Ger" position={[0, 4.5, 0]} hide={hideLabels} />
      {/* Ger Base */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[2, 2, 1.6, 6]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </mesh>
      {/* Ger Roof */}
      <mesh castShadow receiveShadow position={[0, 2.1, 0]}>
        <coneGeometry args={[2.1, 1.2, 6]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </mesh>
      {/* Toono (Roof Ring) */}
      <mesh castShadow position={[0, 2.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.05, 8, 24]} />
        <meshStandardMaterial color="#d35400" />
      </mesh>
      {/* Door Frame */}
      <mesh position={[0, 0.8, 2.01]}>
        <boxGeometry args={[0.9, 1.4, 0.05]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {/* Door Details (Knots/Handles) */}
      <mesh position={[0.3, 0.8, 2.04]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>

      {/* Hitching Post (Uya) */}
      <group position={[-3, 0, 2]}>
        <mesh castShadow position={[-0.8, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        <mesh castShadow position={[0.8, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        <mesh castShadow position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
      </group>
      
      {/* Smoke Particles */}
      <group ref={smokeRef} position={[0, 2.8, 0]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.6, 0]}>
            <sphereGeometry args={[0.2, 4, 4]} />
            <meshBasicMaterial color="#cccccc" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
