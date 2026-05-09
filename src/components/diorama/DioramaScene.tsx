import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GerCamp } from './vignettes/GerCamp';
import { PlayZone } from './vignettes/PlayZone';
import { HerdingZone } from './vignettes/HerdingZone';
import { TrainingZone } from './vignettes/TrainingZone';
import { ImperialZone } from './vignettes/ImperialZone';
import { NomadicZone } from './vignettes/NomadicZone';
import { SpiritZone } from './vignettes/SpiritZone';
import { NaadamZone } from './vignettes/NaadamZone';

interface DioramaSceneProps {
  onSelect: (id: string) => void;
  hideLabels?: boolean;
}

function InstancedGrass() {
  const count = 150;
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
      const r = 25 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Avoid dirt paths
      if (Math.abs(x) < 2.5 || Math.abs(z) < 2.5) continue;
      
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
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
}

export function DioramaScene({ onSelect, hideLabels }: DioramaSceneProps) {
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
        <cylinderGeometry args={[26, 24, 4, 12]} />
        <meshStandardMaterial color="#2d3748" roughness={0.9} />
      </mesh>
      
      {/* Grass Top */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[26, 26, 0.1, 12]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>

      <InstancedGrass />

      {/* Dirt Path */}
      <mesh receiveShadow position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 5]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[48, 5]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>

      {/* Vignettes */}
      <group position={[-4, 0.1, -4]}>
        <GerCamp onSelect={() => onSelect('ger')} hideLabels={hideLabels} />
      </group>
      
      <group position={[4, 0.1, -4]}>
        <PlayZone onSelect={() => onSelect('play')} hideLabels={hideLabels} />
      </group>
      
      <group position={[-4, 0.1, 4]}>
        <HerdingZone onSelect={() => onSelect('herding')} hideLabels={hideLabels} />
      </group>
      
      <group position={[4, 0.1, 4]}>
        <TrainingZone onSelect={() => onSelect('training')} hideLabels={hideLabels} />
      </group>
      
      {/* Imperial Court Island (East) */}
      <group position={[17, 0, 0]} >
        <ImperialZone onSelect={() => onSelect('imperial')} hideLabels={hideLabels} />
      </group>

      {/* Nomadic Village Island (South) */}
      <group position={[0, 0, 17]} >
        <NomadicZone onSelect={() => onSelect('nomadic')} hideLabels={hideLabels} />
      </group>

      {/* Sky & Spirits Island (North) */}
      <group position={[0, 0, -17]} >
        <SpiritZone onSelect={() => onSelect('spirit')} hideLabels={hideLabels} />
      </group>

      {/* Naadam Festival Island (West) */}
      <group position={[-17, 0, 0]} >
        <NaadamZone onSelect={() => onSelect('naadam')} hideLabels={hideLabels} />
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
        <mesh position={[0, 0.3, 0]}>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#888c8d" roughness={0.9} />
        </mesh>
        <mesh position={[0.4, 0.2, 0.4]}>
          <dodecahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#7a7d7e" roughness={0.9} />
        </mesh>
        <mesh position={[-0.4, 0.2, -0.3]}>
          <dodecahedronGeometry args={[0.6, 1]} />
          <meshStandardMaterial color="#919596" roughness={0.9} />
        </mesh>
        {/* Central Pole */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Khadag (Blue Silk Scarves) */}
        <mesh position={[0, 1.5, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshStandardMaterial color="#0066cc" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.2, 1.3, 0]} rotation={[0, Math.PI / 2, -Math.PI / 4]}>
          <planeGeometry args={[0.1, 0.6]} />
          <meshStandardMaterial color="#0066cc" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Scattered Rocks */}
      <mesh position={[-9, 0.2, 2]}>
        <dodecahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial color="#7a8b7a" />
      </mesh>
      <mesh position={[2, 0.1, -9]}>
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
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[0.6, 0.02, 0.5]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0, 0.6]}>
        <boxGeometry args={[0.25, 0.2, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0, 0.8]} rotation={[-Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#d4a017" />
      </mesh>
    </group>
  );
}

