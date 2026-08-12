import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

export function UnescoShrine({ onSelect, hideLabels }: { onSelect: () => void; hideLabels?: boolean }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      crystalRef.current.position.y = 2.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <CinematicFocusLight hovered={hovered} color="#ffd700" position={[0, 8, 0]} />
      <ZoneLabel title={t('diorama.unesco.label', 'UNESCO Heritage Shrine')} position={[0, 5.5, 0]} hide={hideLabels} />

      {/* Tiered Stone & Gold Shrine Base */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.4, 8]} />
        <meshStandardMaterial color="#3a2e2b" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.3, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.2, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 4 Surrounding Golden Pillars */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={i} position={[Math.cos(angle) * 1.4, 0.8, Math.sin(angle) * 1.4]}>
          <mesh castShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 1.4, 6]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color="#0055a5" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Floating Glowing Heritage Crystal (Morin Khuur & Ulzii Symbol emblem representation) */}
      <mesh ref={crystalRef} position={[0, 2.4, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} emissive="#ffaa00" emissiveIntensity={0.6} />
      </mesh>

      {/* Blue Silk Khadag Scarf Wrapped Base */}
      <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.2, 0.08, 8, 16]} />
        <meshStandardMaterial color="#0066cc" roughness={0.4} />
      </mesh>
    </group>
  );
}
