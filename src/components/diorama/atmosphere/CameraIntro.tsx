import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A slow cinematic fly-in when the scene opens. It stops the moment the visitor touches the scene. */
export function CameraIntro({
  from = [78, 84, 126],
  to = [0, 42, 58],
  duration = 3.6,
}: {
  from?: [number, number, number];
  to?: [number, number, number];
  duration?: number;
}) {
  const { camera, gl } = useThree();
  const t = useRef(0);
  const stopped = useRef(false);
  const a = useRef(new THREE.Vector3(...from));
  const b = useRef(new THREE.Vector3(...to));

  useEffect(() => {
    const stop = () => {
      stopped.current = true;
    };
    const el = gl.domElement;
    el.addEventListener('pointerdown', stop);
    el.addEventListener('wheel', stop, { passive: true });
    camera.position.copy(a.current);
    return () => {
      el.removeEventListener('pointerdown', stop);
      el.removeEventListener('wheel', stop);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    if (stopped.current || t.current >= duration) return;
    t.current += delta;
    const k = ease(Math.min(1, t.current / duration));
    camera.position.lerpVectors(a.current, b.current, k);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
