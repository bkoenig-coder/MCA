import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';
import { VolumetricGlow } from './VolumetricGlow';

interface NomadicZoneProps {
  onSelect?: () => void;
  hideLabels?: boolean;
}

export function NomadicZone({ onSelect, hideLabels }: NomadicZoneProps) {
    const [hovered, setHovered] = useState(false);
const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} onClick={onSelect} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      
      
      {/* Grass Top */}
      

      {/* Dirt path through village */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[8, 8, 0.05, 6]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* Gers */}
      <VillageGer position={[-4, 0.1, -4]} />
      <VillageGer position={[4, 0.1, -5]} />
      <VillageGer position={[0, 0.1, -7]} />
      <VillageGer position={[-6, 0.1, 3]} />
      <VillageGer position={[6, 0.1, 2]} />

      {/* Center Campfire */}
      <group position={[0, 0.1, 0]}>
        <Campfire />
        <FamilyAroundFire />
      </group>

      {/* Hitching Posts and Horses */}
      <HitchingPost position={[-8, 0.1, -2]} />
      
      {/* Animals */}
      <WanderingAnimals />

      {/* Carts */}
      <StorageCart position={[5, 0.1, -2]} />
      <StorageCart position={[-3, 0.1, -7]} />

      {/* Eagle Hunter */}
      <EagleHunter position={[8, 0.1, -3]} />

      {/* Children playing */}
      <ChildrenPlaying position={[-3, 0.1, 5]} />

      {/* Elder playing Morin Khuur */}
      <MorinKhuurPlayer position={[3, 0.1, 5]} />

      {/* Lighting */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#ffa502" distance={15} />

      {/* Weather particles (golden fog/dust) */}
      <DustParticles count={15} />

      {!hideLabels && (
        <>
          <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
          <ZoneLabel title="Nomadic Life" position={[0, 6, 0]} hide={hideLabels} />
        </>
      )}
    </group>
  );
}

function VillageGer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ger Walls */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 2, 6]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[2.7, 1.2, 6]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
      </mesh>
      {/* Toono */}
      <mesh position={[0, 3.15, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial color="#e1b12c" />
      </mesh>
      {/* Door */}
      <mesh castShadow position={[0, 1, 2.45]}>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color="#c23616" />
      </mesh>
      {/* Light inside */}
      <pointLight position={[0, 1.5, 0]} intensity={1.0} color="#ff9f43" distance={5} />
      {/* Smoke */}
      <ChimneySmoke position={[0, 3.5, 0]} />
    </group>
  );
}

function Campfire() {
  const fireRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
      fireRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 12) * 0.3;
    }
  });

  return (
    <group>
      {/* Stones */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
         <torusGeometry args={[0.6, 0.1, 8, 8]} />
         <meshStandardMaterial color="#7f8fa6" />
      </mesh>
      {/* Wood */}
      <mesh castShadow position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
         <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
         <meshStandardMaterial color="#353b48" />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, Math.PI / 4]}>
         <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
         <meshStandardMaterial color="#353b48" />
      </mesh>
      {/* Fire */}
      <mesh ref={fireRef} position={[0, 0.5, 0]}>
         <coneGeometry args={[0.4, 0.8, 6]} />
         <meshStandardMaterial color="#e84118" emissive="#e84118" emissiveIntensity={2} />
      </mesh>
      <VolumetricGlow position={[0, 0.9, 0]} color="#ffaa55" height={5} radius={2} opacity={0.3} />
      <pointLight ref={lightRef} position={[0, 1, 0]} color="#ff7f50" distance={8} />
    </group>
  );
}

function FamilyAroundFire() {
  return (
    <group>
      <Person position={[-1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#0097e6" />
      <Person position={[1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#c23616" />
      <Person position={[0, 0, -1.2]} rotation={[0, 0, 0]} scale={0.7} color="#e1b12c" />
    </group>
  );
}

function Person({ position, rotation, color, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], color: string, scale?: number }) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Sitting Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
         <cylinderGeometry args={[0.3, 0.4, 0.8, 6]} />
         <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1, 0]}>
         <sphereGeometry args={[0.25, 4, 4]} />
         <meshStandardMaterial color="#f5cd79" />
      </mesh>
    </group>
  );
}

function HitchingPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      <mesh castShadow position={[-1.5, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#7158e2" />
      </mesh>
      <mesh castShadow position={[1.5, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#7158e2" />
      </mesh>
      <mesh castShadow position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshStandardMaterial color="#7158e2" />
      </mesh>
      {/* Tied Horse */}
      <Horse position={[0, 6, -1]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

function Horse({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const horseColor = "#cda434";
  return (
    <group position={position} rotation={rotation} scale={0.5}>
       {/* Body */}
       <mesh castShadow position={[0, 0, 0]}>
         <boxGeometry args={[1.8, 0.8, 0.7]} />
         <meshStandardMaterial color={horseColor} />
       </mesh>
       {/* Neck */}
       <mesh castShadow position={[0.8, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
         <boxGeometry args={[0.8, 0.4, 0.4]} />
         <meshStandardMaterial color={horseColor} />
       </mesh>
       {/* Head */}
       <mesh castShadow position={[1.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
         <boxGeometry args={[0.5, 0.4, 0.35]} />
         <meshStandardMaterial color={horseColor} />
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
         <meshStandardMaterial color={horseColor} />
       </mesh>
       <mesh castShadow position={[0.6, -0.6, -0.2]}>
         <boxGeometry args={[0.15, 0.8, 0.15]} />
         <meshStandardMaterial color={horseColor} />
       </mesh>
       <mesh castShadow position={[-0.6, -0.6, 0.2]}>
         <boxGeometry args={[0.15, 0.8, 0.15]} />
         <meshStandardMaterial color={horseColor} />
       </mesh>
       <mesh castShadow position={[-0.6, -0.6, -0.2]}>
         <boxGeometry args={[0.15, 0.8, 0.15]} />
         <meshStandardMaterial color={horseColor} />
       </mesh>
    </group>
  );
}

function Livestock({ position, type }: { position: [number, number, number], type: 'sheep' | 'yak' }) {
  return (
    <group position={position}>
      {type === 'sheep' ? (
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.4]} />
          <meshStandardMaterial color="#f5f6fa" roughness={1} />
        </mesh>
      ) : (
        <mesh castShadow position={[0, 1, 0]}>
          <boxGeometry args={[1.5, 1, 0.8]} />
          <meshStandardMaterial color="#2f3640" roughness={1} />
        </mesh>
      )}
    </group>
  );
}

function WanderingAnimals() {
  return (
    <group>
      <Livestock position={[-10, 0.1, 8]} type="yak" />
      <Livestock position={[-11, 0.1, 6]} type="yak" />
      <Livestock position={[10, 0.1, -6]} type="sheep" />
      <Livestock position={[11, 0.1, -5]} type="sheep" />
      <Livestock position={[9, 0.1, -7]} type="sheep" />
      <Horse position={[10, 0.1, 8]} rotation={[0, Math.PI / 3, 0]} />
    </group>
  );
}

function StorageCart({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cart Base */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.2, 1.2]} />
        <meshStandardMaterial color="#574b90" />
      </mesh>
      {/* Wheels */}
      <mesh castShadow position={[-0.6, 0.5, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial color="#303952" />
      </mesh>
      <mesh castShadow position={[0.6, 0.5, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial color="#303952" />
      </mesh>
      <mesh castShadow position={[-0.6, 0.5, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial color="#303952" />
      </mesh>
      <mesh castShadow position={[0.6, 0.5, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 6]} />
        <meshStandardMaterial color="#303952" />
      </mesh>
      {/* Supplies */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[1.6, 0.6, 1]} />
        <meshStandardMaterial color="#c8d6e5" />
      </mesh>
    </group>
  );
}

function EagleHunter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 4, 0]}>
      {/* Hunter */}
      <Person position={[0, 0, 0]} rotation={[0, 0, 0]} color="#192a56" />
      {/* Arm outstretched */}
      <mesh castShadow position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#192a56" />
      </mesh>
      {/* Eagle */}
      <mesh castShadow position={[0.7, 1.1, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.2]} />
        <meshStandardMaterial color="#2f3640" />
      </mesh>
      <mesh castShadow position={[0.7, 1.2, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="#2f3640" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ChildrenPlaying({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <Person position={[1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#44bd32" scale={0.7} />
        <Person position={[-1, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#e1b12c" scale={0.6} />
      </group>
    </group>
  );
}

function MorinKhuurPlayer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 6, 0]}>
      <Person position={[0, 0, 0]} rotation={[0, 0, 0]} color="#8c7ae6" />
      {/* Instrument */}
      <mesh castShadow position={[0.2, 0.8, 0.2]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.1, 0.6, 0.3]} />
        <meshStandardMaterial color="#b33939" />
      </mesh>
    </group>
  );
}

function DustParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;     
      positions[i * 3 + 1] = Math.random() * 5;          
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30; 
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.02;
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime + i) * 0.02;
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
        size={0.1}
        color="#fae8c3"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ChimneySmoke({ position }: { position: [number, number, number] }) {
  const smokeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, i) => {
        child.position.y += 0.02;
        child.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
        child.scale.setScalar(1 + child.position.y * 0.2);
        ((child as THREE.Mesh).material as THREE.Material).opacity = Math.max(0, 0.6 - child.position.y * 0.2);
        
        if (child.position.y > 3) {
          child.position.y = 0;
          child.position.x = 0;
          child.scale.setScalar(1);
        }
      });
    }
  });

  return (
    <group position={position} ref={smokeRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 1, 0]}>
          <sphereGeometry args={[0.3, 4, 4]} />
          <meshBasicMaterial color="#dfe6e9" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
