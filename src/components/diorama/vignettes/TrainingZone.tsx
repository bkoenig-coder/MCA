import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

export function TrainingZone({ onSelect, hideLabels }: { onSelect: () => void; hideLabels?: boolean }) {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);
const wrestler1Ref = useRef<THREE.Mesh>(null);
  const wrestler2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (wrestler1Ref.current && wrestler2Ref.current) {
      const t = state.clock.elapsedTime * 2;
      wrestler1Ref.current.position.x = -0.4 + Math.sin(t) * 0.1;
      wrestler1Ref.current.rotation.z = Math.sin(t) * 0.1;
      
      wrestler2Ref.current.position.x = 0.4 - Math.sin(t) * 0.1;
      wrestler2Ref.current.rotation.z = -Math.sin(t) * 0.1;
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
      <ZoneLabel title={t('diorama.training.label')} position={[0, 2.2, 0]} hide={hideLabels} />
      {/* Wrestler 1 (Red Zodog/Shuudag) */}
      <group ref={wrestler1Ref} position={[-0.4, 0.6, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.4, 4, 8]} />
          <meshStandardMaterial color="#d35400" />
        </mesh>
        <mesh castShadow position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 6]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.15, 6]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
      </group>

      {/* Wrestler 2 (Blue Zodog/Shuudag) */}
      <group ref={wrestler2Ref} position={[0.4, 0.6, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.4, 4, 8]} />
          <meshStandardMaterial color="#d35400" />
        </mesh>
        <mesh castShadow position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 6]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.15, 6]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
      </group>
      
      {/* Archery Target (Surs - stacked leather cylinders) */}
      <group position={[2, 0.2, -2]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Wooden rack */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[1.5, 0.4, 0.2]} />
          <meshStandardMaterial color="#8b5a2b" />
        </mesh>
        {/* Surs (Targets) */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} castShadow position={[-0.6 + i * 0.3, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.15, 6]} />
            <meshStandardMaterial color={i === 2 ? "#c0392b" : "#bdc3c7"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
