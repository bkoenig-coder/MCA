import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Stars } from '@react-three/drei';
import { SkyDome } from './SkyDome';
import * as THREE from 'three';
import { MOODS, Mood } from './moods';

const SUN_DISTANCE = 90;

/**
 * Sky, sun or moon, ambient light, fog and reflections for the scene.
 * Everything eases from one time of day to the next instead of snapping.
 */
export function Atmosphere({ mood, shadowSize = 2048 }: { mood: Mood; shadowSize?: number }) {
  const { scene } = useThree();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const starsRef = useRef<THREE.Group>(null);

  const cur = useMemo(() => {
    const m = MOODS[mood];
    return {
      sun: new THREE.Vector3(...m.sun).normalize(),
      sunColor: new THREE.Color(m.sunColor),
      sunIntensity: m.sunIntensity,
      hemiSky: new THREE.Color(m.hemiSky),
      hemiGround: new THREE.Color(m.hemiGround),
      hemiIntensity: m.hemiIntensity,
      fog: new THREE.Color(m.fog),
      fogNear: m.fogNear,
      fogFar: m.fogFar,
      stars: m.stars,
      env: m.envIntensity,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);
  const tmpC = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const t = MOODS[mood];
    const k = 1 - Math.exp(-delta * 2.4);
    const lerp = (a: number, b: number) => a + (b - a) * k;

    tmpV.set(...t.sun).normalize();
    cur.sun.lerp(tmpV, k).normalize();
    cur.sunColor.lerp(tmpC.set(t.sunColor), k);
    cur.sunIntensity = lerp(cur.sunIntensity, t.sunIntensity);
    cur.hemiSky.lerp(tmpC.set(t.hemiSky), k);
    cur.hemiGround.lerp(tmpC.set(t.hemiGround), k);
    cur.hemiIntensity = lerp(cur.hemiIntensity, t.hemiIntensity);
    cur.fog.lerp(tmpC.set(t.fog), k);
    cur.fogNear = lerp(cur.fogNear, t.fogNear);
    cur.fogFar = lerp(cur.fogFar, t.fogFar);
    cur.stars = lerp(cur.stars, t.stars);
    cur.env = lerp(cur.env, t.envIntensity);

    if (sunRef.current) {
      sunRef.current.position.copy(cur.sun).multiplyScalar(SUN_DISTANCE);
      // the moon must not light the scene from underneath
      if (sunRef.current.position.y < 6) sunRef.current.position.y = 6;
      sunRef.current.color.copy(cur.sunColor);
      sunRef.current.intensity = cur.sunIntensity;
    }
    if (hemiRef.current) {
      hemiRef.current.color.copy(cur.hemiSky);
      hemiRef.current.groundColor.copy(cur.hemiGround);
      hemiRef.current.intensity = cur.hemiIntensity;
    }
    if (starsRef.current) starsRef.current.visible = cur.stars > 0.35;

    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(cur.fog);
      fog.near = cur.fogNear;
      fog.far = cur.fogFar;
    }
    (scene as any).environmentIntensity = cur.env;
  });

  return (
    <>
      <fog attach="fog" args={[MOODS[mood].fog, MOODS[mood].fogNear, MOODS[mood].fogFar]} />
      <SkyDome mood={mood} />
      <group ref={starsRef} visible={false}>
        <Stars radius={300} depth={60} count={3500} factor={6} saturation={0} fade speed={0.4} />
      </group>

      <hemisphereLight ref={hemiRef} args={[MOODS[mood].hemiSky, MOODS[mood].hemiGround, MOODS[mood].hemiIntensity]} />
      <directionalLight
        ref={sunRef}
        castShadow
        intensity={MOODS[mood].sunIntensity}
        color={MOODS[mood].sunColor}
        position={[...MOODS[mood].sun].map((v) => v * 0.9) as [number, number, number]}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      {/* Soft studio-style reflections without downloading any image */}
      <Environment resolution={128} frames={1} background={false}>
        <Lightformer form="rect" intensity={2.2} color="#ffe2b8" position={[0, 12, -12]} scale={[40, 12, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#9ec2ff" position={[-14, 6, 10]} rotation-y={Math.PI / 2} scale={[24, 8, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#fff1d6" position={[16, 10, 8]} scale={8} />
      </Environment>
    </>
  );
}
