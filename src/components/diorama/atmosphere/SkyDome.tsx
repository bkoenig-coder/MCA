import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOODS, Mood } from './moods';

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uBottom;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  uniform float uGlow;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(uBottom, uMid, smoothstep(-0.12, 0.22, h));
    col = mix(col, uTop, smoothstep(0.12, 0.6, h));
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(s, 5.0) * 0.30 * uGlow + pow(s, 60.0) * 0.55 * uGlow + pow(s, 900.0) * 3.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A painted sky: a gradient from the zenith to the horizon, with a glowing sun or moon. */
export function SkyDome({ mood }: { mood: Mood }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const m0 = MOODS[mood];
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(m0.skyTop) },
      uMid: { value: new THREE.Color(m0.skyMid) },
      uBottom: { value: new THREE.Color(m0.skyBottom) },
      uSunColor: { value: new THREE.Color(m0.sunColor) },
      uSunDir: { value: new THREE.Vector3(...m0.sun).normalize() },
      uGlow: { value: m0.glow },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const tmpC = useMemo(() => new THREE.Color(), []);
  const tmpV = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const t = MOODS[mood];
    const k = 1 - Math.exp(-delta * 2.4);
    uniforms.uTop.value.lerp(tmpC.set(t.skyTop), k);
    uniforms.uMid.value.lerp(tmpC.set(t.skyMid), k);
    uniforms.uBottom.value.lerp(tmpC.set(t.skyBottom), k);
    uniforms.uSunColor.value.lerp(tmpC.set(t.sunColor), k);
    uniforms.uSunDir.value.lerp(tmpV.set(...t.sun).normalize(), k).normalize();
    uniforms.uGlow.value += (t.glow - uniforms.uGlow.value) * k;
  });

  return (
    <mesh renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[800, 32, 24]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} side={THREE.BackSide} depthWrite={false} fog={false} />
    </mesh>
  );
}
