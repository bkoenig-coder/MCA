import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from './ZoneLabel';
import { CinematicFocusLight } from '../CinematicFocusLight';

interface SpiritZoneProps {
  onSelect?: () => void;
  hideLabels?: boolean;
}

export function SpiritZone({ onSelect, hideLabels }: SpiritZoneProps) {
    const [hovered, setHovered] = useState(false);
const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} onClick={onSelect} onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}>
      {/* Base Platform */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[18, 17.5, 1, 32]} />
        <meshStandardMaterial color="#192a56" roughness={0.8} />
      </mesh>
      
      {/* Mystical Grass/Moss Top */}
      <mesh receiveShadow position={[0, 0.01, 0]}>
        <cylinderGeometry args={[18, 18, 0.1, 32]} />
        <meshStandardMaterial color="#2f3640" roughness={0.9} />
      </mesh>

      {/* Gigantic Ancient Sacred Tree / Central Ovoo */}
      <SacredTree position={[0, 0.1, 0]} />

      {/* Shamans and Ritual Fires */}
      <Shaman position={[-6, 0.1, 4]} rotation={[0, Math.PI / 3, 0]} />
      <Shaman position={[6, 0.1, -4]} rotation={[0, -Math.PI / 3, 0]} />
      <Shaman position={[-2, 0.1, -7]} rotation={[0, Math.PI, 0]} />
      
      <RitualFire position={[-4, 0.1, 3]} />
      <RitualFire position={[4, 0.1, -3]} />
      <RitualFire position={[-1, 0.1, -5]} />

      {/* Giant Spirit Wolves */}
      <SpiritWolf position={[-10, 3, -8]} rotation={[0, Math.PI / 4, 0]} />
      <SpiritWolf position={[12, 4, 6]} rotation={[0, -Math.PI / 4, 0]} scale={1.2} />

      {/* Ancestral Horse Riders (Transparent) */}
      <AncestralRiders />

      {/* Floating Runes */}
      <FloatingRunes count={6} />

      {/* Circling Eagles */}
      <CirclingEagles />

      {/* Sacred Deer */}
      <SacredDeer position={[7, 0.1, 8]} rotation={[0, -Math.PI / 6, 0]} />
      <SacredDeer position={[-8, 0.1, 7]} rotation={[0, Math.PI / 4, 0]} />

      {/* Stone Totems */}
      <Totem position={[-8, 0.1, -2]} />
      <Totem position={[9, 0.1, -2]} />
      <Totem position={[0, 0.1, 10]} />

      {/* Floating Lanterns */}
      <FloatingLanterns count={10} />

      {/* Blue Spirit Particles */}
      <SpiritParticles count={50} />

      {/* Northern Lights / Aurora Effect */}
      <AuroraBorealis />

      {/* Cinematic Lighting */}
      <pointLight position={[0, 8, 0]} intensity={3} color="#00a8ff" distance={30} />

      {!hideLabels && (
        <>
          <CinematicFocusLight hovered={hovered} color="#d4af37" position={[0, 8, 0]} />
          <ZoneLabel title="Sky & Spirits" position={[0, 12, 0]} hide={hideLabels} />
        </>
      )}
    </group>
  );
}

function SacredTree({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 1;
    }
  });

  return (
    <group position={position}>
      {/* Massive Trunk */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <cylinderGeometry args={[1.5, 3, 8, 16]} />
        <meshStandardMaterial color="#2d3436" roughness={1} />
      </mesh>
      
      {/* Glowing Roots */}
      <mesh position={[2, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.3, 0.6, 3, 8]} />
        <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-1.5, 0.5, 1.5]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <cylinderGeometry args={[0.3, 0.6, 3, 8]} />
        <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Branches & Spirit Leaves */}
      <mesh position={[0, 9, 0]}>
        <dodecahedronGeometry args={[5, 1]} />
        <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={0.8} transparent opacity={0.7} wireframe />
      </mesh>
      <mesh position={[-3, 8, 2]}>
        <dodecahedronGeometry args={[3, 1]} />
        <meshStandardMaterial color="#4cd137" emissive="#4cd137" emissiveIntensity={0.5} transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[3, 8, -2]}>
        <dodecahedronGeometry args={[3.5, 1]} />
        <meshStandardMaterial color="#9c88ff" emissive="#9c88ff" emissiveIntensity={0.5} transparent opacity={0.6} wireframe />
      </mesh>

      <pointLight ref={glowRef} position={[0, 6, 0]} color="#00a8ff" distance={20} />
      
      {/* Wrapping Khadags */}
      <KhadagRibbons />
    </group>
  );
}

