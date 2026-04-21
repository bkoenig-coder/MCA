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
      
      {/* State Suld - Nine White Banners */}
      <NineWhiteBanners />

      {/* Atmospheric Embers */}
      <AtmosphericEmbers />

      {/* Flying Eagle */}
      <FlyingEagle />
      
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

function FlyingEagle() {
  const eagleRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (eagleRef.current) {
      const time = state.clock.elapsedTime * 0.5;
      eagleRef.current.position.x = Math.cos(time) * 10;
      eagleRef.current.position.z = Math.sin(time) * 10;
      eagleRef.current.position.y = 8 + Math.sin(time * 2) * 1;
      eagleRef.current.rotation.y = -time + Math.PI; // Face the direction of flight
      
      // Wing flapping
      const leftWing = eagleRef.current.children[1] as THREE.Mesh;
      const rightWing = eagleRef.current.children[2] as THREE.Mesh;
      const flap = Math.sin(state.clock.elapsedTime * 10) * 0.2;
      leftWing.rotation.z = -Math.PI / 8 + flap;
      rightWing.rotation.z = Math.PI / 8 - flap;
    }
  });

  return (
    <group ref={eagleRef} scale={0.5}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
        <meshStandardMaterial color="#4a3b2c" />
      </mesh>
      {/* Left Wing */}
      <mesh castShadow position={[0.5, 0, -0.2]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[2, 0.05, 0.6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Right Wing */}
      <mesh castShadow position={[-0.5, 0, -0.2]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[2, 0.05, 0.6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Tail */}
      <mesh castShadow position={[0, 0, -0.6]}>
        <boxGeometry args={[0.6, 0.02, 0.5]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0, 0.6]}>
        <boxGeometry args={[0.25, 0.2, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Beak */}
      <mesh castShadow position={[0, 0, 0.8]} rotation={[-Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#d4a017" />
      </mesh>
    </group>
  );
}

function NineWhiteBanners() {
  const banners = [];

  // Central dynamic fire reference for pulsing light just for ambient feel around the main banner
  const centerFireLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (centerFireLightRef.current) {
      centerFireLightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 15) * 0.3 + Math.random() * 0.2;
    }
  });

  // A tiny inner component for the top flame to have local rotation/wobble
  const BannerFlame = ({ position }: { position: [number, number, number] }) => {
    const flameRef = useRef<THREE.Group>(null);
    useFrame((state) => {
      if (flameRef.current) {
        // Wobble like fire
        flameRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10 + position[0]) * 0.1;
        flameRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 12 + position[2]) * 0.1;
        flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 15 + position[0]) * 0.2;
      }
    });

    return (
      <group position={position} ref={flameRef}>
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.06, 0.3, 8]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <coneGeometry args={[0.04, 0.2, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      </group>
    );
  };

  // Center banner
  banners.push(
    <group key="center" position={[0, 0, 0]}>
      {/* Spear tip replaced with flame base */}
      <mesh castShadow position={[0, 3.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      
      {/* Center Fire */}
      <BannerFlame position={[0, 3.65, 0]} />
      <pointLight ref={centerFireLightRef} color="#ff7b00" position={[0, 3.8, 0]} distance={8} intensity={2} decay={1.5} />
      {/* Center Pole */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.6]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Ring & White Horse Hair */}
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 16]} />
        <meshStandardMaterial color="#f8f9fa" roughness={1} />
      </mesh>
      {/* Platform/Tier below the hair */}
      <mesh castShadow position={[0, 3.6, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} />
      </mesh>
    </group>
  );

  // 8 Surrounding banners
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 1.3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    banners.push(
      <group key={`banner-${i}`} position={[x, 0, z]}>
        {/* Spear tip replaced with flame base */}
        <mesh castShadow position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
        
        {/* Surrounding Fire */}
        <BannerFlame position={[0, 2.65, 0]} />
        <pointLight color="#ff5500" position={[0, 2.8, 0]} distance={4} intensity={0.5} decay={2} />
        {/* Pole */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Ring & White Horse Hair */}
        <mesh castShadow position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.8, 16]} />
          <meshStandardMaterial color="#f8f9fa" roughness={1} />
        </mesh>
        {/* Platform top */}
        <mesh castShadow position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.05, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0.1, 0]}>
      {/* Stone base for the banners */}
      <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.8, 2, 0.2, 8]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 8]} />
        <meshStandardMaterial color="#bdaa88" roughness={0.9} />
      </mesh>
      
      {/* A small blue Khadag on the center pole */}
      <mesh castShadow position={[0.2, 2.2, 0.2]} rotation={[0, Math.PI / 4, -Math.PI / 6]}>
        <planeGeometry args={[0.15, 0.8]} />
        <meshStandardMaterial color="#0066cc" side={THREE.DoubleSide} />
      </mesh>
      
      {banners}
    </group>
  );
}

function AtmosphericEmbers() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => new Float32Array(count).map(() => Math.random()), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      // Spawn among the banners (higher up)
      dummy.position.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 2 + 2.5,
        (Math.random() - 0.5) * 4
      );
      dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      // Float up and drift
      dummy.position.y += 0.015 * seeds[i] + 0.008;
      dummy.position.x += Math.sin(time + seeds[i] * 10) * 0.01;
      dummy.position.z += Math.cos(time + seeds[i] * 10) * 0.01;
      
      // Reset if too high (past 5, meaning above banners)
      if (dummy.position.y > 5.5) {
        dummy.position.set(
          (Math.random() - 0.5) * 3,
          2.5 + Math.random() * 0.5, // Start near the banner tops
          (Math.random() - 0.5) * 3
        );
      }
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.02, 0), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ff8800", transparent: true, opacity: 0.8 }), []);

  return <instancedMesh ref={meshRef} args={[geo, mat, count]} />;
}
