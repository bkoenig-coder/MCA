import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';
import { Brazier } from './ImperialZone';

interface NaadamZoneProps {
  onSelect?: () => void;
  hideLabels?: boolean;
}

export function NaadamZone({ onSelect, hideLabels }: NaadamZoneProps) {
    const [hovered, setHovered] = useState(false);
const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} onClick={onSelect} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      
      

      {/* Festival Ground Center (Arena) */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[8, 8, 0.05, 6]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      
      {/* Wooden stands/fence around arena */}
      <ArenaStands />

      <Wrestlers />
      <Racers />
      <Archers />
      <Banners />
      <Crowd />
      <Musicians />
      <ColorfulGers />

      {/* Lighting */}
      <pointLight position={[0, 8, 0]} intensity={2.5} color="#ffcc88" distance={30} />
      
      {/* Central/Arena Braziers */}
      <Brazier position={[0, 0.1, 0]} />
      
      {/* Festival Particles */}
      <FestivalDust count={30} />

      {!hideLabels && (
        <>
          <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
          <ZoneLabel title="Naadam Festival" position={[0, 9, 0]} hide={hideLabels} />
        </>
      )}
    </group>
  );
}

function ArenaStands() {
  const stands = useMemo(() => Array.from({length: 16}), []);
  return (
    <group position={[0, 0.1, 0]}>
      {stands.map((_, i) => {
        const angle = (i/16)*Math.PI*2;
        // Don't put stands where archers/banners are (open path)
        if (i > 10 && i < 14) return null; 
        return (
          <group key={i} position={[Math.cos(angle)*8.5, 0, Math.sin(angle)*8.5]} rotation={[0, -angle, 0]}>
            {/* Wooden seating tier */}
            <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
               <boxGeometry args={[3, 0.6, 1]} />
               <meshStandardMaterial color="#a0522d" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.6, -0.5]}>
               <boxGeometry args={[3, 0.6, 1]} />
               <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        )
      })}
    </group>
  );
}