function KhadagRibbons() {
  const ribbons = [];
  for(let i=0; i<6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ribbons.push(
      <mesh key={i} position={[Math.cos(angle)*1.6, 3 + Math.random()*2, Math.sin(angle)*1.6]} rotation={[0, -angle, Math.PI/6]}>
        <planeGeometry args={[0.4, 2]} />
        <meshStandardMaterial color="#00a8ff" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    );
  }
  return <group>{ribbons}</group>;
}

function Shaman({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const staffGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (staffGlowRef.current) {
      staffGlowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Robes */}
      <mesh castShadow position={[0, 1, 0]}>
        <coneGeometry args={[0.6, 2, 16]} />
        <meshStandardMaterial color="#2f3542" />
      </mesh>
      {/* Head / Antler Headdress */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>
      <mesh position={[-0.3, 2.6, 0]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.05, 0.02, 0.6]} />
        <meshStandardMaterial color="#dcdde1" />
      </mesh>
      <mesh position={[0.3, 2.6, 0]} rotation={[0, 0, -Math.PI/4]}>
        <cylinderGeometry args={[0.05, 0.02, 0.6]} />
        <meshStandardMaterial color="#dcdde1" />
      </mesh>
      {/* Staff */}
      <mesh position={[0.6, 1.5, 0.4]} rotation={[Math.PI/8, 0, -Math.PI/8]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#574b90" />
      </mesh>
      <mesh position={[0.8, 3, 0.5]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={staffGlowRef} position={[0.8, 3, 0.5]} color="#00a8ff" distance={5} />
    </group>
  );
}

function RitualFire({ position }: { position: [number, number, number] }) {
  const fireRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.3;
      fireRef.current.rotation.y = state.clock.elapsedTime * 3;
    }
  });

  return (
    <group position={position}>
      {/* Stones */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <torusGeometry args={[0.8, 0.15, 8, 16]} />
        <meshStandardMaterial color="#2f3542" />
      </mesh>
      {/* Blue Fire */}
      <mesh ref={fireRef} position={[0, 0.6, 0]}>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={2} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight position={[0, 1, 0]} color="#00a8ff" distance={8} intensity={2} />
    </group>
  );
}

function SpiritWolf({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Cliff/Rock base */}
      <mesh position={[0, -2, 0]}>
        <dodecahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#2d3436" roughness={1} />
      </mesh>
      
      {/* Wolf Body (Ghostly) */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 1, 2]} />
        <meshStandardMaterial color="#dfe6e9" transparent opacity={0.4} emissive="#00a8ff" emissiveIntensity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 1.2]}>
        <boxGeometry args={[0.6, 0.6, 0.8]} />
        <meshStandardMaterial color="#dfe6e9" transparent opacity={0.4} emissive="#00a8ff" emissiveIntensity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Glowing Eyes */}
      <mesh position={[-0.2, 1.9, 1.6]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#4cd137" emissive="#4cd137" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.2, 1.9, 1.6]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#4cd137" emissive="#4cd137" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function AncestralRiders() {
  const ridersRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ridersRef.current) {
      ridersRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      ridersRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime) * 1;
      
      ridersRef.current.children.forEach((child, i) => {
         // pulse opacity
         const material = (child.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
         if (material) {
           material.opacity = 0.1 + Math.max(0, Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3);
           (child.children[1] as THREE.Mesh).material = material;
         }
      });
    }
  });

  const riders = [];
  for(let i=0; i<3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    riders.push(
      <group key={`rider-${i}`} position={[Math.cos(angle)*12, 0, Math.sin(angle)*12]} rotation={[0, -angle + Math.PI/2, 0]}>
        <mesh position={[0, 1, 0]}>
          <capsuleGeometry args={[0.4, 1.5, 8, 16]} />
          <meshStandardMaterial color="#00a8ff" transparent opacity={0.2} emissive="#00a8ff" emissiveIntensity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 1.2]} />
        </mesh>
      </group>
    );
  }
  return <group ref={ridersRef}>{riders}</group>;
}

