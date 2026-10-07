import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../noise';
import { MOODS, Mood } from './moods';

/** A soft, round puff drawn once on a canvas: no image files needed. */
function makePuffTexture() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A sea of cloud below and around the floating islands. */
export function CloudSea({ mood, count = 90 }: { mood: Mood; count?: number }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => makePuffTexture(), []);
  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  const n = coarse ? Math.round(count * 0.5) : count;

  const puffs = useMemo(() => {
    const rnd = mulberry32(42);
    return Array.from({ length: n }, () => {
      const a = rnd() * Math.PI * 2;
      const r = 10 + rnd() * 110;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: -17 + rnd() * 12,
        s: 22 + rnd() * 40,
        o: 0.6 + rnd() * 0.35,
        shade: rnd() < 0.45,
        sp: 0.02 + rnd() * 0.04,
        ph: rnd() * 6.28,
      };
    });
  }, [n]);

  const color = useMemo(() => new THREE.Color(MOODS[mood].cloud), []);
  const shade = useMemo(() => new THREE.Color(MOODS[mood].cloudShade), []);
  const target = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-delta * 2);
    color.lerp(target.set(MOODS[mood].cloud), k);
    shade.lerp(target.set(MOODS[mood].cloudShade), k);
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const p = puffs[i];
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial;
      mat.color.copy(p.shade ? shade : color);
      child.position.x = p.x + Math.sin(state.clock.elapsedTime * p.sp + p.ph) * 3;
      child.position.z = p.z + Math.cos(state.clock.elapsedTime * p.sp * 0.8 + p.ph) * 3;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} position={[p.x, p.shade ? p.y - 4 : p.y, p.z]} scale={[p.s, p.s * 0.55, 1]}>
          <spriteMaterial map={tex} transparent opacity={p.o} depthWrite={false} fog={false} color={p.shade ? MOODS[mood].cloudShade : MOODS[mood].cloud} />
        </sprite>
      ))}
    </group>
  );
}
