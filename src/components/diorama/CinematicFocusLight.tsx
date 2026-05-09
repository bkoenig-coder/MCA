import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';

interface CinematicLightProps {
  hovered: boolean;
  color?: string;
  position?: [number, number, number];
}

export function CinematicFocusLight({ hovered, color = "#ffcfaa", position = [0, 8, 0] }: CinematicLightProps) {
  const lightRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (lightRef.current) {
      // Lerp intensity for smooth fade
      const targetIntensity = hovered ? 15 : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 6);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <SpotLight
        ref={lightRef}
        position={position}
        angle={0.6}
        penumbra={0.8}
        color={color}
        distance={25}
        castShadow
        intensity={0}
        attenuation={8}
        anglePower={5}
        volumetric={false} // turn off if it is buggy, but SpotLight does volumetric by default if true.
      />
    </group>
  );
}
