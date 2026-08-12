import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, ContactShadows, Sparkles, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Info, RotateCcw, Sparkles as SparklesIcon, ShieldCheck, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type ArtifactId = 'morinKhuur' | 'deel' | 'naadamBokh' | 'nomadicGer';

interface Hotspot {
  id: string;
  position: [number, number, number];
  titleKey: string;
  descKey: string;
  traditionalNameKey?: string;
}

const ARTIFACT_DATA: Record<ArtifactId, {
  nameKey: string;
  subKey: string;
  category: string;
  unescoYear: string;
  hotspots: Hotspot[];
}> = {
  morinKhuur: {
    nameKey: 'heritage.artifacts.morinKhuur.name',
    subKey: 'heritage.artifacts.morinKhuur.sub',
    category: 'Intangible Heritage of Humanity',
    unescoYear: '2008',
    hotspots: [
      {
        id: 'horsehead',
        position: [0, 2.8, 0],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.head.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.head.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.head.trad'
      },
      {
        id: 'pegs',
        position: [0, 2.2, 0.25],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.trad'
      },
      {
        id: 'soundbox',
        position: [0, -0.4, 0],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.trad'
      },
      {
        id: 'strings',
        position: [0.15, 0.5, 0.1],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.strings.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.strings.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.strings.trad'
      }
    ]
  },
  deel: {
    nameKey: 'heritage.artifacts.deel.name',
    subKey: 'heritage.artifacts.deel.sub',
    category: 'Traditional Attire & Craftsmanship',
    unescoYear: '2010',
    hotspots: [
      {
        id: 'collar',
        position: [0, 1.8, 0.3],
        titleKey: 'heritage.artifacts.deel.hotspots.collar.title',
        descKey: 'heritage.artifacts.deel.hotspots.collar.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.collar.trad'
      },
      {
        id: 'sash',
        position: [0, 0.2, 0.6],
        titleKey: 'heritage.artifacts.deel.hotspots.sash.title',
        descKey: 'heritage.artifacts.deel.hotspots.sash.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.sash.trad'
      },
      {
        id: 'cuffs',
        position: [1.4, 0.8, 0.1],
        titleKey: 'heritage.artifacts.deel.hotspots.cuffs.title',
        descKey: 'heritage.artifacts.deel.hotspots.cuffs.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.cuffs.trad'
      },
      {
        id: 'boots',
        position: [-0.4, -2.1, 0.4],
        titleKey: 'heritage.artifacts.deel.hotspots.boots.title',
        descKey: 'heritage.artifacts.deel.hotspots.boots.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.boots.trad'
      }
    ]
  },
  naadamBokh: {
    nameKey: 'heritage.artifacts.naadam.name',
    subKey: 'heritage.artifacts.naadam.sub',
    category: 'Naadam Festival & Traditional Sports',
    unescoYear: '2010',
    hotspots: [
      {
        id: 'zodog',
        position: [0, 1.1, 0.4],
        titleKey: 'heritage.artifacts.naadam.hotspots.zodog.title',
        descKey: 'heritage.artifacts.naadam.hotspots.zodog.desc',
        traditionalNameKey: 'heritage.artifacts.naadam.hotspots.zodog.trad'
      },
      {
        id: 'shudag',
        position: [0, -0.2, 0.4],
        titleKey: 'heritage.artifacts.naadam.hotspots.shudag.title',
        descKey: 'heritage.artifacts.naadam.hotspots.shudag.desc',
        traditionalNameKey: 'heritage.artifacts.naadam.hotspots.shudag.trad'
      },
      {
        id: 'bow',
        position: [1.2, 0.4, -0.2],
        titleKey: 'heritage.artifacts.naadam.hotspots.bow.title',
        descKey: 'heritage.artifacts.naadam.hotspots.bow.desc',
        traditionalNameKey: 'heritage.artifacts.naadam.hotspots.bow.trad'
      }
    ]
  },
  nomadicGer: {
    nameKey: 'heritage.artifacts.ger.name',
    subKey: 'heritage.artifacts.ger.sub',
    category: 'Craftsmanship of the Mongolian Ger',
    unescoYear: '2013',
    hotspots: [
      {
        id: 'toono',
        position: [0, 2.4, 0],
        titleKey: 'heritage.artifacts.ger.hotspots.toono.title',
        descKey: 'heritage.artifacts.ger.hotspots.toono.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.toono.trad'
      },
      {
        id: 'uni',
        position: [0.9, 1.4, 0.9],
        titleKey: 'heritage.artifacts.ger.hotspots.uni.title',
        descKey: 'heritage.artifacts.ger.hotspots.uni.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.uni.trad'
      },
      {
        id: 'bagan',
        position: [-0.6, 0.2, 0.6],
        titleKey: 'heritage.artifacts.ger.hotspots.bagan.title',
        descKey: 'heritage.artifacts.ger.hotspots.bagan.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.bagan.trad'
      },
      {
        id: 'khana',
        position: [1.8, -0.5, 0],
        titleKey: 'heritage.artifacts.ger.hotspots.khana.title',
        descKey: 'heritage.artifacts.ger.hotspots.khana.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.khana.trad'
      }
    ]
  }
};

