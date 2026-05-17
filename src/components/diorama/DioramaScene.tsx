import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ImperialZone, Brazier } from './vignettes/ImperialZone';
import { NomadicZone } from './vignettes/NomadicZone';
import { NaadamZone } from './vignettes/NaadamZone';
import { ZoneLabel } from './vignettes/ZoneLabel';
import { CinematicFocusLight } from './CinematicFocusLight';

interface DioramaSceneProps {
  onSelect: (id: string) => void;
  hideLabels?: boolean;
}

export function DioramaScene({ onSelect, hideLabels }: DioramaSceneProps) {
  const archipelagoRef = useRef<THREE.Group>(null);
  const [centerHovered, setCenterHovered] = useState(false);

  // Subtle floating animation for the whole archipelago
  useFrame((state) => {
    if (archipelagoRef.current) {
      archipelagoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group ref={archipelagoRef}>
      
      {/* Cinematic Fog / Dust Elements */}
      <Sparkles count={1000} scale={[45, 15, 45]} size={6} speed={0.3} color="#a2bcfc" opacity={0.5} position={[0, 6, 0]} noise={1.5} />
      
      {/* Central Hub Island (State Suld / Flags) */}
      <group position={[0, 0, 0]} onClick={() => onSelect('center')} onPointerOver={(e) => { e.stopPropagation(); setCenterHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={(e) => { setCenterHovered(false); document.body.style.cursor = 'auto'; }}>
         <mesh receiveShadow position={[0, -2, 0]}>
           <cylinderGeometry args={[4, 2.5, 4, 8]} />
           <meshStandardMaterial color="#5c4033" roughness={0.9} />
         </mesh>
         <mesh receiveShadow position={[0, 0.01, 0]}>
           <cylinderGeometry args={[4, 4, 0.1, 8]} />
           <meshStandardMaterial color="#538032" roughness={0.8} />
         </mesh>
         <NineWhiteBanners />
         
         <Brazier position={[0, 0.1, 0]} />
         
         <pointLight position={[0, 5, 0]} intensity={2.5} color="#ffaa00" distance={20} />
         {!hideLabels && (
           <>
             <CinematicFocusLight hovered={centerHovered} color="#d4af37" position={[0, 5, 0]} />
             <ZoneLabel 
               title="Nine White Banners" 
               description="The Spirit of the State"
               position={[0, 6, 0]} 
               hide={hideLabels} 
             />
           </>
         )}
      </group>

      {/* Nomadic Village Island (South-West) */}
      <group position={[-12, -1, 12]}>
         <mesh receiveShadow position={[0, -2, 0]}>
           <cylinderGeometry args={[11, 8, 4, 8]} />
           <meshStandardMaterial color="#5c4033" roughness={0.9} />
         </mesh>
         <mesh receiveShadow position={[0, 0.01, 0]}>
           <cylinderGeometry args={[11, 11, 0.1, 8]} />
           <meshStandardMaterial color="#538032" roughness={0.8} />
         </mesh>
         <NomadicZone onSelect={() => onSelect('nomadic')} hideLabels={hideLabels} />
      </group>

      {/* Imperial Court Island (East) */}
      <group position={[16, 2, 2]}>
         <mesh receiveShadow position={[0, -2, 0]}>
           <cylinderGeometry args={[12.5, 9, 4, 8]} />
           <meshStandardMaterial color="#5c4033" roughness={0.9} />
         </mesh>
         <mesh receiveShadow position={[0, 0.01, 0]}>
           <cylinderGeometry args={[12.5, 12.5, 0.1, 8]} />
           <meshStandardMaterial color="#538032" roughness={0.8} />
         </mesh>
         <ImperialZone onSelect={() => onSelect('imperial')} hideLabels={hideLabels} />
      </group>

      {/* Naadam Festival Island (North) */}
      <group position={[-2, 1, -16]}>
         <mesh receiveShadow position={[0, -2, 0]}>
           <cylinderGeometry args={[10, 7, 4, 8]} />
           <meshStandardMaterial color="#5c4033" roughness={0.9} />
         </mesh>
         <mesh receiveShadow position={[0, 0.01, 0]}>
           <cylinderGeometry args={[10, 10, 0.1, 8]} />
           <meshStandardMaterial color="#538032" roughness={0.8} />
         </mesh>
         <NaadamZone onSelect={() => onSelect('naadam')} hideLabels={hideLabels} />
      </group>

      {/* Flying Eagle weaving through the islands */}
      <FlyingEagle />
      
      {/* Subtle floating volumetric fog planes */}
      <CinematicPatchyFog />
      
      {/* Decorative Bridges / Floating Rocks */}
      <DecorativeElements />
    </group>
  );
}

function CinematicPatchyFog() {
  const fogRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (fogRef.current) {
      fogRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      fogRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 1;
    }
  });

  return (
    <group ref={fogRef} position={[0, -2, 0]}>
      {/* Several large transparent planes floating for a low-cost volumetric fog effect */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(i * Math.PI * 2 / 8) * 15,
            Math.random() * 2 + 1,
            Math.cos(i * Math.PI * 2 / 8) * 15
          ]}
          rotation={[Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <planeGeometry args={[35, 35]} />
          <meshBasicMaterial 
            color="#a2bcfc" 
            transparent 
            opacity={0.012} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function DecorativeElements() {
  return (
    <group>
      {/* Floating steps from Center to Imperial Island */}
      <mesh position={[6, 0.5, 0.5]}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#7a8b7a" />
      </mesh>
      <mesh position={[10, 1.2, 1]}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#7a8b7a" />
      </mesh>

      {/* Floating steps from Center to Nomadic Island */}
      <mesh position={[-5, -0.2, 5]}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#6a7a6a" />
      </mesh>
      <mesh position={[-8, -0.5, 8]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#6a7a6a" />
      </mesh>

      {/* Floating steps from Center to Naadam Island */}
      <mesh position={[-1, 0.4, -6]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#8a9a8a" />
      </mesh>
      <mesh position={[-1.5, 0.7, -10]}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#8a9a8a" />
      </mesh>
    </group>
  );
}

function FlyingEagle() {
  const eagleRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (eagleRef.current) {
      const time = state.clock.elapsedTime * 0.3;
      // Fly in a wide circle around the archipelago
      eagleRef.current.position.x = Math.cos(time) * 18;
      eagleRef.current.position.z = Math.sin(time) * 18;
      eagleRef.current.position.y = 12 + Math.sin(time * 2) * 2;
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
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
        <meshStandardMaterial color="#4a3b2c" />
      </mesh>
      {/* Left Wing */}
      <mesh position={[0.5, 0, -0.2]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[2, 0.05, 0.6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Right Wing */}
      <mesh position={[-0.5, 0, -0.2]} rotation={[0, 0, Math.PI / 8]}>
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
        <coneGeometry args={[0.08, 0.2, 6]} />
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
          <coneGeometry args={[0.04, 0.25, 6]} />
          <meshBasicMaterial ref={innerMatRef} color="#ffffff" />
        </mesh>
        
        {/* Outer mid-orange flame */}
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.08, 0.35, 6]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        
        {/* Licking side flame 1 */}
        <mesh position={[-0.03, 0.05, 0.02]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.05, 0.2, 6]} />
          <meshBasicMaterial color="#ff5500" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* Licking side flame 2 */}
        <mesh position={[0.03, 0.06, -0.02]} rotation={[0.1, 0, -0.2]}>
          <coneGeometry args={[0.04, 0.25, 6]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      
      {/* Base ambient glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.12, 4, 4]} />
        <meshBasicMaterial ref={outerMatRef} color={isCenter ? "#ff2200" : "#ff1100"} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
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
        <coneGeometry args={[0.08, 0.4, 6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      {/* Center Pole */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.6, 6]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Ring & White Horse Hair */}
      <mesh castShadow position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 6]} />
        <meshStandardMaterial color="#f8f9fa" roughness={1} />
      </mesh>
      {/* Platform/Tier below the hair */}
      <mesh castShadow position={[0, 3.6, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 6]} />
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
          <coneGeometry args={[0.05, 0.3, 6]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </mesh>
        {/* Pole */}
        <mesh castShadow position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.6, 6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {/* Ring & White Horse Hair */}
        <mesh castShadow position={[0, 2.1, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.8, 6]} />
          <meshStandardMaterial color="#f8f9fa" roughness={1} />
        </mesh>
        {/* Platform top */}
        <mesh castShadow position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.05, 6]} />
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
        <cylinderGeometry args={[1.8, 2, 0.2, 6]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 6]} />
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

