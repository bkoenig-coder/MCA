import { ReactNode, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fbm, mulberry32, smoothstep } from './noise';

const windUniform = { value: 0 };

/** Grass that sways in the wind: a plain standard material with a small vertex tweak. */
function useGrassMaterial() {
  return useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, vertexColors: false });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uWind = windUniform;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uWind;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float sway = max(position.y, 0.0);
          vec3 instPos = vec3(instanceMatrix[3][0], 0.0, instanceMatrix[3][2]);
          float phase = instPos.x * 0.35 + instPos.z * 0.27;
          transformed.x += sin(uWind * 1.6 + phase) * sway * 0.9;
          transformed.z += cos(uWind * 1.3 + phase * 1.3) * sway * 0.5;`
        );
    };
    return mat;
  }, []);
}

/**
 * A floating island: a gently rolling grass top with a rocky rim, jagged cliffs underneath,
 * swaying grass, small flowers and rocks. The walkable top stays flat near the middle (y = 0)
 * so everything placed on it sits correctly.
 */
export function Island({
  radius,
  tip = 0.55,
  seed = 1,
  depth = 5,
  grass = 900,
  children,
}: {
  radius: number;
  /** radius of the underside tip as a share of the top radius */
  tip?: number;
  seed?: number;
  depth?: number;
  grass?: number;
  children?: ReactNode;
}) {
  const topGeo = useMemo(() => {
    const rings = 28;
    const segs = 72;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const grassA = new THREE.Color('#4f8a35');
    const grassB = new THREE.Color('#7aa545');
    const dry = new THREE.Color('#a39a52');
    const earth = new THREE.Color('#6b5237');
    const tmp = new THREE.Color();
    pos.push(0, 0.02, 0);
    col.push(grassA.r, grassA.g, grassA.b);
    for (let i = 1; i <= rings; i++) {
      const r = (i / rings) * radius;
      for (let j = 0; j < segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const edge = smoothstep(0.8, 1, r / radius);
        const rim = fbm(x * 0.35 + 9, z * 0.35 + 3, seed, 3);
        const hills = (fbm(x * 0.12, z * 0.12, seed + 5, 3) - 0.5) * 0.18 * (1 - edge);
        const y = 0.02 + hills + edge * (0.1 + rim * 0.45) - smoothstep(0.96, 1, r / radius) * 0.18;
        pos.push(x, y, z);
        const patch = fbm(x * 0.2 + 40, z * 0.2 + 7, seed + 11, 3);
        tmp.copy(grassA).lerp(grassB, patch).lerp(dry, smoothstep(0.55, 0.9, patch) * 0.55);
        tmp.lerp(earth, edge * 0.85);
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    for (let j = 0; j < segs; j++) idx.push(0, 1 + ((j + 1) % segs), 1 + j);
    for (let i = 1; i < rings; i++) {
      const a0 = 1 + (i - 1) * segs;
      const a1 = 1 + i * segs;
      for (let j = 0; j < segs; j++) {
        const j1 = (j + 1) % segs;
        idx.push(a0 + j, a0 + j1, a1 + j);
        idx.push(a0 + j1, a1 + j1, a1 + j);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [radius, seed]);

  const cliffGeo = useMemo(() => {
    const rings = 14;
    const segs = 56;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const rockHi = new THREE.Color('#8a7358');
    const rockLo = new THREE.Color('#3f342b');
    const rockTip = new THREE.Color('#2a2420');
    const tmp = new THREE.Color();
    for (let k = 0; k <= rings; k++) {
      const t = k / rings;
      for (let j = 0; j < segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        const n = fbm(Math.cos(a) * 2.2 + t * 3, Math.sin(a) * 2.2 + t * 3, seed + 3, 4);
        const taper = 1 - (1 - tip) * Math.pow(t, 0.75);
        const rr = radius * taper * (0.86 + n * 0.28) * (t === rings ? 0.12 : 1);
        const y = -t * depth * (0.9 + n * 0.35) - (t > 0.8 ? (t - 0.8) * depth * 0.9 : 0);
        pos.push(Math.cos(a) * rr, y, Math.sin(a) * rr);
        tmp.copy(rockHi).lerp(rockLo, Math.min(1, t * 1.4)).lerp(rockTip, smoothstep(0.7, 1, t));
        const v = 0.85 + n * 0.3;
        col.push(tmp.r * v, tmp.g * v, tmp.b * v);
      }
    }
    for (let k = 0; k < rings; k++) {
      const a0 = k * segs;
      const a1 = (k + 1) * segs;
      for (let j = 0; j < segs; j++) {
        const j1 = (j + 1) % segs;
        idx.push(a0 + j, a0 + j1, a1 + j);
        idx.push(a0 + j1, a1 + j1, a1 + j);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [radius, tip, depth, seed]);

  // Grass blades, flowers and rocks
  const grassMat = useGrassMaterial();
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const flowerRef = useRef<THREE.InstancedMesh>(null);
  const rockRef = useRef<THREE.InstancedMesh>(null);
  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
  const grassCount = Math.round(grass * (coarse ? 0.45 : 1) * (radius / 10));
  const flowerCount = Math.round(grassCount * 0.07);
  const rockCount = Math.round(radius * 1.6);

  useLayoutEffect(() => {
    const rnd = mulberry32(seed * 977);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const c = new THREE.Color();

    const place = (r: number, a: number) => new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
    // sample the same height field as the terrain, roughly
    const heightAt = (x: number, z: number) => {
      const r = Math.hypot(x, z);
      const edge = smoothstep(0.8, 1, r / radius);
      const rim = fbm(x * 0.35 + 9, z * 0.35 + 3, seed, 3);
      const hills = (fbm(x * 0.12, z * 0.12, seed + 5, 3) - 0.5) * 0.18 * (1 - edge);
      return 0.02 + hills + edge * (0.1 + rim * 0.45);
    };

    if (grassRef.current) {
      for (let i = 0; i < grassCount; i++) {
        const r = Math.sqrt(rnd()) * radius * 0.94;
        const a = rnd() * Math.PI * 2;
        p.copy(place(r, a));
        p.y = heightAt(p.x, p.z);
        e.set((rnd() - 0.5) * 0.3, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.3);
        q.setFromEuler(e);
        const h = 0.14 + rnd() * 0.22;
        s.set(0.8 + rnd() * 0.8, h / 0.3, 0.8 + rnd() * 0.8);
        m.compose(p, q, s);
        grassRef.current.setMatrixAt(i, m);
        c.set('#5f9a3a').lerp(new THREE.Color('#a9c45a'), rnd()).multiplyScalar(0.8 + rnd() * 0.35);
        grassRef.current.setColorAt(i, c);
      }
      grassRef.current.instanceMatrix.needsUpdate = true;
      if (grassRef.current.instanceColor) grassRef.current.instanceColor.needsUpdate = true;
    }

    if (flowerRef.current) {
      const palette = ['#f4e04d', '#ffffff', '#b58cff', '#ff9ab8', '#ffb347'];
      for (let i = 0; i < flowerCount; i++) {
        const r = Math.sqrt(rnd()) * radius * 0.9;
        const a = rnd() * Math.PI * 2;
        p.copy(place(r, a));
        p.y = heightAt(p.x, p.z) + 0.2;
        q.identity();
        const sc = 0.05 + rnd() * 0.05;
        s.set(sc, sc, sc);
        m.compose(p, q, s);
        flowerRef.current.setMatrixAt(i, m);
        c.set(palette[Math.floor(rnd() * palette.length)]);
        flowerRef.current.setColorAt(i, c);
      }
      flowerRef.current.instanceMatrix.needsUpdate = true;
      if (flowerRef.current.instanceColor) flowerRef.current.instanceColor.needsUpdate = true;
    }

    if (rockRef.current) {
      for (let i = 0; i < rockCount; i++) {
        const r = radius * (0.7 + rnd() * 0.28);
        const a = rnd() * Math.PI * 2;
        p.copy(place(r, a));
        p.y = heightAt(p.x, p.z) + 0.05;
        e.set(rnd() * 3, rnd() * 3, rnd() * 3);
        q.setFromEuler(e);
        const sc = 0.18 + rnd() * 0.5;
        s.set(sc * (0.8 + rnd() * 0.6), sc * 0.7, sc * (0.8 + rnd() * 0.6));
        m.compose(p, q, s);
        rockRef.current.setMatrixAt(i, m);
        c.set('#8b8378').multiplyScalar(0.7 + rnd() * 0.5);
        rockRef.current.setColorAt(i, c);
      }
      rockRef.current.instanceMatrix.needsUpdate = true;
      if (rockRef.current.instanceColor) rockRef.current.instanceColor.needsUpdate = true;
    }
  }, [radius, seed, grassCount, flowerCount, rockCount]);

  useFrame((state) => {
    windUniform.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <mesh geometry={topGeo} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
      </mesh>
      <mesh geometry={cliffGeo} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={1} metalness={0} flatShading />
      </mesh>

      <instancedMesh ref={grassRef} args={[undefined, grassMat, grassCount]} frustumCulled={false} receiveShadow>
        <coneGeometry args={[0.035, 0.3, 3, 1]} />
      </instancedMesh>
      <instancedMesh ref={flowerRef} args={[undefined, undefined, flowerCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 5]} />
        <meshStandardMaterial roughness={0.6} emissive="#ffffff" emissiveIntensity={0.08} />
      </instancedMesh>
      <instancedMesh ref={rockRef} args={[undefined, undefined, rockCount]} frustumCulled={false} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>

      {children}
    </group>
  );
}