// Web Audio sound synthesizer for realistic traditional sound preview
function playAudioPreview(artifactId: ArtifactId) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (artifactId === 'morinKhuur') {
      // Pentatonic folk chord sound on Morin Khuur
      const notes = [220, 277.18, 329.63, 440, 554.37];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
        // Filter for warm wooden acoustic body timbre
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 2.0);
      });
    } else if (artifactId === 'naadamBokh') {
      // Recurve bow string release sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // Deep overtone sound for Deel and Ger
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(165, ctx.currentTime + 0.8);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 1.6);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    }
  } catch (e) {
    console.warn('Audio context unavailable:', e);
  }
}

// ----------------------------------------------------
// 3D Procedural Models for UNESCO Items
// ----------------------------------------------------

function MorinKhuur3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.2, 0]}>
      {/* Soundbox (Trapezoidal resonator body) */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.8, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Soundbox Face (Lighter wood plate) */}
      <mesh castShadow position={[0, -0.4, 0.26]}>
        <planeGeometry args={[1.4, 1.7]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} />
      </mesh>
      {/* Sound Holes (F-holes styled) */}
      <mesh position={[-0.4, -0.4, 0.27]}>
        <planeGeometry args={[0.1, 0.6]} />
        <meshBasicMaterial color="#1a0f0a" />
      </mesh>
      <mesh position={[0.4, -0.4, 0.27]}>
        <planeGeometry args={[0.1, 0.6]} />
        <meshBasicMaterial color="#1a0f0a" />
      </mesh>
      {/* Bridge */}
      <mesh castShadow position={[0, -0.6, 0.3]}>
        <boxGeometry args={[0.6, 0.12, 0.1]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Neck (Long wood column) */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.2, 2.0, 0.25]} />
        <meshStandardMaterial color="#5D4037" roughness={0.3} />
      </mesh>

      {/* Peg Box */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.3]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      {/* Tuning Pegs */}
      <mesh castShadow position={[-0.35, 2.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} />
      </mesh>
      <mesh castShadow position={[0.35, 2.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} />
      </mesh>

      {/* Carved Horse Head Top */}
      <group position={[0, 2.8, 0]}>
        {/* Head Block */}
        <mesh castShadow position={[0, 0.1, 0.15]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.35, 0.45, 0.5]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Snout */}
        <mesh castShadow position={[0, 0.0, 0.45]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.3, 0.35]} />
          <meshStandardMaterial color="#C5A028" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Ears */}
        <mesh castShadow position={[-0.12, 0.38, 0.05]} rotation={[0, 0, -Math.PI / 8]}>
          <coneGeometry args={[0.06, 0.25, 6]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} />
        </mesh>
        <mesh castShadow position={[0.12, 0.38, 0.05]} rotation={[0, 0, Math.PI / 8]}>
          <coneGeometry args={[0.06, 0.25, 6]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} />
        </mesh>
        {/* Mane */}
        <mesh castShadow position={[0, 0.2, -0.15]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.3]} />
          <meshStandardMaterial color="#211" />
        </mesh>
      </group>

      {/* Horsehair Strings (Male & Female strands) */}
      <mesh position={[-0.08, 0.5, 0.28]}>
        <cylinderGeometry args={[0.015, 0.015, 3.2, 6]} />
        <meshBasicMaterial color="#FFF8DC" />
      </mesh>
      <mesh position={[0.08, 0.5, 0.28]}>
        <cylinderGeometry args={[0.012, 0.012, 3.2, 6]} />
        <meshBasicMaterial color="#F5F5DC" />
      </mesh>

      {/* Horsehair Bow resting alongside */}
      <group position={[1.0, 0.3, 0]} rotation={[0, 0, -Math.PI / 12]}>
        {/* Bow Stick */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.4, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        {/* Bow Hair */}
        <mesh position={[-0.06, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 3.3, 6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

function Deel3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      {/* Body Robe (Traditional Blue Imperial Silk) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.5, 3.2, 16]} />
        <meshStandardMaterial color="#0055A5" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Double-Breasted Overlap Flap */}
      <mesh castShadow position={[0.1, 0.6, 0.7]} rotation={[0, 0.1, -0.05]}>
        <boxGeometry args={[0.9, 1.5, 0.1]} />
        <meshStandardMaterial color="#003D7A" roughness={0.3} />
      </mesh>
      {/* Gold Trim Borders */}
      <mesh castShadow position={[0.55, 0.6, 0.72]}>
        <boxGeometry args={[0.08, 1.5, 0.12]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* High Mandarin Collar */}
      <mesh castShadow position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.42, 0.45, 0.4, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.75, 0.41]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#C5A028" metalness={0.9} />
      </mesh>

      {/* Sleeves */}
      <group position={[-1.2, 0.8, 0]} rotation={[0, 0, Math.PI / 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.38, 1.4, 12]} />
          <meshStandardMaterial color="#0055A5" roughness={0.3} />
        </mesh>
        {/* Horse-Hoof Shaped Cuff (Khuuchir) */}
        <mesh castShadow position={[0, -0.8, 0]} rotation={[0, 0, Math.PI / 12]}>
          <cylinderGeometry args={[0.32, 0.22, 0.4, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} />
        </mesh>
      </group>

      <group position={[1.2, 0.8, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.38, 1.4, 12]} />
          <meshStandardMaterial color="#0055A5" roughness={0.3} />
        </mesh>
        {/* Horse-Hoof Cuff */}
        <mesh castShadow position={[0, -0.8, 0]} rotation={[0, 0, -Math.PI / 12]}>
          <cylinderGeometry args={[0.32, 0.22, 0.4, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} />
        </mesh>
      </group>

      {/* Metallic Silk Sash (Büs) */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.05, 1.1, 0.45, 16]} />
        <meshStandardMaterial color="#E69138" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Sash Knot & Hanging Ribbons */}
      <mesh castShadow position={[0.5, 0.1, 0.9]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.25, 0.9, 0.1]} />
        <meshStandardMaterial color="#E69138" />
      </mesh>

      {/* Traditional Leather Boots (Gutal with upturned toes) */}
      <group position={[-0.4, -2.0, 0.2]}>
        {/* Leg shaft */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.8, 10]} />
          <meshStandardMaterial color="#4A2511" roughness={0.6} />
        </mesh>
        {/* Foot base */}
        <mesh castShadow position={[0, -0.15, 0.15]}>
          <boxGeometry args={[0.3, 0.25, 0.6]} />
          <meshStandardMaterial color="#361A0C" roughness={0.5} />
        </mesh>
        {/* Upturned Toe Tip */}
        <mesh castShadow position={[0, -0.05, 0.48]} rotation={[-Math.PI / 4, 0, 0]}>
          <coneGeometry args={[0.16, 0.3, 8]} />
          <meshStandardMaterial color="#2B1408" roughness={0.4} />
        </mesh>
      </group>

      <group position={[0.4, -2.0, 0.2]}>
        <mesh castShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.8, 10]} />
          <meshStandardMaterial color="#4A2511" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, -0.15, 0.15]}>
          <boxGeometry args={[0.3, 0.25, 0.6]} />
          <meshStandardMaterial color="#361A0C" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, -0.05, 0.48]} rotation={[-Math.PI / 4, 0, 0]}>
          <coneGeometry args={[0.16, 0.3, 8]} />
          <meshStandardMaterial color="#2B1408" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function NaadamBokh3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.15;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      {/* Wrestler Mannequin Torso */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 1.4, 12]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.7} />
      </mesh>

      {/* Zodog (Short-sleeved Open-chested Vest) */}
      <group position={[0, 1.1, 0]}>
        {/* Back and Shoulder harness */}
        <mesh castShadow position={[0, 0.1, -0.1]}>
          <boxGeometry args={[1.3, 0.7, 0.5]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.3} />
        </mesh>
        {/* Sleeves */}
        <mesh castShadow position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.25, 0.25, 0.6, 10]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        <mesh castShadow position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.25, 0.25, 0.6, 10]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        {/* Front tied cords */}
        <mesh position={[0, -0.2, 0.36]}>
          <torusGeometry args={[0.15, 0.04, 8, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
      </group>

      {/* Shudag (Briefs/Trunks) */}
      <mesh castShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 0.6, 12]} />
        <meshStandardMaterial color="#0D47A1" roughness={0.4} />
      </mesh>
      {/* Decorative Silk Trim */}
      <mesh castShadow position={[0, -0.2, 0.42]}>
        <boxGeometry args={[0.7, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} />
      </mesh>

      {/* Mongolian Composite Archery Bow */}
      <group position={[1.1, 0.4, 0]} rotation={[0, Math.PI / 6, Math.PI / 4]}>
        {/* Recurve Horn Bow Limb */}
        <mesh castShadow>
          <torusGeometry args={[1.1, 0.05, 8, 24, Math.PI * 0.9]} />
          <meshStandardMaterial color="#3E2723" roughness={0.5} />
        </mesh>
        {/* Bow String */}
        <mesh position={[-0.05, 0.0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 2.0, 6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Feathered Arrow */}
        <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 6]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          {/* Arrowhead */}
          <mesh position={[0, 0.95, 0]}>
            <coneGeometry args={[0.05, 0.15, 4]} />
            <meshStandardMaterial color="#78909C" metalness={0.9} />
          </mesh>
          {/* Fletching Feathers */}
          <mesh position={[0, -0.85, 0]}>
            <boxGeometry args={[0.15, 0.25, 0.02]} />
            <meshStandardMaterial color="#E65100" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function NomadicGer3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.3, 0]}>
      {/* Floor Wooden Platform */}
      <mesh receiveShadow position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.15, 16]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.7} />
      </mesh>

      {/* Khana (Lattice Wall Section) */}
      <group position={[0, -0.4, 0]}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 2.2;
          const z = Math.sin(angle) * 2.2;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.08, 1.3, 0.05]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* Bagan (Twin Central Pillars) */}
      <mesh castShadow position={[-0.4, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 2.8, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.3} />
      </mesh>
      <mesh castShadow position={[0.4, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 2.8, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.3} />
      </mesh>

      {/* Uni (Exploded Roof Rafter Poles radiating upwards) */}
      <group position={[0, 1.2, 0]}>
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r1 = 2.1;
          const r2 = 0.5;
          const x1 = Math.cos(angle) * r1;
          const z1 = Math.sin(angle) * r1;
          const x2 = Math.cos(angle) * r2;
          const z2 = Math.sin(angle) * r2;

          const dx = x2 - x1;
          const dz = z2 - z1;
          const len = Math.sqrt(dx * dx + dz * dz + 0.8 * 0.8);

          return (
            <mesh
              key={i}
              position={[(x1 + x2) / 2, 0.4, (z1 + z2) / 2]}
              rotation={[Math.atan2(dz, 0.8), -angle, Math.PI / 4]}
            >
              <cylinderGeometry args={[0.025, 0.03, len, 6]} />
              <meshStandardMaterial color="#E65100" />
            </mesh>
          );
        })}
      </group>

      {/* Toono (Ornate Crown Wheel at Top) */}
      <group position={[0, 2.2, 0]}>
        {/* Outer Crown Ring */}
        <mesh castShadow position={[0, 0, 0]}>
          <torusGeometry args={[0.6, 0.08, 12, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Inner Cross Spoke Wheels */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.06]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.06]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.06]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.06]} />
          <meshStandardMaterial color="#B71C1C" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// Main Component Definition
