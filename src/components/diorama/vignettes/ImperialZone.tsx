import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

interface ImperialZoneProps {
  onSelect?: () => void;
  hideLabels?: boolean;
}

export function ImperialZone({ onSelect, hideLabels }: ImperialZoneProps) {
    const [hovered, setHovered] = useState(false);
const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} onClick={onSelect} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      {/* Imperial Base Platform */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[14, 13, 1, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      
      {/* Stone Floor Top */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[14, 14, 0.1, 32]} />
        <meshStandardMaterial color="#2d3436" roughness={0.7} />
      </mesh>

      {/* Grand Path to Throne */}
      <mesh receiveShadow position={[0, 0.06, 6]}>
        <boxGeometry args={[4, 0.05, 10]} />
        <meshStandardMaterial color="#636e72" roughness={0.8} />
      </mesh>

      {/* Stone Stairway to Throne */}
      <group position={[0, 0, 1]}>
        {[0, 1, 2, 3].map((step) => (
          <mesh key={`step-${step}`} receiveShadow castShadow position={[0, step * 0.2 + 0.1, -step * 0.4]}>
            <boxGeometry args={[6, 0.2, 0.4]} />
            <meshStandardMaterial color="#2d3436" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Giant Imperial Ger */}
      <ImperialGer position={[0, 1, -6]} />

      {/* Imperial Throne and Khan */}
      <group position={[0, 0.8, -0.5]}>
        <Throne />
        <ChinggisKhan />
      </group>

      {/* Giant Sulde Banners */}
      <SuldeBanner position={[-4, 0.1, -1]} />
      <SuldeBanner position={[4, 0.1, -1]} />

      {/* Massive Braziers */}
      <Brazier position={[-3, 0.1, 4]} />
      <Brazier position={[3, 0.1, 4]} />
      <Brazier position={[-5, 0.1, 0]} />
      <Brazier position={[5, 0.1, 0]} />

      {/* Elite Warriors lining the path */}
      <EliteWarriorsPath />

      {/* Emissaries Kneeling */}
      <group position={[0, 0.1, 2.5]}>
        <KneelingEmissary position={[-1.5, 0, 0]} rotation={[0, -Math.PI / 6, 0]} />
        <KneelingEmissary position={[1.5, 0, 0]} rotation={[0, Math.PI / 6, 0]} />
      </group>

      {/* Mounted Horse Guards Patrol */}
      <PatrolGuards radius={11} count={6} />

      {/* Cinematic Lighting & Fog Atmosphere */}
      <pointLight position={[0, 6, -2]} intensity={2.5} color="#ffd700" distance={20} />
      <pointLight position={[0, 3, 10]} intensity={1.0} color="#4ea8de" distance={25} />
      
      {/* Floating Embers */}
      <EmbersParticles count={30} />

      {!hideLabels && (
        <>
          <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
          <ZoneLabel title="Imperial Court" position={[0, 9, 0]} hide={hideLabels} />
        </>
      )}
    </group>
  );
}

function ImperialGer({ position }: { position: [number, number, number] }) {
  const outerGlowRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (outerGlowRef.current) {
      outerGlowRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Mega Ger Walls */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[6, 6, 4, 32]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </mesh>
      
      {/* Mega Ger Roof */}
      <mesh castShadow receiveShadow position={[0, 5, 0]}>
        <coneGeometry args={[6.5, 2.5, 32]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </mesh>

      {/* Gold Trim Base */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[6.1, 6.1, 0.2, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>

      {/* Gold Trim Roof */}
      <mesh castShadow position={[0, 4, 0]}>
        <cylinderGeometry args={[6.1, 6.1, 0.2, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>

      {/* Toono Window */}
      <mesh position={[0, 6.3, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>

      {/* Massive Door Entrance */}
      <mesh castShadow position={[0, 1.5, 5.9]}>
        <boxGeometry args={[3, 3, 0.5]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      
      {/* Side Banners hanging from roof */}
      <mesh castShadow position={[-2, 3, 5.8]}>
         <planeGeometry args={[0.8, 3]} />
         <meshStandardMaterial color="#c0392b" side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[2, 3, 5.8]}>
         <planeGeometry args={[0.8, 3]} />
         <meshStandardMaterial color="#c0392b" side={THREE.DoubleSide} />
      </mesh>

      {/* Warm internal firelight spilling out */}
      <pointLight 
        ref={outerGlowRef} 
        color="#ff7f50" 
        distance={25} 
        position={[0, 2, 6.5]} 
        castShadow={false}
      />
    </group>
  );
}

function Throne() {
  return (
    <group>
      {/* Throne Base Layer */}
      <mesh castShadow position={[0, 0.5, 0]}>
         <boxGeometry args={[4, 1, 3]} />
         <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Seat */}
      <mesh castShadow position={[0, 1.2, 0.5]}>
         <boxGeometry args={[2.5, 0.4, 2]} />
         <meshStandardMaterial color="#000000" roughness={0.4} /> // Black fur/leather
      </mesh>
      {/* Backrest */}
      <mesh castShadow position={[0, 2.5, -0.3]}>
         <boxGeometry args={[2.5, 3, 0.4]} />
         <meshStandardMaterial color="#000000" roughness={0.4} />
      </mesh>
      {/* Armrests */}
      <mesh castShadow position={[-1.1, 1.8, 0.5]}>
         <boxGeometry args={[0.3, 0.8, 2]} />
         <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </mesh>
      <mesh castShadow position={[1.1, 1.8, 0.5]}>
         <boxGeometry args={[0.3, 0.8, 2]} />
         <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </mesh>
    </group>
  );
}

function ChinggisKhan() {
  return (
    <group position={[0, 1.4, 0.5]}>
      {/* Body Seated */}
      <mesh castShadow position={[0, 0.8, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.2, 1.4, 1]} />
        <meshStandardMaterial color="#c0392b" /> // Crimson royal robe
      </mesh>
      {/* Gold Belt/Armor */}
      <mesh castShadow position={[0, 0.5, 0.2]}>
        <boxGeometry args={[1.3, 0.3, 1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>
      {/* Left Arm resting */}
      <mesh castShadow position={[-0.8, 0.7, 0.3]} rotation={[-0.4, 0, 0.2]}>
        <capsuleGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {/* Right Arm resting */}
      <mesh castShadow position={[0.8, 0.7, 0.3]} rotation={[-0.4, 0, -0.2]}>
        <capsuleGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.8, -0.1]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      {/* Crown/Helmet */}
      <mesh castShadow position={[0, 2.15, -0.1]}>
        <coneGeometry args={[0.4, 0.4, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 2, -0.1]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>
    </group>
  );
}

function SuldeBanner({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow position={[0, 3, 0]}>
         <cylinderGeometry args={[0.1, 0.1, 6]} />
         <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Ring base for hair */}
      <mesh castShadow position={[0, 5.5, 0]}>
         <torusGeometry args={[0.4, 0.05, 8, 16]} />
         <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>
      {/* Horse hair top (simplified as a cone/cylinder cluster) */}
      <mesh castShadow position={[0, 4.5, 0]}>
         <cylinderGeometry args={[0.4, 0.6, 2, 16]} />
         <meshStandardMaterial color="#ffffff" roughness={1} /> // Nine White Banners style
      </mesh>
      {/* Spear tip */}
      <mesh castShadow position={[0, 6.2, 0]}>
         <coneGeometry args={[0.08, 0.6, 4]} />
         <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>
    </group>
  );
}

function Brazier({ position }: { position: [number, number, number] }) {
  const fireRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
      fireRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh castShadow position={[0, 0.5, 0]}>
         <cylinderGeometry args={[0.6, 0.8, 1, 8]} />
         <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
      {/* Bowl */}
      <mesh castShadow position={[0, 1.2, 0]}>
         <sphereGeometry args={[0.8, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
         <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
      {/* Fire */}
      <mesh ref={fireRef} position={[0, 1.6, 0]}>
         <coneGeometry args={[0.6, 1.2, 8]} />
         <meshStandardMaterial color="#ff4500" emissive="#ff4500" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 2, 0]} color="#ff6b00" distance={10} />
    </group>
  );
}

function EliteWarriorsPath() {
  const warriors = [];
  const zPositions = [3, 5, 7, 9];
  
  zPositions.forEach((z) => {
    // Left side warrior
    warriors.push(
      <group key={`w-l-${z}`} position={[-2.5, 0.1, z]} rotation={[0, Math.PI / 2, 0]}>
        <Warrior />
      </group>
    );
    // Right side warrior
    warriors.push(
      <group key={`w-r-${z}`} position={[2.5, 0.1, z]} rotation={[0, -Math.PI / 2, 0]}>
        <Warrior />
      </group>
    );
  });

  return <group>{warriors}</group>;
}

function Warrior() {
  return (
    <group>
      {/* Body (Dark Armor) */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.4, 8]} />
        <meshStandardMaterial color="#2d3436" roughness={0.7} metalness={0.6} />
      </mesh>
      {/* Gold Accents */}
      <mesh castShadow position={[0, 0.7, 0.05]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      {/* Elite Helmet */}
      <mesh castShadow position={[0, 1.75, 0]}>
        <coneGeometry args={[0.25, 0.4, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} />
      </mesh>
      {/* Shield */}
      <mesh castShadow position={[0.4, 0.8, 0.3]} rotation={[0, Math.PI/2, Math.PI/2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
      {/* Spear */}
      <mesh castShadow position={[-0.4, 1.4, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.8, 8]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh castShadow position={[-0.4, 2.8, 0]}>
        <coneGeometry args={[0.06, 0.4, 4]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>
    </group>
  );
}

function KneelingEmissary({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Kneeling Body */}
      <mesh castShadow position={[0, 0.4, 0]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.6]} />
        <meshStandardMaterial color="#2980b9" /> // Rich blue emissary robes
      </mesh>
      {/* Head bowing */}
      <mesh castShadow position={[0, 0.8, 0.3]}>
         <sphereGeometry args={[0.18]} />
         <meshStandardMaterial color="#d2b48c" />
      </mesh>
    </group>
  );
}

function PatrolGuards({ radius, count }: { radius: number, count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the entire group slowly to simulate patrol
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const guards = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const rotationY = -angle + Math.PI / 2; // Face direction of travel

    guards.push(
      <group key={`patrol-${i}`} position={[x, 0.1, z]} rotation={[0, rotationY, 0]}>
         <group scale={0.7} position={[0,0.5,0]}>
           {/* Body */}
           <mesh castShadow position={[0, 0, 0]}>
             <boxGeometry args={[1.8, 0.8, 0.7]} />
             <meshStandardMaterial color="#111111" />
           </mesh>
           {/* Neck */}
           <mesh castShadow position={[0.8, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
             <boxGeometry args={[0.8, 0.4, 0.4]} />
             <meshStandardMaterial color="#111111" />
           </mesh>
           {/* Head */}
           <mesh castShadow position={[1.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
             <boxGeometry args={[0.5, 0.4, 0.35]} />
             <meshStandardMaterial color="#111111" />
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
           {/* Legs */}
           <mesh castShadow position={[0.6, -0.6, 0.2]}>
             <boxGeometry args={[0.15, 0.8, 0.15]} />
             <meshStandardMaterial color="#111111" />
           </mesh>
           <mesh castShadow position={[0.6, -0.6, -0.2]}>
             <boxGeometry args={[0.15, 0.8, 0.15]} />
             <meshStandardMaterial color="#111111" />
           </mesh>
           <mesh castShadow position={[-0.6, -0.6, 0.2]}>
             <boxGeometry args={[0.15, 0.8, 0.15]} />
             <meshStandardMaterial color="#111111" />
           </mesh>
           <mesh castShadow position={[-0.6, -0.6, -0.2]}>
             <boxGeometry args={[0.15, 0.8, 0.15]} />
             <meshStandardMaterial color="#111111" />
           </mesh>

           {/* Rider */}
           <mesh castShadow position={[-0.2, 0.8, 0]} rotation={[0, 0, Math.PI/12]}>
             <cylinderGeometry args={[0.25, 0.3, 0.9, 8]} />
             <meshStandardMaterial color="#e74c3c" /> // Red accented armor
           </mesh>
           <mesh castShadow position={[-0.4, 1.4, 0]}>
             <sphereGeometry args={[0.2]} />
             <meshStandardMaterial color="#d2b48c" />
           </mesh>
           {/* Guard Helmet/Hat */}
           <mesh castShadow position={[-0.4, 1.6, 0]}>
             <coneGeometry args={[0.25, 0.4, 8]} />
             <meshStandardMaterial color="#bdc3c7" />
           </mesh>

           {/* Flag */}
           <mesh castShadow position={[-0.6, 1.8, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 2]} />
              <meshStandardMaterial color="#bdc3c7" />
           </mesh>
           <mesh castShadow position={[-0.1, 2.6, 0]}>
              <planeGeometry args={[1, 0.5]} />
              <meshStandardMaterial color="#c0392b" side={THREE.DoubleSide} />
           </mesh>
         </group>
      </group>
    );
  }

  return <group ref={groupRef}>{guards}</group>;
}

function EmbersParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;     // x
      positions[i * 3 + 1] = Math.random() * 8;          // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Move upward and drift
        positions[i * 3 + 1] += 0.02 + Math.random() * 0.02;
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        
        // Reset if too high
        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ff7f50"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