function BannerFlame({ position, scale = 1, isCenter = false }: { position: [number, number, number], scale?: number, isCenter?: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameGroupRef = useRef<THREE.Group>(null);
  const outerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const offset = position[0] + position[2]; // random offset
    
    const baseIntensity = isCenter ? 2.5 : 1.2;
    const pulseAmplitude = isCenter ? 0.8 : 0.4;
    
    // Light pulse
    if (lightRef.current) {
      lightRef.current.intensity = (baseIntensity + Math.sin(time * 12 + offset) * pulseAmplitude) * scale;
    }
    
    // Material pulse
    if (outerMatRef.current) {
      outerMatRef.current.opacity = 0.6 + Math.sin(time * 18 + offset) * 0.2;
    }
    
    // Chaotic flame animation
    if (flameGroupRef.current) {
      flameGroupRef.current.children.forEach((mesh, index) => {
        // Individual flame licking
        mesh.scale.y = 1 + Math.sin(time * (15 + index * 5) + offset) * 0.3;
        mesh.scale.x = 1 + Math.cos(time * (10 + index * 3) + offset) * 0.15;
        mesh.scale.z = 1 + Math.sin(time * (12 + index * 4) + offset) * 0.15;
        
        // Swaying
        mesh.rotation.z = Math.sin(time * 8 + offset + index) * 0.15;
        mesh.rotation.x = Math.cos(time * 7 + offset + index) * 0.15;
      });
    }
  });

  return (
    <group position={position} scale={scale}>
      <group ref={flameGroupRef} position={[0, 0.05, 0]}>
        {/* Core hot flame */}
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.04, 0.25, 5]} />
          <meshBasicMaterial ref={innerMatRef} color="#ffffff" />
        </mesh>
        
        {/* Outer mid-orange flame */}
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.08, 0.35, 6]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        
        {/* Licking side flame 1 */}
        <mesh position={[-0.03, 0.05, 0.02]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.05, 0.2, 4]} />
          <meshBasicMaterial color="#ff5500" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* Licking side flame 2 */}
        <mesh position={[0.03, 0.06, -0.02]} rotation={[0.1, 0, -0.2]}>
          <coneGeometry args={[0.04, 0.25, 4]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      
      {/* Base ambient glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial ref={outerMatRef} color={isCenter ? "#ff2200" : "#ff1100"} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      <pointLight 
        ref={lightRef} 
        color="#ff8800" 
        distance={isCenter ? 8 : 4} 
        castShadow={false} 
      />
    </group>
  );
}

function NineWhiteBanners() {
  const banners = [];

  // Center banner
  banners.push(
    <group key="center" position={[0, 0, 0]}>
      {/* Spear tip */}
      <mesh castShadow position={[0, 3.6, 0]}>
        <coneGeometry args={[0.08, 0.4, 4]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      {/* Center Pole */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.6]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Ring & White Horse Hair */}
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 8]} />
        <meshStandardMaterial color="#f8f9fa" roughness={1} />
      </mesh>
      {/* Platform/Tier below the hair */}
      <mesh castShadow position={[0, 3.6, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 8]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} />
      </mesh>
      {/* Flame on top */}
      <BannerFlame position={[0, 3.62, 0]} scale={1.5} isCenter={true} />
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
        {/* Spear tip */}
        <mesh castShadow position={[0, 2.6, 0]}>
          <coneGeometry args={[0.05, 0.3, 4]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </mesh>
        {/* Pole */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Ring & White Horse Hair */}
        <mesh castShadow position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.8, 8]} />
          <meshStandardMaterial color="#f8f9fa" roughness={1} />
        </mesh>
        {/* Platform top */}
        <mesh castShadow position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.05, 8]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.8} />
        </mesh>
        {/* Flame on top */}
        <BannerFlame position={[0, 2.52, 0]} scale={1} />
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
  const count = 15;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => new Float32Array(count).map(() => Math.random()), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      // Spawn around the banners
      dummy.position.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 2,
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
      dummy.position.y += 0.01 * seeds[i] + 0.005;
      dummy.position.x += Math.sin(time + seeds[i] * 10) * 0.01;
      dummy.position.z += Math.cos(time + seeds[i] * 10) * 0.01;
      
      // Reset if too high
      if (dummy.position.y > 5.5) {
        dummy.position.set(
          (Math.random() - 0.5) * 3,
          2.5 + Math.random(), // Start near banner tops
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