// ----------------------------------------------------

export default function Artifact3DExplorer() {
  const { t } = useTranslation();
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactId>('morinKhuur');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentData = ARTIFACT_DATA[selectedArtifact];

  const handleAudioClick = () => {
    setIsPlayingAudio(true);
    playAudioPreview(selectedArtifact);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  return (
    <div className="w-full bg-slate-950 rounded-3xl overflow-hidden border border-amber-900/30 shadow-2xl flex flex-col lg:flex-row min-h-[600px] relative">
      
      {/* Left Sidebar: Selector & Info Controls */}
      <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 z-10 bg-slate-900/80 backdrop-blur-md">
        <div>
          {/* Header Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              UNESCO Living Heritage
            </span>
            <span className="text-white/40 text-xs font-mono">EST. {currentData.unescoYear}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif text-white font-semibold mb-2 leading-tight">
            {t(currentData.nameKey, selectedArtifact)}
          </h2>
          <p className="text-amber-400/90 text-xs font-medium uppercase tracking-wider mb-6">
            {t(currentData.subKey, currentData.category)}
          </p>

          {/* Artifact Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {(Object.keys(ARTIFACT_DATA) as ArtifactId[]).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedArtifact(id);
                  setActiveHotspot(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all flex items-center justify-between border cursor-pointer ${
                  selectedArtifact === id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{t(`heritage.artifacts.${id}.shortName`, id)}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedArtifact === id ? 'text-slate-950' : 'text-white/40'}`} />
              </button>
            ))}
          </div>

          {/* Audio Guide & Interactive Hint */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAudioClick}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-slate-950 animate-bounce" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isPlayingAudio ? t('heritage.audioPlaying', 'Playing Audio Sample...') : t('heritage.playAudio', 'Audio Sample & Narration')}</span>
            </button>
          </div>
        </div>

        {/* Hotspot Breakdown Details Box */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <AnimatePresence mode="wait">
            {activeHotspot ? (
              <motion.div
                key={activeHotspot}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4"
              >
                {(() => {
                  const hs = currentData.hotspots.find((h) => h.id === activeHotspot);
                  if (!hs) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-amber-300 font-bold text-sm font-serif">
                          {t(hs.titleKey, hs.id)}
                        </h4>
                        {hs.traditionalNameKey && (
                          <span className="text-[10px] text-amber-400/80 font-mono bg-amber-400/10 px-2 py-0.5 rounded">
                            {t(hs.traditionalNameKey, '')}
                          </span>
                        )}
                      </div>
                      <p className="text-white/80 text-xs leading-relaxed font-light mt-2">
                        {t(hs.descKey, 'Interactive detail about this portion of the cultural heritage artifact.')}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="text-white/50 text-xs font-light flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('heritage.hotspotHint', 'Click any pulsing 3D pin on the model to reveal historical craftsmanship details.')}</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Canvas: 360 Interactive 3D Viewer */}
      <div className="lg:w-2/3 h-[450px] lg:h-auto relative bg-radial from-slate-900 to-slate-950 flex items-center justify-center">
        
        {/* Top Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setActiveHotspot(null)}
            className="p-2 rounded-full bg-slate-900/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions Banner */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-900/70 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm text-[11px] text-white/70 font-light flex items-center gap-2">
          <SparklesIcon className="w-3 h-3 text-amber-400" />
          <span>{t('heritage.canvasControls', '360° Interactive View — Drag to Rotate, Scroll to Zoom')}</span>
        </div>

        {/* Three.js Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          gl={{ powerPreference: 'high-performance', antialias: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#0b1329']} />
          <fog attach="fog" args={['#0b1329', 8, 20]} />

          {/* Warm Studio Lights */}
          <ambientLight intensity={0.7} />
          <directionalLight
            castShadow
            position={[5, 8, 5]}
            intensity={1.5}
            color="#fff8e7"
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-4, 2, -3]} intensity={0.8} color="#0077ff" />
          <pointLight position={[3, -2, 2]} intensity={1.0} color="#ff9900" />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {/* Render 3D Model based on active selection */}
            <Suspense fallback={null}>
              {selectedArtifact === 'morinKhuur' && <MorinKhuur3DModel activeHotspot={activeHotspot} />}
              {selectedArtifact === 'deel' && <Deel3DModel activeHotspot={activeHotspot} />}
              {selectedArtifact === 'naadamBokh' && <NaadamBokh3DModel activeHotspot={activeHotspot} />}
              {selectedArtifact === 'nomadicGer' && <NomadicGer3DModel activeHotspot={activeHotspot} />}
            </Suspense>

            {/* Hotspot HTML 3D Markers */}
            {currentData.hotspots.map((hs) => {
              const isSelected = activeHotspot === hs.id;
              return (
                <group key={hs.id} position={hs.position}>
                  <Html center distanceFactor={8}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(isSelected ? null : hs.id);
                      }}
                      className={`relative group flex items-center justify-center transition-all cursor-pointer ${
                        isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                      }`}
                    >
                      {/* Pulse Ring */}
                      <span className={`absolute w-7 h-7 rounded-full animate-ping opacity-75 ${isSelected ? 'bg-amber-400' : 'bg-amber-500'}`} />
                      
                      {/* Main Button Pin */}
                      <span className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg border transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-white'
                          : 'bg-slate-900/90 text-amber-400 border-amber-500/60 hover:bg-amber-500 hover:text-slate-950'
                      }`}>
                        +
                      </span>
                    </button>
                  </Html>
                </group>
              );
            })}
          </Float>

          {/* Ambient Dust & Floor Shadows */}
          <Sparkles count={120} scale={[10, 8, 10]} size={3} speed={0.4} color="#ffd700" opacity={0.4} />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={8} blur={2.5} far={4} color="#000000" />

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={3}
            maxDistance={9}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
          />
          <Preload all />
        </Canvas>
      </div>

    </div>
  );
}
