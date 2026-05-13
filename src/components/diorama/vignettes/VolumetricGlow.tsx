import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VolumetricGlowProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  opacity?: number;
  height?: number;
  radius?: number;
  speed?: number;
}

export function VolumetricGlow({ 
  position = [0, 0, 0], 
  color = "#ff8800",
  scale = 1,
  opacity = 0.15,
  height = 4,
  radius = 1.5,
  speed = 1.5
}: VolumetricGlowProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      // Subtle pulsing
      materialRef.current.opacity = opacity + Math.sin(state.clock.elapsedTime * speed + position[0]) * (opacity * 0.3);
    }
    if (meshRef.current) {
      // Subtle rocking/swaying like smoke/ambient light moving
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5 + position[2]) * 0.05;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.7 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        {/* We use a cylinder that is tapering to the top or bottom for the god ray effect */}
        <cylinderGeometry args={[radius * 0.2, radius, height, 16, 1, true]} />
        <meshBasicMaterial 
          ref={materialRef}
          color={color} 
          transparent={true} 
          opacity={opacity} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