function FloatingRunes({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
       groupRef.current.children.forEach((rune, i) => {
          rune.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
          rune.rotation.y += 0.02;
       });
    }
  });

  const runes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => (
      <mesh key={i} position={[(Math.random()-0.5)*25, 2 + Math.random()*8, (Math.random()-0.5)*25]}>
        <torusGeometry args={[0.2 + Math.random()*0.2, 0.05, 4, 4]} />
        <meshStandardMaterial color="#9c88ff" emissive="#9c88ff" emissiveIntensity={1.5} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    ));
  }, [count]);

  return <group ref={groupRef}>{runes}</group>;
}

function CirclingEagles() {
  const eagleRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (eagleRef.current) {
      eagleRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={eagleRef} position={[0, 15, 0]}>
      <mesh position={[10, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 0.4]} />
        <meshBasicMaterial color="#111111" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-8, 2, 5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1, 0.4]} />
        <meshBasicMaterial color="#111111" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SacredDeer({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 0.8, 1.2]} />
        <meshStandardMaterial color="#f5f6fa" transparent opacity={0.6} emissive="#f5f6fa" emissiveIntensity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 1.8, 0.5]}>
        <boxGeometry args={[0.3, 0.4, 0.4]} />
        <meshStandardMaterial color="#f5f6fa" transparent opacity={0.6} emissive="#f5f6fa" emissiveIntensity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Glowing Antlers */}
      <mesh position={[-0.2, 2.2, 0.5]} rotation={[0, 0, Math.PI/6]}>
        <cylinderGeometry args={[0.02, 0.05, 0.8]} />
        <meshStandardMaterial color="#4cd137" emissive="#4cd137" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.2, 2.2, 0.5]} rotation={[0, 0, -Math.PI/6]}>
        <cylinderGeometry args={[0.02, 0.05, 0.8]} />
        <meshStandardMaterial color="#4cd137" emissive="#4cd137" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Totem({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 3, 0.8]} />
        <meshStandardMaterial color="#2f3640" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, 0.41]}>
         <planeGeometry args={[0.4, 0.4]} />
         <meshStandardMaterial color="#00a8ff" emissive="#00a8ff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function FloatingLanterns({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const lanterns = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 15 + 2,
      z: (Math.random() - 0.5) * 30,
      speed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y += lanterns[i].speed;
        child.position.x += Math.sin(state.clock.elapsedTime + lanterns[i].phase) * 0.01;
        if (child.position.y > 20) {
          child.position.y = 0;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {lanterns.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 8]} />
          <meshStandardMaterial color="#ffdd59" emissive="#ffdd59" emissiveIntensity={1.5} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function SpiritParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 35;     
        positions[i * 3 + 1] = Math.random() * 10;          
        positions[i * 3 + 2] = (Math.random() - 0.5) * 35; 
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // swirling motion
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        const angle = Math.atan2(z, x) + 0.005;
        const radius = Math.sqrt(x*x + z*z);
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.02;
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
        color="#00a8ff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AuroraBorealis() {
  const auroraRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (auroraRef.current) {
      auroraRef.current.children.forEach((plane, i) => {
        const material = (plane as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.15;
        plane.position.y = 12 + Math.sin(state.clock.elapsedTime * 0.3 + i) * 1;
      });
    }
  });

  return (
    <group ref={auroraRef} position={[0, 0, -15]}>
      <mesh position={[-10, 12, 0]} rotation={[0, Math.PI/4, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial color="#4cd137" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[10, 14, -5]} rotation={[0, -Math.PI/6, 0]}>
        <planeGeometry args={[40, 10]} />
        <meshBasicMaterial color="#00a8ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
