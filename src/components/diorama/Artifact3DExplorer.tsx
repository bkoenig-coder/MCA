import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Sparkles, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Info, RotateCcw, ChevronRight } from 'lucide-react';
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
    category: 'UNESCO Masterpiece of Intangible Heritage',
    unescoYear: '2008 (Orig. 2003)',
    hotspots: [
      {
        id: 'horsehead',
        position: [0, 2.7, 0.15],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.head.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.head.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.head.trad'
      },
      {
        id: 'pegs',
        position: [0, 2.1, 0.2],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.pegs.trad'
      },
      {
        id: 'soundbox',
        position: [0, -0.6, 0.2],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.soundbox.trad'
      },
      {
        id: 'strings',
        position: [0.08, 0.6, 0.25],
        titleKey: 'heritage.artifacts.morinKhuur.hotspots.strings.title',
        descKey: 'heritage.artifacts.morinKhuur.hotspots.strings.desc',
        traditionalNameKey: 'heritage.artifacts.morinKhuur.hotspots.strings.trad'
      }
    ]
  },
  deel: {
    nameKey: 'heritage.artifacts.deel.name',
    subKey: 'heritage.artifacts.deel.sub',
    category: 'Traditional Attire & Living Craftsmanship',
    unescoYear: '2023 Inscription',
    hotspots: [
      {
        id: 'collar',
        position: [0, 1.8, 0.35],
        titleKey: 'heritage.artifacts.deel.hotspots.collar.title',
        descKey: 'heritage.artifacts.deel.hotspots.collar.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.collar.trad'
      },
      {
        id: 'sash',
        position: [0, 0.1, 0.7],
        titleKey: 'heritage.artifacts.deel.hotspots.sash.title',
        descKey: 'heritage.artifacts.deel.hotspots.sash.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.sash.trad'
      },
      {
        id: 'cuffs',
        position: [1.35, 0.6, 0.15],
        titleKey: 'heritage.artifacts.deel.hotspots.cuffs.title',
        descKey: 'heritage.artifacts.deel.hotspots.cuffs.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.cuffs.trad'
      },
      {
        id: 'boots',
        position: [-0.35, -2.1, 0.35],
        titleKey: 'heritage.artifacts.deel.hotspots.boots.title',
        descKey: 'heritage.artifacts.deel.hotspots.boots.desc',
        traditionalNameKey: 'heritage.artifacts.deel.hotspots.boots.trad'
      }
    ]
  },
  naadamBokh: {
    nameKey: 'heritage.artifacts.naadam.name',
    subKey: 'heritage.artifacts.naadam.sub',
    category: 'Naadam Festival & Three Manly Skills',
    unescoYear: '2010',
    hotspots: [
      {
        id: 'zodog',
        position: [0, 1.05, 0.4],
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
        position: [1.3, 0.3, 0.1],
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
        position: [0, 2.3, 0],
        titleKey: 'heritage.artifacts.ger.hotspots.toono.title',
        descKey: 'heritage.artifacts.ger.hotspots.toono.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.toono.trad'
      },
      {
        id: 'uni',
        position: [0.9, 1.35, 0.9],
        titleKey: 'heritage.artifacts.ger.hotspots.uni.title',
        descKey: 'heritage.artifacts.ger.hotspots.uni.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.uni.trad'
      },
      {
        id: 'bagan',
        position: [-0.5, 0.1, 0.5],
        titleKey: 'heritage.artifacts.ger.hotspots.bagan.title',
        descKey: 'heritage.artifacts.ger.hotspots.bagan.desc',
        traditionalNameKey: 'heritage.artifacts.ger.hotspots.bagan.trad'
      },
      {
        id: 'khana',
        position: [1.9, -0.5, 0],
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
      const notes = [220, 277.18, 329.63, 440, 554.37];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
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
// High-Fidelity 3D Models with Accurate Proportions & Details
// ----------------------------------------------------

function MorinKhuur3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.2, 0]}>
      {/* Soundbox Body (Authentic Inverted Trapezoid Shape) */}
      <group position={[0, -0.6, 0]}>
        {/* Main Resonator Box Back & Sides */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 1.7, 0.45]} />
          <meshStandardMaterial color="#6E3714" roughness={0.35} metalness={0.12} />
        </mesh>

        {/* Resonator Soundboard (Cedar/Pine Soundboard Face) */}
        <mesh castShadow position={[0, 0, 0.23]}>
          <boxGeometry args={[1.34, 1.64, 0.04]} />
          <meshStandardMaterial color="#D7A86E" roughness={0.55} />
        </mesh>

        {/* Gold Border Inlay around Soundbox Edge */}
        <mesh position={[0, 0, 0.24]}>
          <ringGeometry args={[0.55, 0.58, 4]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Traditional Curved Soundholes (F-Holes / Soyombo Motif) */}
        <mesh position={[-0.38, 0.1, 0.255]}>
          <planeGeometry args={[0.08, 0.45]} />
          <meshBasicMaterial color="#1a0b04" />
        </mesh>
        <mesh position={[0.38, 0.1, 0.255]}>
          <planeGeometry args={[0.08, 0.45]} />
          <meshBasicMaterial color="#1a0b04" />
        </mesh>

        {/* Wooden Bridge (Tevx) */}
        <mesh castShadow position={[0, -0.2, 0.28]}>
          <boxGeometry args={[0.5, 0.1, 0.08]} />
          <meshStandardMaterial color="#3E1C0A" roughness={0.4} />
        </mesh>

        {/* Tailpiece (Khiluuri) holding bottom strings */}
        <mesh castShadow position={[0, -0.75, 0.24]}>
          <cylinderGeometry args={[0.12, 0.18, 0.22, 8]} />
          <meshStandardMaterial color="#2B1408" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* Slender Hardwood Neck (Ish) */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[0.18, 1.9, 0.22]} />
        <meshStandardMaterial color="#4A2511" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Ebony Fingerboard Strip */}
      <mesh position={[0, 0.85, 0.115]}>
        <boxGeometry args={[0.15, 1.8, 0.02]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.2} />
      </mesh>

      {/* Peg Box & Nut (Chikhnii ger) */}
      <group position={[0, 1.95, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.45, 0.26]} />
          <meshStandardMaterial color="#3B1909" roughness={0.3} />
        </mesh>

        {/* Left Octagonal Tuning Peg (Female string) */}
        <group position={[-0.28, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
        </group>

        {/* Right Octagonal Tuning Peg (Male string) */}
        <group position={[0.28, -0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Intricately Sculpted Horse Head (Tolgoi) */}
      <group position={[0, 2.5, 0]}>
        {/* Arching Neck */}
        <mesh castShadow position={[0, 0.05, 0.08]} rotation={[-Math.PI / 8, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.35, 12]} />
          <meshStandardMaterial color="#8D4E24" roughness={0.3} />
        </mesh>

        {/* Cranium & Brow */}
        <mesh castShadow position={[0, 0.22, 0.18]} rotation={[-Math.PI / 5, 0, 0]}>
          <boxGeometry args={[0.3, 0.32, 0.4]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.6} />
        </mesh>

        {/* Flared Muzzle & Nostrils */}
        <mesh castShadow position={[0, 0.12, 0.42]} rotation={[-Math.PI / 10, 0, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.28]} />
          <meshStandardMaterial color="#C5A028" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Sculpted Alert Ears */}
        <mesh castShadow position={[-0.1, 0.42, 0.1]} rotation={[0, 0, -Math.PI / 7]}>
          <coneGeometry args={[0.05, 0.22, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} />
        </mesh>
        <mesh castShadow position={[0.1, 0.42, 0.1]} rotation={[0, 0, Math.PI / 7]}>
          <coneGeometry args={[0.05, 0.22, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} />
        </mesh>

        {/* Flowing Mane Crest */}
        <mesh castShadow position={[0, 0.24, -0.06]} rotation={[Math.PI / 5, 0, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.25]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.4} />
        </mesh>
      </group>

      {/* Horsehair Strings (Inner Female & Outer Male Strands) */}
      <mesh position={[-0.055, 0.55, 0.24]}>
        <cylinderGeometry args={[0.012, 0.012, 3.1, 6]} />
        <meshStandardMaterial color="#FFF9E6" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.055, 0.55, 0.24]}>
        <cylinderGeometry args={[0.015, 0.015, 3.1, 6]} />
        <meshStandardMaterial color="#FFF3D1" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Traditional Wooden Bow (Num) alongside */}
      <group position={[1.1, 0.35, 0]} rotation={[0, 0, -Math.PI / 14]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 3.2, 8]} />
          <meshStandardMaterial color="#4A2511" roughness={0.3} />
        </mesh>
        <mesh position={[-0.06, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 3.1, 6]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function Deel3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      {/* Main Silk Robe Body (Royal Blue Damask Silk with pleats) */}
      <group position={[0, 0, 0]}>
        {/* Tapered upper robe */}
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.85, 1.15, 1.6, 20]} />
          <meshStandardMaterial color="#0A4B8C" roughness={0.32} metalness={0.18} />
        </mesh>

        {/* Flared lower skirt of the robe */}
        <mesh castShadow receiveShadow position={[0, -0.7, 0]}>
          <cylinderGeometry args={[1.15, 1.55, 1.4, 20]} />
          <meshStandardMaterial color="#0A4B8C" roughness={0.32} metalness={0.18} />
        </mesh>

        {/* Authentic Asymmetrical Double-Breasted Overlap (Övgön Enger) */}
        <mesh castShadow position={[0.15, 0.65, 0.62]} rotation={[0, 0.12, -0.05]}>
          <boxGeometry args={[0.85, 1.35, 0.08]} />
          <meshStandardMaterial color="#073B6F" roughness={0.3} />
        </mesh>

        {/* Gold Brocade Embroidered Trim along the Lapel & Hem (Khövöö) */}
        <mesh castShadow position={[0.55, 0.65, 0.64]} rotation={[0, 0.12, -0.05]}>
          <boxGeometry args={[0.07, 1.35, 0.09]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh castShadow position={[0, -1.38, 0]}>
          <torusGeometry args={[1.54, 0.035, 8, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Silver Filigree Buttons (Tovch) */}
        <mesh position={[0.45, 1.25, 0.7]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.55, 0.85, 0.7]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.62, 0.45, 0.68]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* High Mandarin Collar (Zakh) */}
      <group position={[0, 1.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.45, 0.38, 20]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.43]}>
          <boxGeometry args={[0.15, 0.22, 0.04]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.4} />
        </mesh>
      </group>

      {/* Left Sleeve with Curved Horse-Hoof Cuff (Khuuchir) */}
      <group position={[-1.25, 0.75, 0]} rotation={[0, 0, Math.PI / 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.35, 1.3, 14]} />
          <meshStandardMaterial color="#0A4B8C" roughness={0.32} metalness={0.18} />
        </mesh>
        <mesh castShadow position={[0, -0.75, 0]} rotation={[0, 0, Math.PI / 10]}>
          <cylinderGeometry args={[0.3, 0.2, 0.38, 14]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      {/* Right Sleeve with Horse-Hoof Cuff */}
      <group position={[1.25, 0.75, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.28, 0.35, 1.3, 14]} />
          <meshStandardMaterial color="#0A4B8C" roughness={0.32} metalness={0.18} />
        </mesh>
        <mesh castShadow position={[0, -0.75, 0]} rotation={[0, 0, -Math.PI / 10]}>
          <cylinderGeometry args={[0.3, 0.2, 0.38, 14]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      {/* Amber/Gold Silk Sash (Büs) with Layered Wrap */}
      <group position={[0, 0.15, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.08, 1.12, 0.42, 20]} />
          <meshStandardMaterial color="#E69138" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Sash Drape / Knot on Right Hip */}
        <mesh castShadow position={[0.65, -0.2, 0.85]} rotation={[0, 0, -Math.PI / 12]}>
          <boxGeometry args={[0.28, 0.85, 0.08]} />
          <meshStandardMaterial color="#D97706" roughness={0.35} />
        </mesh>
        {/* Silver Flint Purse Pouch (Khet) hanging from sash */}
        <mesh castShadow position={[-0.6, -0.15, 0.82]}>
          <boxGeometry args={[0.2, 0.22, 0.06]} />
          <meshStandardMaterial color="#4A2511" roughness={0.5} />
        </mesh>
        <mesh position={[-0.6, -0.15, 0.86]}>
          <circleGeometry args={[0.06, 12]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
        </mesh>
      </group>

      {/* Traditional Leather Boots (Gutal with Upturned Toes) */}
      <group position={[-0.4, -2.05, 0.2]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.24, 0.22, 0.75, 12]} />
          <meshStandardMaterial color="#3E2010" roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, -0.12, 0.14]}>
          <boxGeometry args={[0.28, 0.22, 0.58]} />
          <meshStandardMaterial color="#2B1408" roughness={0.6} />
        </mesh>
        {/* Curved Upturned Toe Tip */}
        <mesh castShadow position={[0, -0.02, 0.46]} rotation={[-Math.PI / 4, 0, 0]}>
          <coneGeometry args={[0.15, 0.28, 10]} />
          <meshStandardMaterial color="#1E0D05" roughness={0.5} />
        </mesh>
      </group>

      <group position={[0.4, -2.05, 0.2]}>
        <mesh castShadow position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.24, 0.22, 0.75, 12]} />
          <meshStandardMaterial color="#3E2010" roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, -0.12, 0.14]}>
          <boxGeometry args={[0.28, 0.22, 0.58]} />
          <meshStandardMaterial color="#2B1408" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, -0.02, 0.46]} rotation={[-Math.PI / 4, 0, 0]}>
          <coneGeometry args={[0.15, 0.28, 10]} />
          <meshStandardMaterial color="#1E0D05" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function NaadamBokh3DModel({ activeHotspot }: { activeHotspot: string | null }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      {/* Wrestler Display Torso Mannequin */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.72, 0.52, 1.45, 14]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.7} />
      </mesh>

      {/* Zodog (Open-Chested Silk-Padded Wrestler Vest) */}
      <group position={[0, 1.05, 0]}>
        {/* Back and Shoulder Armor Plate */}
        <mesh castShadow position={[0, 0.08, -0.12]}>
          <boxGeometry args={[1.35, 0.72, 0.48]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.35} />
        </mesh>
        {/* Left & Right Reinforced Short Sleeves */}
        <mesh castShadow position={[-0.82, -0.02, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.26, 0.26, 0.65, 12]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0.82, -0.02, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.26, 0.26, 0.65, 12]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.35} />
        </mesh>
        {/* Front Chest Braided Silk Ties (Elbeg / Zolgoi dây) */}
        <mesh position={[0, -0.22, 0.38]}>
          <torusGeometry args={[0.16, 0.038, 8, 14]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} />
        </mesh>
      </group>

      {/* Shuudag (Wrestler's Blue Trunks) */}
      <group position={[0, -0.22, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.56, 0.46, 0.62, 14]} />
          <meshStandardMaterial color="#0D47A1" roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0, -0.2, 0.44]}>
          <boxGeometry args={[0.72, 0.1, 0.06]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} />
        </mesh>
      </group>

      {/* Pointed Four-Lobed Wrestling Hat (Zolgoi Malgai) */}
      <group position={[0, 1.85, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.35, 0.45, 4]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.3} />
        </mesh>
        {/* Silver Top Finial (Janch) */}
        <mesh castShadow position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} />
        </mesh>
        {/* Red Silk Ribbon Tails */}
        <mesh position={[0, 0, -0.32]} rotation={[Math.PI / 8, 0, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.02]} />
          <meshStandardMaterial color="#DA2032" />
        </mesh>
      </group>

      {/* Mongolian Composite Recurve Bow (Sur Kharvaa) & Arrow */}
      <group position={[1.2, 0.4, 0]} rotation={[0, Math.PI / 6, Math.PI / 4]}>
        <mesh castShadow>
          <torusGeometry args={[1.15, 0.055, 8, 28, Math.PI * 0.92]} />
          <meshStandardMaterial color="#3E1C0A" roughness={0.45} />
        </mesh>
        <mesh position={[-0.05, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 2.1, 6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Feathered Steppe Arrow */}
        <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 1.85, 6]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <coneGeometry args={[0.05, 0.16, 4]} />
            <meshStandardMaterial color="#78909C" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.88, 0]}>
            <boxGeometry args={[0.16, 0.26, 0.02]} />
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
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.3, 0]}>
      {/* Floor Wooden Platform */}
      <mesh receiveShadow position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2.6, 2.6, 0.16, 24]} />
        <meshStandardMaterial color="#7A4E2D" roughness={0.7} />
      </mesh>

      {/* Khana (Lattice Wall Section with diamond mesh illusion) */}
      <group position={[0, -0.4, 0]}>
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x = Math.cos(angle) * 2.25;
          const z = Math.sin(angle) * 2.25;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.07, 1.35, 0.04]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.75} />
            </mesh>
          );
        })}
      </group>

      {/* Ornate Red/Orange Wooden Entrance Door (Khaalga) */}
      <group position={[0, -0.4, 2.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 1.3, 0.08]} />
          <meshStandardMaterial color="#C0392B" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} />
        </mesh>
      </group>

      {/* Bagan (Twin Central Vermilion & Gold Pillars) */}
      <mesh castShadow position={[-0.45, 0.3, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 2.85, 12]} />
        <meshStandardMaterial color="#C0392B" roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0.45, 0.3, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 2.85, 12]} />
        <meshStandardMaterial color="#C0392B" roughness={0.35} />
      </mesh>

      {/* Capital Brackets on Pillars (Möö) */}
      <mesh position={[-0.45, 1.68, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.18]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} />
      </mesh>
      <mesh position={[0.45, 1.68, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.18]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} />
      </mesh>

      {/* Uni (Roof Rafter Poles radiating upwards to Toono) */}
      <group position={[0, 1.2, 0]}>
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r1 = 2.15;
          const r2 = 0.55;
          const x1 = Math.cos(angle) * r1;
          const z1 = Math.sin(angle) * r1;
          const x2 = Math.cos(angle) * r2;
          const z2 = Math.sin(angle) * r2;

          const dx = x2 - x1;
          const dz = z2 - z1;
          const len = Math.sqrt(dx * dx + dz * dz + 0.85 * 0.85);

          return (
            <mesh
              key={i}
              position={[(x1 + x2) / 2, 0.42, (z1 + z2) / 2]}
              rotation={[Math.atan2(dz, 0.85), -angle, Math.PI / 4]}
            >
              <cylinderGeometry args={[0.022, 0.028, len, 6]} />
              <meshStandardMaterial color="#E67E22" roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* Toono (Sacred Crown Wheel at Apex) */}
      <group position={[0, 2.25, 0]}>
        {/* Outer Wheel Ring */}
        <mesh castShadow position={[0, 0, 0]}>
          <torusGeometry args={[0.62, 0.075, 12, 28]} />
          <meshStandardMaterial color="#C0392B" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.62, 0.082, 12, 28]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Cross Spoke Bars (Kharatsa) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.15, 0.038, 0.06]} />
          <meshStandardMaterial color="#C0392B" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.15, 0.038, 0.06]} />
          <meshStandardMaterial color="#C0392B" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.15, 0.038, 0.06]} />
          <meshStandardMaterial color="#C0392B" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[1.15, 0.038, 0.06]} />
          <meshStandardMaterial color="#C0392B" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// Main Component
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

  const renderActiveModel = () => {
    switch (selectedArtifact) {
      case 'morinKhuur':
        return <MorinKhuur3DModel activeHotspot={activeHotspot} />;
      case 'deel':
        return <Deel3DModel activeHotspot={activeHotspot} />;
      case 'naadamBokh':
        return <NaadamBokh3DModel activeHotspot={activeHotspot} />;
      case 'nomadicGer':
        return <NomadicGer3DModel activeHotspot={activeHotspot} />;
      default:
        return <MorinKhuur3DModel activeHotspot={activeHotspot} />;
    }
  };

  return (
    <div className="w-full grid lg:grid-cols-12 gap-8 items-center">
      {/* 3D Canvas Viewport Container */}
      <div className="lg:col-span-7 h-[420px] sm:h-[500px] bg-[#F1F5F9] rounded-2xl overflow-hidden relative border border-slate-200 shadow-inner">
        <Suspense fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F1F5F9] z-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-3" />
            <p className="text-xs font-mono tracking-widest text-slate-700 uppercase">Rendering 3D Artifact...</p>
          </div>
        }>
          <Canvas
            shadows
            camera={{ position: [0, 0.4, 5.2], fov: 42 }}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <color attach="background" args={['#F1F5F9']} />
            <ambientLight intensity={0.9} />
            <directionalLight
              castShadow
              position={[6, 8, 5]}
              intensity={1.4}
              color="#fffdf5"
              shadow-mapSize={[512, 512]}
            />
            <directionalLight position={[-6, -4, -4]} intensity={0.5} color="#dbeafe" />

            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
              {renderActiveModel()}
            </Float>

            {/* Interactive 3D Hotspot Pins on Model */}
            {currentData.hotspots.map((hs) => (
              <group key={hs.id} position={hs.position}>
                <mesh
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(activeHotspot === hs.id ? null : hs.id);
                  }}
                >
                  <sphereGeometry args={[0.09, 16, 16]} />
                  <meshStandardMaterial
                    color={activeHotspot === hs.id ? '#FFFFFF' : '#D4AF37'}
                    emissive={activeHotspot === hs.id ? '#D4AF37' : '#C5A028'}
                    emissiveIntensity={0.6}
                  />
                </mesh>
                <mesh scale={[1.4, 1.4, 1.4]}>
                  <sphereGeometry args={[0.09, 12, 12]} />
                  <meshBasicMaterial
                    color="#D4AF37"
                    wireframe
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              </group>
            ))}

            <ContactShadows position={[0, -2.3, 0]} opacity={0.65} scale={8} blur={2.2} far={4.5} />
            <Sparkles count={25} scale={5} size={1.8} speed={0.3} opacity={0.35} color="#D4AF37" />

            <OrbitControls
              enablePan={false}
              minDistance={3.2}
              maxDistance={7.5}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />

            <Preload all />
          </Canvas>
        </Suspense>

        {/* Viewport Control Hints */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] text-slate-700 font-mono shadow-sm">
          <Info className="w-3 h-3 text-[#D4AF37]" />
          <span>Click & Drag to Rotate 360° • Click gold pins</span>
        </div>

        <button
          onClick={() => setActiveHotspot(null)}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 text-[10px] font-mono backdrop-blur-md border border-slate-200 shadow-sm transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-[#D4AF37]" />
          <span>Reset Pins</span>
        </button>
      </div>

      {/* Curatorial Annotation Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#0A1128] text-[#D4AF37] font-mono text-[10px] font-bold rounded">
              {currentData.unescoYear}
            </span>
            <span className="text-xs text-amber-900 font-mono tracking-wider font-semibold">
              {currentData.category}
            </span>
          </div>

          <h3 className="text-2xl font-serif text-slate-900 font-normal mb-1">
            {t(currentData.nameKey, selectedArtifact === 'morinKhuur' ? 'Morin Khuur' : selectedArtifact === 'deel' ? 'Traditional Deel' : selectedArtifact === 'naadamBokh' ? 'Naadam Sports' : 'Mongolian Ger')}
          </h3>
          <p className="text-xs text-slate-600 font-light leading-relaxed mb-6">
            {t(currentData.subKey, 'Interactive cultural relic study from the Mongolian Center archive.')}
          </p>

          {/* Artifact Selector Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {(Object.keys(ARTIFACT_DATA) as ArtifactId[]).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedArtifact(id);
                  setActiveHotspot(null);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-all flex items-center justify-between border cursor-pointer ${
                  selectedArtifact === id
                    ? 'bg-[#0A1128] text-white border-[#0A1128] font-bold shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-brand-gold hover:text-slate-900'
                }`}
              >
                <span className="truncate">{id === 'morinKhuur' ? 'Morin Khuur' : id === 'deel' ? 'Traditional Deel' : id === 'naadamBokh' ? 'Naadam Bökh & Bow' : 'Nomadic Ger'}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedArtifact === id ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Audio Demonstration Trigger */}
          <button
            onClick={handleAudioClick}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer shadow-sm ${
              isPlayingAudio
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{isPlayingAudio ? 'Playing Acoustic Sample...' : 'Listen to Acoustic Sample'}</span>
          </button>
        </div>

        {/* Hotspot Breakdown Details Box */}
        <div className="pt-5 border-t border-slate-100">
          <AnimatePresence mode="wait">
            {activeHotspot ? (
              <motion.div
                key={activeHotspot}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-slate-900 shadow-sm"
              >
                {(() => {
                  const hs = currentData.hotspots.find((h) => h.id === activeHotspot);
                  if (!hs) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-slate-900 font-serif font-bold text-sm">
                          {t(hs.titleKey, hs.id)}
                        </h4>
                        {hs.traditionalNameKey && (
                          <span className="text-[10px] text-amber-900 font-mono bg-amber-200/70 px-2 py-0.5 rounded font-bold">
                            {t(hs.traditionalNameKey, '')}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-light mt-1.5">
                        {t(hs.descKey, 'Authentic architectural and craftsmanship detail from historical records.')}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="text-slate-500 text-xs font-light flex items-center gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Click any glowing gold pin on the 3D model to reveal anatomical and cultural craftsmanship details.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