function Wrestlers() {
  const w1Ref = useRef<THREE.Group>(null);
  const w2Ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (w1Ref.current && w2Ref.current) {
        // Eagle dance flapping and bobbing
        w1Ref.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.15;
        w1Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        w2Ref.current.position.y = Math.sin(state.clock.elapsedTime * 4 + Math.PI) * 0.15;
        w2Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.1;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Umpire (Zasuul) */}
      <group position={[0, 0, -3]}>
        <mesh castShadow position={[0, 0.8, 0]}><cylinderGeometry args={[0.3, 0.4, 1.4, 6]}/><meshStandardMaterial color="#2c3e50"/></mesh>
        <mesh castShadow position={[0, 1.7, 0]}><sphereGeometry args={[0.2, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
        {/* Zasuul hat */}
        <mesh castShadow position={[0, 1.9, 0]}><coneGeometry args={[0.3, 0.4, 6]}/><meshStandardMaterial color="#e74c3c"/></mesh>
        {/* Holding wrestler's hat */}
        <mesh castShadow position={[0.4, 1, 0.3]} rotation={[Math.PI/4, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.6, 6]}/><meshStandardMaterial color="#c0392b"/></mesh>
        <mesh castShadow position={[0.4, 1.4, 0.4]}><cylinderGeometry args={[0.2, 0.2, 0.1, 6]}/><meshStandardMaterial color="#c0392b"/></mesh>
      </group>

      {/* Wrestler 1 (Red/Blue Zodog) doing Eagle Dance */}
      <group ref={w1Ref} position={[-2, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        {/* Boots (Gutal) */}
        <mesh castShadow position={[0.2, 0.2, 0]}><cylinderGeometry args={[0.12, 0.1, 0.4, 6]}/><meshStandardMaterial color="#2d3436"/></mesh>
        <mesh castShadow position={[-0.2, 0.2, 0]}><cylinderGeometry args={[0.12, 0.1, 0.4, 6]}/><meshStandardMaterial color="#2d3436"/></mesh>
        {/* Briefs (Shuudag) */}
        <mesh castShadow position={[0, 0.6, 0]}><boxGeometry args={[0.5, 0.4, 0.3]}/><meshStandardMaterial color="#c0392b"/></mesh>
        {/* Torso/Chest (exposed) */}
        <mesh castShadow position={[0, 1.0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.6, 6]}/><meshStandardMaterial color="#f5cd79"/></mesh>
        {/* Jacket (Zodog) sleeves */}
        <mesh castShadow position={[0.7, 1.1, 0]} rotation={[0, 0, Math.PI/3]}><cylinderGeometry args={[0.15, 0.15, 0.8, 6]}/><meshStandardMaterial color="#c0392b"/></mesh>
        <mesh castShadow position={[-0.7, 1.1, 0]} rotation={[0, 0, -Math.PI/3]}><cylinderGeometry args={[0.15, 0.15, 0.8, 6]}/><meshStandardMaterial color="#c0392b"/></mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.5, 0]}><sphereGeometry args={[0.25, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
      </group>
      {/* Wrestler 2 (Blue Zodog) */}
      <group ref={w2Ref} position={[2, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        <mesh castShadow position={[0.2, 0.2, 0]}><cylinderGeometry args={[0.12, 0.1, 0.4, 6]}/><meshStandardMaterial color="#2d3436"/></mesh>
        <mesh castShadow position={[-0.2, 0.2, 0]}><cylinderGeometry args={[0.12, 0.1, 0.4, 6]}/><meshStandardMaterial color="#2d3436"/></mesh>
        <mesh castShadow position={[0, 0.6, 0]}><boxGeometry args={[0.5, 0.4, 0.3]}/><meshStandardMaterial color="#2980b9"/></mesh>
        <mesh castShadow position={[0, 1.0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.6, 6]}/><meshStandardMaterial color="#f5cd79"/></mesh>
        <mesh castShadow position={[0.7, 1.1, 0]} rotation={[0, 0, Math.PI/3]}><cylinderGeometry args={[0.15, 0.15, 0.8, 6]}/><meshStandardMaterial color="#2980b9"/></mesh>
        <mesh castShadow position={[-0.7, 1.1, 0]} rotation={[0, 0, -Math.PI/3]}><cylinderGeometry args={[0.15, 0.15, 0.8, 6]}/><meshStandardMaterial color="#2980b9"/></mesh>
        <mesh castShadow position={[0, 1.5, 0]}><sphereGeometry args={[0.25, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
      </group>
    </group>
  );
}

function Racers() {
  const racersRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (racersRef.current) {
      racersRef.current.rotation.y = state.clock.elapsedTime * 0.4; // Slower gallop
      
      // Bobbing motion for individual horses
      racersRef.current.children.forEach((horse, i) => {
        horse.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 8 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={racersRef} position={[0, 0.1, 0]}>
      {[0, 1, 2, 3].map(i => {
        const angle = i * ((Math.PI * 2) / 4);
        const radius = 13;
        const horseColor = ["#8c7ae6", "#2f3640", "#d1ccc0", "#a52a2a"][i];
        const jockeyColor = ["#f1c40f", "#3498db", "#e74c3c", "#9b59b6"][i];
        
         return (
          <group key={i} position={[Math.cos(angle)*radius, 0.5, Math.sin(angle)*radius]} rotation={[0, -angle + Math.PI/2, 0]}>
             <group scale={0.5} position={[0,0.5,0]}>
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

               {/* Child Jockey */}
               <mesh castShadow position={[-0.2, 0.8, 0]} rotation={[0, 0, Math.PI/8]}>
                 <cylinderGeometry args={[0.2, 0.2, 0.8, 6]} />
                 <meshStandardMaterial color={jockeyColor} />
               </mesh>
               {/* Jockey Head */}
               <mesh castShadow position={[-0.4, 1.3, 0]}>
                 <sphereGeometry args={[0.3, 4, 4]} />
                 <meshStandardMaterial color="#f5cd79" />
               </mesh>
               {/* Jockey Hat/Bandana */}
               <mesh castShadow position={[-0.4, 1.45, 0]}>
                 <cylinderGeometry args={[0.3, 0.3, 0.15, 6]} />
                 <meshStandardMaterial color={jockeyColor} />
               </mesh>
             </group>
          </group>
        )
      })}
    </group>
  );
}

function Banners() {
  const flagsRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (flagsRef.current) {
        flagsRef.current.children.forEach((flagGroup, i) => {
            const cloth = flagGroup.children[1];
            if (cloth) cloth.rotation.y = Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
        });
    }
  });

  const flags = useMemo(() => Array.from({length: 12}), []);
  return (
    <group ref={flagsRef} position={[0, 0.1, 0]}>
      {flags.map((_, i) => {
        const angle = (i/12)*Math.PI*2;
        return (
          <group key={i} position={[Math.cos(angle)*7.5, 0, Math.sin(angle)*7.5]}>
            <mesh position={[0, 1.5, 0]} castShadow>
               <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
               <meshStandardMaterial color="#7f8c8d" />
            </mesh>
            <mesh position={[0.5, 2.5, 0]} castShadow>
               <planeGeometry args={[1, 0.6]} />
               <meshStandardMaterial color={["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"][i%5]} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </group>
  );
}

function Archers() {
  // Surs targets are small leather cylinders stacked on the ground
  const surs = useMemo(() => Array.from({length: 10}), []);

  return (
    <group position={[0, 0.1, 0]}>
      <group position={[-5, 0, -8]}>
         {/* Sur Targets (leather cylinders in a row) */}
         {surs.map((_, i) => (
           <mesh key={i} castShadow position={[0, 0.15, -4 + i*0.3]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
              <meshStandardMaterial color="#8b4513" />
           </mesh>
         ))}
         
         {/* Archer in Deel and Hat */}
         <mesh castShadow position={[0, 0.7, 0]}><cylinderGeometry args={[0.3, 0.4, 1.4, 6]}/><meshStandardMaterial color="#2980b9"/></mesh>
         {/* Archer Hat (Loovuuz or Malgai) */}
         <mesh castShadow position={[0, 1.5, 0]}><sphereGeometry args={[0.2, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
         <mesh castShadow position={[0, 1.8, 0]}><coneGeometry args={[0.25, 0.3, 6]}/><meshStandardMaterial color="#e74c3c"/></mesh>
         {/* Bow */}
         <mesh castShadow position={[0.4, 1.1, -0.4]} rotation={[0, Math.PI/2, Math.PI/6]}>
            <torusGeometry args={[0.5, 0.05, 4, 16, Math.PI]} />
            <meshStandardMaterial color="#8e44ad" />
         </mesh>
      </group>
    </group>
  );
}

function Crowd() {
  const people = useMemo(() => Array.from({length: 25}), []);
  return (
    <group position={[0, 0.1, 0]}>
       {people.map((_, i) => {
         const angle = (i/25)*Math.PI*2 + 0.2;
         const dist = 8.5; // Sitting in stands
         
         // Leave front gap open
         if (angle > Math.PI*1.2 && angle < Math.PI*1.8) return null;

         return (
           <group key={i} position={[Math.cos(angle)*dist, 0.8, Math.sin(angle)*dist]} rotation={[0, -angle + Math.PI/2, 0]}>
              <mesh castShadow><boxGeometry args={[0.3, 0.6, 0.3]} /><meshStandardMaterial color={["#1abc9c", "#9b59b6", "#e67e22", "#34495e"][i%4]}/></mesh>
              <mesh castShadow position={[0, 0.4, 0]}><sphereGeometry args={[0.15, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
           </group>
         )
       })}
    </group>
  )
}

function Musicians() {
  return (
    <group position={[6, 0.1, 8]} rotation={[0, -Math.PI/6, 0]}>
      {/* Musician seated */}
      <mesh castShadow position={[0, 0.4, 0]}><boxGeometry args={[0.5, 0.8, 0.5]}/><meshStandardMaterial color="#8e44ad"/></mesh>
      <mesh castShadow position={[0, 0.9, 0]}><sphereGeometry args={[0.2, 4, 4]}/><meshStandardMaterial color="#f5cd79"/></mesh>
      {/* Morin Khuur (Horse-head Fiddle) */}
      <mesh castShadow position={[0.2, 0.7, 0.4]} rotation={[Math.PI/6, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.1]}/>
        <meshStandardMaterial color="#c0392b"/>
      </mesh>
      <mesh castShadow position={[0.2, 1.2, 0.4]} rotation={[Math.PI/6, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 6]}/>
        <meshStandardMaterial color="#c0392b"/>
      </mesh>
    </group>
  );
}

function ColorfulGers() {
  return (
    <group position={[0, 0.1, 0]}>
      <Ger position={[9, 0, 5]} color="#e74c3c" />
      <Ger position={[-9, 0, 5]} color="#3498db" />
      <Ger position={[0, 0, 10]} color="#f1c40f" />
    </group>
  );
}

function Ger({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[2, 2, 2, 6]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[2.2, 1, 6]} />
        <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
      </mesh>
      {/* Colorful Trim */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.05, 2.05, 0.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[2.05, 2.05, 0.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function FestivalDust({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;     
        positions[i * 3 + 1] = Math.random() * 8;          
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30; 
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.02; 
        if (positions[i * 3 + 1] > 8) {
           positions[i * 3 + 1] = 0;
           positions[i * 3] = (Math.random() - 0.5) * 30;
           positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
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
        color="#f1c40f"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
