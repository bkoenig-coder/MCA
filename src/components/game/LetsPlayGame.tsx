import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronUp, ChevronRight, Check, Link as LinkIcon, Facebook, Twitter, Linkedin, ShieldCheck, Flame } from 'lucide-react';
import { db, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from '../../firebase';

// ---------------------------------------------------------------------------
// Steppe Runner: a golden-hour ride across the steppe.
// The game state lives in a mutable ref and is updated every frame (no React
// re-render per frame); React only re-renders for the HUD and for new objects.
// ---------------------------------------------------------------------------

const LANE_W = 2.2;
const GRAVITY = -34;
const JUMP_V = 12.5;
const START_SPEED = 16;
const RAMP = 0.75; // speed gained per second
const spawnZ = (speed: number) => -Math.min(160, Math.max(80, speed * 1.6)); // spawn farther away as the game gets faster
const FOG = '#f1d3a4';

type GameState = 'START' | 'PLAYING' | 'GAMEOVER';
type ObjType = 'ROCK' | 'FENCE' | 'COIN_BOW' | 'COIN_MORIN' | 'POWER_SHIELD' | 'GER' | 'OVOO' | 'TREE' | 'SHEEP' | 'HORSE' | 'COW';

interface Obj {
  id: number;
  type: ObjType;
  x: number;
  y: number;
  z: number;
  scale: number;
  ref: THREE.Group | null;
}

interface Game {
  state: GameState;
  lane: number;
  laneX: number;
  y: number;
  vy: number;
  jumpBuf: number;
  dist: number;
  speed: number;
  time: number;
  bonus: number;
  score: number;
  combo: number;
  comboT: number;
  shield: boolean;
  shake: number;
  nextRow: number;
  nextDeco: number;
  nextId: number;
  objects: Obj[];
}

const newGame = (state: GameState): Game => ({
  state, lane: 0, laneX: 0, y: 0, vy: 0, jumpBuf: 0, dist: 0, speed: 0, time: 0, bonus: 0, score: 0,
  combo: 0, comboT: 0, shield: false, shake: 0, nextRow: 12, nextDeco: 0, nextId: 1, objects: [],
});

const isObstacle = (t: ObjType) => t === 'ROCK' || t === 'FENCE';
const isPickup = (t: ObjType) => t === 'COIN_BOW' || t === 'COIN_MORIN' || t === 'POWER_SHIELD';
const comboMult = (combo: number) => Math.min(5, 1 + Math.floor(combo / 5));
const levelOf = (speed: number) => Math.max(1, Math.floor((speed - START_SPEED) / 3) + 1);

// ---------------------------------------------------------------------------
// Procedural textures (drawn once)
// ---------------------------------------------------------------------------
function makeGrassTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#9bb352';
  g.fillRect(0, 0, 256, 256);
  const cols = ['#8aa545', '#acc360', '#7c963c', '#b9a95a', '#a1ba58'];
  for (let i = 0; i < 900; i++) {
    g.strokeStyle = cols[i % cols.length];
    g.globalAlpha = 0.35 + Math.random() * 0.4;
    g.lineWidth = 1 + Math.random() * 1.5;
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 5, y - 5 - Math.random() * 9);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function makePathTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#b08a64';
  g.fillRect(0, 0, 128, 256);
  for (let i = 0; i < 500; i++) {
    g.fillStyle = Math.random() < 0.5 ? '#9a7653' : '#c49f78';
    g.globalAlpha = 0.25 + Math.random() * 0.3;
    g.fillRect(Math.random() * 128, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  g.globalAlpha = 0.55;
  g.fillStyle = '#e9d5a8';
  for (const x of [42.5, 85.5]) for (let y = 8; y < 256; y += 64) g.fillRect(x - 1.5, y, 3, 28); // lane dashes
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------
const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => (
  <meshStandardMaterial color={color} roughness={0.85} {...extra} />
);


// ---------------------------------------------------------------------------
// Riders (cosmetic choice; they all play the same)
// ---------------------------------------------------------------------------
export type CharacterId = 'herder' | 'khan' | 'warrior' | 'queen';
export const CHARACTER_IDS: CharacterId[] = ['herder', 'khan', 'warrior', 'queen'];

interface Look {
  horse: string;
  mane: string;
  blanket: string;
  deel: string;
  sash: string;
  hat: 'cone' | 'felt' | 'helm' | 'boqta';
  hatColor: string;
  trim: string;
}

const LOOKS: Record<CharacterId, Look> = {
  herder: { horse: '#8a4b22', mane: '#33190a', blanket: '#a8322d', deel: '#1c4fa8', sash: '#d4af37', hat: 'cone', hatColor: '#a8322d', trim: '#d4af37' },
  khan: { horse: '#ece6d8', mane: '#b9ae95', blanket: '#d4af37', deel: '#efe7c8', sash: '#d8c68e', hat: 'felt', hatColor: '#f6f1e4', trim: '#2a2a2a' },
  warrior: { horse: '#201b18', mane: '#0c0a09', blanket: '#475569', deel: '#475569', sash: '#a8322d', hat: 'helm', hatColor: '#9aa5b1', trim: '#a8322d' },
  queen: { horse: '#c9a26a', mane: '#f1e4c8', blanket: '#e0361c', deel: '#e8891c', sash: '#d4af37', hat: 'boqta', hatColor: '#e0361c', trim: '#d4af37' },
};

/** Small flat portrait of each rider for the picker. */
function Avatar({ id }: { id: CharacterId }) {
  const l = LOOKS[id];
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#16295a" />
      <path d="M8 46 Q10 32 24 32 Q38 32 40 46 Z" fill={l.deel} />
      <rect x="14" y="38" width="20" height="3" fill={l.sash} />
      <circle cx="24" cy="24" r="7" fill="#f0b996" />
      {l.hat === 'cone' && (<><rect x="14" y="17" width="20" height="3" rx="1.5" fill="#d4af37" /><polygon points="17,17 24,5 31,17" fill={l.hatColor} /></>)}
      {l.hat === 'felt' && (<><path d="M15 27 Q24 40 33 27 L33 33 Q24 46 15 33 Z" fill="#cfcac0" /><path d="M16 21 Q16 8 24 8 Q32 8 32 21 L30 20 Q24 13 18 20 Z" fill="#f6f1e4" /><rect x="14" y="19" width="4" height="12" rx="2" fill="#f6f1e4" /><rect x="30" y="19" width="4" height="12" rx="2" fill="#f6f1e4" /><rect x="14" y="29" width="4" height="2" fill="#2a2a2a" /><rect x="30" y="29" width="4" height="2" fill="#2a2a2a" /></>)}
      {l.hat === 'helm' && (<><rect x="15" y="17" width="18" height="3" rx="1.5" fill="#7b8794" /><polygon points="17,17 24,6 31,17" fill="#b8c2cc" /><rect x="23.4" y="1" width="1.2" height="6" fill="#cbd2d9" /><circle cx="27" cy="9" r="2" fill="#c1121f" /></>)}
      {l.hat === 'boqta' && (<><rect x="15" y="17" width="18" height="3" rx="1.5" fill="#e0361c" /><rect x="19" y="4" width="10" height="14" fill="#e0361c" /><rect x="16" y="2" width="16" height="4" rx="1" fill="#e0361c" /><rect x="22" y="1" width="4" height="2" fill="#f6f1e4" /><circle cx="14.5" cy="23" r="1.4" fill="#fbf7ea" /><circle cx="14.5" cy="27" r="1.4" fill="#fbf7ea" /><circle cx="14.5" cy="31" r="1.4" fill="#fbf7ea" /><circle cx="33.5" cy="23" r="1.4" fill="#fbf7ea" /><circle cx="33.5" cy="27" r="1.4" fill="#fbf7ea" /><circle cx="33.5" cy="31" r="1.4" fill="#fbf7ea" /><path d="M14 36 Q24 40 34 36 L35 40 Q24 44 13 40 Z" fill="#1d1a1a" /></>)}
    </svg>
  );
}

/** Headwear and extras for each rider, drawn inside the rider's torso group. */
function Gear({ look, id }: { look: Look; id: CharacterId }) {
  const gold = '#d4af37';
  return (
    <>
      {look.hat === 'cone' && (
        <>
          <mesh position={[0, 1.02, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.05, 12]} />{mat(gold, { roughness: 0.45, emissive: '#6b4f00', emissiveIntensity: 0.35 })}</mesh>
          <mesh position={[0, 1.18, 0]} castShadow><coneGeometry args={[0.17, 0.28, 8]} />{mat(look.hatColor)}</mesh>
          <mesh position={[0, 1.34, 0]}><sphereGeometry args={[0.04, 8, 8]} />{mat(gold, { roughness: 0.45, emissive: '#6b4f00', emissiveIntensity: 0.35 })}</mesh>
        </>
      )}
      {look.hat === 'felt' && (
        <>
          <mesh position={[0, 0.98, 0]} scale={[1, 0.85, 1]} castShadow><sphereGeometry args={[0.2, 14, 10]} />{mat(look.hatColor, { roughness: 0.95 })}</mesh>
          {[-1, 1].map((x) => (
            <group key={x}>
              <mesh position={[x * 0.19, 0.85, 0.02]} rotation={[0, 0, x * 0.12]}><boxGeometry args={[0.06, 0.24, 0.26]} />{mat(look.hatColor, { roughness: 0.95 })}</mesh>
              <mesh position={[x * 0.2, 0.72, 0.02]}><boxGeometry args={[0.06, 0.06, 0.24]} />{mat(look.trim)}</mesh>
            </group>
          ))}
          <mesh position={[0, 0.86, 0.17]}><boxGeometry args={[0.32, 0.22, 0.06]} />{mat(look.hatColor, { roughness: 0.95 })}</mesh>
          <mesh position={[0, 0.74, 0.17]}><boxGeometry args={[0.3, 0.05, 0.05]} />{mat(look.trim)}</mesh>
        </>
      )}
      {look.hat === 'helm' && (
        <>
          <mesh position={[0, 1.0, 0]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />{mat('#7b8794', { roughness: 0.5 })}</mesh>
          <mesh position={[0, 1.16, 0]} castShadow><coneGeometry args={[0.18, 0.3, 10]} />{mat(look.hatColor, { roughness: 0.5 })}</mesh>
          <mesh position={[0, 1.36, 0]}><cylinderGeometry args={[0.015, 0.015, 0.14, 5]} />{mat('#cbd2d9', { roughness: 0.4 })}</mesh>
          <mesh position={[0, 1.3, 0.1]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.06, 0.28, 6]} />{mat('#c1121f')}</mesh>
          {/* round shield on the back */}
          <mesh position={[0, 0.45, 0.27]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.05, 20]} />{mat('#8d2b24')}</mesh>
          <mesh position={[0, 0.45, 0.31]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.06, 12]} />{mat(gold, { roughness: 0.45, emissive: '#6b4f00', emissiveIntensity: 0.35 })}</mesh>
        </>
      )}
      {look.hat === 'boqta' && (
        <>
          <mesh position={[0, 1.02, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1, 14]} />{mat(look.hatColor)}</mesh>
          <mesh position={[0, 1.3, 0]} castShadow><boxGeometry args={[0.2, 0.5, 0.2]} />{mat(look.hatColor)}</mesh>
          <mesh position={[0, 1.58, 0]} castShadow><boxGeometry args={[0.32, 0.12, 0.26]} />{mat(look.hatColor)}</mesh>
          <mesh position={[0, 1.66, 0]}><boxGeometry args={[0.18, 0.05, 0.12]} />{mat('#f6f1e4')}</mesh>
          {/* strings of pearls on both sides */}
          {[-1, 1].map((x) => (
            <group key={x} position={[x * 0.2, 0.96, 0.0]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[x * 0.02, -i * 0.085, 0]}><sphereGeometry args={[0.033, 8, 8]} />{mat('#fbf7ea', { roughness: 0.35 })}</mesh>
              ))}
            </group>
          ))}
          <mesh position={[0, 1.08, 0.12]}><sphereGeometry args={[0.05, 8, 8]} />{mat('#f6f1e4', { roughness: 0.35 })}</mesh>
        </>
      )}
      {id === 'queen' && (
        <>
          {/* dark collar with gold pattern, like the empress portraits */}
          <mesh position={[0, 0.74, 0]}><cylinderGeometry args={[0.24, 0.27, 0.12, 14]} />{mat('#1d1a1a')}</mesh>
          <mesh position={[0, 0.74, 0]}><torusGeometry args={[0.25, 0.018, 6, 16]} />{mat('#d4af37', { roughness: 0.45, emissive: '#6b4f00', emissiveIntensity: 0.35 })}</mesh>
          {[-0.14, 0, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.7, 0.2]}><sphereGeometry args={[0.024, 6, 6]} />{mat('#d4af37', { emissive: '#6b4f00', emissiveIntensity: 0.35 })}</mesh>
          ))}
        </>
      )}
    </>
  );
}

function Leg({ pivot, color }: { pivot: React.RefObject<THREE.Group | null>; color: string }) {
  return (
    <group ref={pivot as React.RefObject<THREE.Group>}>
      <mesh position={[0, -0.38, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.78, 6]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, -0.8, 0.02]} castShadow>
        <cylinderGeometry args={[0.075, 0.09, 0.1, 6]} />
        {mat('#2a1a10')}
      </mesh>
    </group>
  );
}

function Rider({ G, dust, character }: { G: React.MutableRefObject<Game>; dust: boolean; character: CharacterId }) {
  const look = LOOKS[character];
  const root = useRef<THREE.Group>(null);
  const fl = useRef<THREE.Group>(null);
  const fr = useRef<THREE.Group>(null);
  const bl = useRef<THREE.Group>(null);
  const br = useRef<THREE.Group>(null);
  const neck = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = G.current;
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.set(g.laneX, g.y, 0);
      root.current.rotation.z = -(g.laneX - g.lane * LANE_W) * 0.12;
      root.current.rotation.x = THREE.MathUtils.clamp(g.vy * 0.012, -0.25, 0.25);
    }
    const moving = g.speed > 1 && g.state !== 'GAMEOVER';
    const air = g.y > 0.02;
    const rate = 6 + g.speed * 0.55;
    const a = moving && !air ? Math.sin(t * rate) : 0;
    const b = moving && !air ? Math.sin(t * rate + 1.6) : 0;
    const amp = 0.75;
    const set = (r: React.RefObject<THREE.Group | null>, v: number) => { if (r.current) r.current.rotation.x = v; };
    if (air) {
      set(fl, -0.9); set(fr, -0.9); set(bl, 0.7); set(br, 0.7);
    } else {
      set(fl, a * amp); set(fr, a * amp * 0.9 - 0.1); set(bl, b * amp); set(br, b * amp * 0.9 + 0.1);
    }
    if (neck.current) neck.current.rotation.x = -(0.7 + (moving ? Math.sin(t * rate) * 0.09 : 0) - (air ? 0.2 : 0));
    if (tail.current) { tail.current.rotation.x = -(0.7 + (moving ? 0.25 : 0)); tail.current.rotation.z = Math.sin(t * 5) * 0.25; }
    if (torso.current) torso.current.position.y = 1.3 + (moving && !air ? Math.abs(Math.sin(t * rate)) * 0.07 : 0);
    const arm = 0.55 + (moving ? Math.sin(t * rate) * 0.08 : 0);
    if (armL.current) armL.current.rotation.x = arm;
    if (armR.current) armR.current.rotation.x = arm;
  });

  const horse = look.horse;
  const dark = look.mane;
  const deel = look.deel;

  return (
    <group ref={root}>
      {/* soft shadow under the horse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.8, 20]} />
        <meshBasicMaterial color="#000" transparent opacity={0.22} />
      </mesh>

      {/* body */}
      <mesh position={[0, 1.0, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.95, 6, 12]} />
        {mat(horse)}
      </mesh>
      {/* tail */}
      <group ref={tail} position={[0, 1.15, 0.62]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.12, 0.7, 6]} />
          {mat(dark)}
        </mesh>
      </group>
      {/* neck and head */}
      <group ref={neck} position={[0, 1.2, -0.6]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.75, 8]} />
          {mat(horse)}
        </mesh>
        <mesh position={[0, 0.35, 0.14]}>
          <boxGeometry args={[0.05, 0.7, 0.1]} />
          {mat(dark)}
        </mesh>
        <mesh position={[0, 0.82, -0.25]} rotation={[-1.18, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.16, 0.55, 8]} />
          {mat(horse)}
        </mesh>
        <mesh position={[0, 0.93, -0.5]} rotation={[-1.18, 0, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.06, 8]} />
          {mat('#d9c7b0')}
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 1.08, 0.02]} castShadow>
            <coneGeometry args={[0.035, 0.12, 5]} />
            {mat(dark)}
          </mesh>
        ))}
      </group>
      {/* legs */}
      <group position={[-0.2, 0.8, -0.55]}><Leg pivot={fl} color={horse} /></group>
      <group position={[0.2, 0.8, -0.55]}><Leg pivot={fr} color={horse} /></group>
      <group position={[-0.2, 0.8, 0.45]}><Leg pivot={bl} color={horse} /></group>
      <group position={[0.2, 0.8, 0.45]}><Leg pivot={br} color={horse} /></group>
      {/* saddle blanket */}
      <mesh position={[0, 1.33, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.6]} />
        {mat(look.blanket)}
      </mesh>

      {/* rider */}
      <group ref={torso} position={[0, 1.3, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.28, 0.72, 10]} />
          {mat(deel)}
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.25, 0.045, 6, 14]} />
          {mat(look.sash, { roughness: 0.5, emissive: '#3a2a00', emissiveIntensity: 0.25 })}
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.17, 12, 10]} />
          {mat('#f0b996')}
        </mesh>
        <Gear look={look} id={character} />
        {[-1, 1].map((s) => (
          <group key={s} ref={s < 0 ? armL : armR} position={[s * 0.27, 0.68, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.07, 0.46, 6]} />
              {mat(deel)}
            </mesh>
          </group>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.3, 0.05, 0.1]} rotation={[0.3, 0, s * 0.5]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.5, 6]} />
            {mat('#2a2a35')}
          </mesh>
        ))}
      </group>

      {dust && (
        <Sparkles count={14} scale={[1.2, 0.4, 1.8]} size={4} speed={1.3} opacity={0.55} color="#d9b98a" position={[0, 0.25, 0.9]} />
      )}
    </group>
  );
}

/** A cow for the scenery: spotted, brown or dark. */
function Cow({ coat, patch, x, z, turn, graze }: { coat: string; patch: string | null; x: number; z: number; turn: number; graze: boolean }) {
  const legs: [number, number][] = [[-0.2, -0.4], [0.2, -0.4], [-0.2, 0.4], [0.2, 0.4]];
  return (
    <group position={[x, 0, z]} rotation={[0, turn, 0]}>
      <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.38, 0.8, 6, 12]} />
        {mat(coat)}
      </mesh>
      {patch && (
        <>
          <mesh position={[0.3, 0.95, 0.1]} scale={[0.5, 0.7, 0.9]}><sphereGeometry args={[0.3, 8, 6]} />{mat(patch)}</mesh>
          <mesh position={[-0.28, 0.8, -0.3]} scale={[0.5, 0.9, 0.7]}><sphereGeometry args={[0.28, 8, 6]} />{mat(patch)}</mesh>
        </>
      )}
      {legs.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.28, lz]} castShadow>
          <cylinderGeometry args={[0.09, 0.075, 0.56, 6]} />
          {mat(coat)}
        </mesh>
      ))}
      <group position={[0, 0.9, -0.62]} rotation={[graze ? 0.9 : 0.25, 0, 0]}>
        <mesh position={[0, 0, -0.18]} castShadow>
          <boxGeometry args={[0.3, 0.32, 0.42]} />
          {mat(coat)}
        </mesh>
        <mesh position={[0, -0.06, -0.42]}>
          <boxGeometry args={[0.24, 0.2, 0.12]} />
          {mat('#e9c9b2')}
        </mesh>
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[sx * 0.2, 0.16, -0.12]} rotation={[0, 0, -sx * 0.9]}>
            <coneGeometry args={[0.04, 0.2, 5]} />
            {mat('#efe6d2')}
          </mesh>
        ))}
        {[-1, 1].map((sx) => (
          <mesh key={`e${sx}`} position={[sx * 0.19, 0.08, -0.02]} scale={[1, 0.5, 0.8]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            {mat(coat)}
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.78, 0.55]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.02, 0.5, 5]} />
        {mat(coat)}
      </mesh>
    </group>
  );
}

/** A standing or grazing horse for the scenery. */
function Horse({ coat, mane, graze, x, z, turn }: { coat: string; mane: string; graze: boolean; x: number; z: number; turn: number }) {
  const legs: [number, number][] = [[-0.2, -0.55], [0.2, -0.55], [-0.2, 0.45], [0.2, 0.45]];
  return (
    <group position={[x, 0, z]} rotation={[0, turn, 0]}>
      <mesh position={[0, 1.0, -0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.95, 6, 12]} />
        {mat(coat)}
      </mesh>
      {legs.map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.4, lz]} castShadow>
          <cylinderGeometry args={[0.085, 0.065, 0.8, 6]} />
          {mat(coat)}
        </mesh>
      ))}
      <group position={[0, 1.2, 0.62]} rotation={[-0.6, 0, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.11, 0.7, 6]} />
          {mat(mane)}
        </mesh>
      </group>
      <group position={[0, 1.2, -0.6]} rotation={[graze ? -2.35 : -0.7, 0, 0]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.75, 8]} />
          {mat(coat)}
        </mesh>
        <mesh position={[0, 0.35, 0.14]}>
          <boxGeometry args={[0.05, 0.7, 0.1]} />
          {mat(mane)}
        </mesh>
        <mesh position={[0, 0.82, -0.25]} rotation={[-1.18, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.16, 0.55, 8]} />
          {mat(coat)}
        </mesh>
      </group>
    </group>
  );
}

function Spin({ children, bob = 0.15 }: { children: React.ReactNode; bob?: number }) {
  const r = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!r.current) return;
    const t = s.clock.getElapsedTime();
    r.current.rotation.y = t * 2.2;
    r.current.position.y = Math.sin(t * 4) * bob;
  });
  return <group ref={r}>{children}</group>;
}

function Item({ o, shadows }: { o: Obj; shadows: boolean }) {
  const s = o.scale;
  return (
    <group ref={(r) => { o.ref = r; }} position={[o.x, o.y, o.z]} scale={s}>
      {o.type === 'ROCK' && (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow={shadows} rotation={[0.3, 0.6, 0]}>
            <dodecahedronGeometry args={[0.62, 0]} />
            {mat('#8b8f8c', { roughness: 0.95, flatShading: true })}
          </mesh>
          <mesh position={[0.5, 0.2, 0.2]} castShadow={shadows}>
            <dodecahedronGeometry args={[0.3, 0]} />
            {mat('#777b79', { roughness: 0.95, flatShading: true })}
          </mesh>
        </group>
      )}
      {o.type === 'FENCE' && (
        <group>
          {[-0.8, 0.8].map((x) => (
            <mesh key={x} position={[x, 0.45, 0]} castShadow={shadows}>
              <boxGeometry args={[0.12, 0.9, 0.12]} />
              {mat('#6d4524')}
            </mesh>
          ))}
          {[0.3, 0.65].map((y) => (
            <mesh key={y} position={[0, y, 0]} castShadow={shadows}>
              <boxGeometry args={[1.8, 0.12, 0.08]} />
              {mat('#8d5d33')}
            </mesh>
          ))}
        </group>
      )}
      {o.type === 'COIN_BOW' && (
        <Spin>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.32, 0.05, 8, 18, Math.PI]} />
            {mat('#d4af37', { metalness: 0.7, roughness: 0.3, emissive: '#7a5a00', emissiveIntensity: 0.4 })}
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.64, 4]} />
            {mat('#fff7d6')}
          </mesh>
        </Spin>
      )}
      {o.type === 'COIN_MORIN' && (
        <Spin>
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.3, 0.32, 0.09]} />
            {mat('#d4af37', { metalness: 0.7, roughness: 0.3, emissive: '#7a5a00', emissiveIntensity: 0.4 })}
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.5, 6]} />
            {mat('#d4af37', { metalness: 0.7, emissive: '#7a5a00', emissiveIntensity: 0.4 })}
          </mesh>
          <mesh position={[0, 0.47, 0.03]}>
            <boxGeometry args={[0.1, 0.13, 0.16]} />
            {mat('#d4af37', { metalness: 0.7, emissive: '#7a5a00', emissiveIntensity: 0.4 })}
          </mesh>
        </Spin>
      )}
      {o.type === 'POWER_SHIELD' && (
        <Spin bob={0.2}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 20]} />
              {mat('#2b6cc4', { metalness: 0.6, roughness: 0.3, emissive: '#10357a', emissiveIntensity: 0.6 })}
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              {mat('#d4af37', { metalness: 0.9, roughness: 0.2 })}
            </mesh>
          </group>
          <pointLight color="#5aa0ff" distance={4} intensity={1.6} />
        </Spin>
      )}
      {o.type === 'GER' && (
        <group>
          <mesh position={[0, 0.7, 0]} castShadow={shadows} receiveShadow>
            <cylinderGeometry args={[2, 2, 1.4, 20]} />
            {mat('#f4efe4')}
          </mesh>
          <mesh position={[0, 2.05, 0]} castShadow={shadows}>
            <coneGeometry args={[2.25, 1.0, 20]} />
            {mat('#eee7d8')}
          </mesh>
          <mesh position={[0, 2.62, 0]}>
            <cylinderGeometry args={[0.3, 0.45, 0.14, 12]} />
            {mat('#3b2a1e')}
          </mesh>
          <mesh position={[0, 0.55, 2.0]}>
            <boxGeometry args={[0.8, 1.1, 0.1]} />
            {mat('#c0442c')}
          </mesh>
        </group>
      )}
      {o.type === 'OVOO' && (
        <group>
          {[[0, 0.35, 0, 0.7], [0.1, 0.9, 0, 0.5], [0, 1.28, 0.05, 0.34]].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]} castShadow={shadows} rotation={[0.2 * i, 0.5 * i, 0]}>
              <dodecahedronGeometry args={[r, 0]} />
              {mat('#9a9b98', { flatShading: true, roughness: 1 })}
            </mesh>
          ))}
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 5]} />
            {mat('#5d3a1c')}
          </mesh>
          <mesh position={[0.35, 2.15, 0]}>
            <boxGeometry args={[0.7, 0.4, 0.02]} />
            {mat('#2f7fd8', { emissive: '#103a78', emissiveIntensity: 0.35 })}
          </mesh>
        </group>
      )}
      {o.type === 'TREE' && (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow={shadows}>
            <cylinderGeometry args={[0.18, 0.28, 1.8, 6]} />
            {mat('#5a3c20')}
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow={shadows}>
            <coneGeometry args={[1.2, 2.6, 7]} />
            {mat('#3f6b32')}
          </mesh>
          <mesh position={[0, 3.6, 0]} castShadow={shadows}>
            <coneGeometry args={[0.85, 1.9, 7]} />
            {mat('#4a7a3a')}
          </mesh>
        </group>
      )}
      {o.type === 'HORSE' && (
        <group>
          <Horse coat="#8a4b22" mane="#33190a" graze={false} x={0} z={0} turn={0.4} />
          <Horse coat="#2c2420" mane="#120d0a" graze x={1.7} z={0.9} turn={-0.9} />
          <Horse coat="#d8c9aa" mane="#8d7a58" graze={false} x={-1.6} z={1.3} turn={2.5} />
        </group>
      )}
      {o.type === 'COW' && (
        <group>
          <Cow coat="#f2eee6" patch="#2a2522" graze x={0} z={0} turn={0.6} />
          <Cow coat="#7a4a2a" patch={null} graze={false} x={1.9} z={1.1} turn={-0.7} />
          <Cow coat="#2b2522" patch={null} graze x={-1.7} z={1.5} turn={2.2} />
        </group>
      )}
      {o.type === 'SHEEP' && (
        <group>
          {[[0, 0, 0], [0.9, 0, 0.5], [-0.8, 0, 0.7]].map(([x, , z], i) => (
            <group key={i} position={[x, 0, z]} rotation={[0, i * 1.7, 0]}>
              <mesh position={[0, 0.42, 0]} scale={[0.5, 0.38, 0.7]} castShadow={shadows}>
                <sphereGeometry args={[1, 8, 6]} />
                {mat('#f3efe6')}
              </mesh>
              <mesh position={[0, 0.5, 0.6]}>
                <sphereGeometry args={[0.2, 8, 6]} />
                {mat('#3a2d28')}
              </mesh>
              {[[-0.15, 0.2], [0.15, 0.2], [-0.15, -0.2], [0.15, -0.2]].map(([lx, lz], j) => (
                <mesh key={j} position={[lx, 0.1, lz]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.22, 5]} />
                  {mat('#3a2d28')}
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Backdrop: sun, mountains, hills, drifting clouds
// ---------------------------------------------------------------------------
function Backdrop() {
  const clouds = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (clouds.current) clouds.current.position.x = Math.sin(s.clock.getElapsedTime() * 0.03) * 14;
  });
  const mountains = useMemo(
    () => [
      [-70, 22, 14, '#8c8fb0'], [-38, 30, 18, '#7d82a6'], [-6, 20, 13, '#8a8fb1'], [26, 34, 20, '#7a7fa4'], [58, 24, 15, '#8c8fb0'], [88, 28, 17, '#7d82a6'],
    ] as [number, number, number, string][],
    []
  );
  return (
    <>
      <mesh position={[-34, 15, -125]}>
        <sphereGeometry args={[7, 20, 16]} />
        <meshBasicMaterial color="#fff3cf" fog={false} />
      </mesh>
      {mountains.map(([x, h, r, c], i) => (
        <group key={i} position={[x, 0, -130 - (i % 2) * 14]}>
          <mesh position={[0, h / 2, 0]}>
            <coneGeometry args={[r, h, 6]} />
            <meshStandardMaterial color={c} flatShading roughness={1} />
          </mesh>
          <mesh position={[0, h * 0.82, 0]}>
            <coneGeometry args={[r * 0.28, h * 0.22, 6]} />
            <meshStandardMaterial color="#f5f1ea" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
      {[-60, -28, 8, 40, 70].map((x, i) => (
        <mesh key={x} position={[x, -2, -75 - (i % 3) * 8]} scale={[26, 7 + (i % 2) * 3, 12]}>
          <sphereGeometry args={[1, 14, 8]} />
          <meshStandardMaterial color={i % 2 ? '#a3a45c' : '#8fa24f'} roughness={1} />
        </mesh>
      ))}
      <group ref={clouds}>
        {[[-48, 24, -100, 1.2], [-8, 30, -115, 1.5], [34, 22, -95, 1], [62, 28, -120, 1.3], [-80, 18, -90, 0.9]].map(([x, y, z, sc], i) => (
          <group key={i} position={[x, y, z]} scale={sc}>
            {[[0, 0, 0, 5], [5, -0.6, 0.5, 4], [-5, -0.5, -0.3, 3.6], [2, 1.4, 0, 3.2]].map(([cx, cy, cz, cr], j) => (
              <mesh key={j} position={[cx, cy, cz]} scale={[1.4, 0.7, 1]}>
                <sphereGeometry args={[cr, 10, 8]} />
                <meshBasicMaterial color="#fff6e6" transparent opacity={0.9} fog={false} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene: world loop, spawning, collisions
// ---------------------------------------------------------------------------
interface Hud { score: number; mult: number; combo: number; shield: boolean; level: number }

function Scene({ G, isMobile, character, onHud, onEnd, onShieldHit }: {
  G: React.MutableRefObject<Game>;
  isMobile: boolean;
  character: CharacterId;
  onHud: (h: Hud) => void;
  onEnd: (score: number) => void;
  onShieldHit: () => void;
}) {
  const { camera } = useThree();
  const [, setVersion] = useState(0);
  const grass = useMemo(makeGrassTexture, []);
  const path = useMemo(makePathTexture, []);
  const lastHud = useRef('');
  const fovRef = useRef(52);

  useEffect(() => {
    grass.repeat.set(26, 44);
    path.repeat.set(1, 36);
    return () => { grass.dispose(); path.dispose(); };
  }, [grass, path]);

  const spawn = (g: Game, type: ObjType, x: number, y: number, z: number, scale = 1) => {
    g.objects.push({ id: g.nextId++, type, x, y, z, scale, ref: null });
  };

  const spawnRow = (g: Game) => {
    const sz = spawnZ(g.speed);
    const lanes = [-1, 0, 1];
    const pick = () => lanes[Math.floor(Math.random() * 3)];
    const r = Math.random();
    const hard = Math.min(0.22, (levelOf(g.speed) - 1) * 0.025); // more obstacles as you go faster
    const obstacle = () => (Math.random() < 0.5 ? 'ROCK' : 'FENCE') as ObjType;
    if (!g.shield && Math.random() < 0.04) {
      spawn(g, 'POWER_SHIELD', pick() * LANE_W, 1.1, sz);
      return;
    }
    const t1 = 0.28 + hard;
    const t2 = t1 + 0.18 + hard * 0.7;
    const t3 = t2 + Math.max(0.12, 0.3 - hard * 1.4);
    if (r < t1) {
      spawn(g, obstacle(), pick() * LANE_W, 0, sz);
    } else if (r < t2) {
      const free = pick();
      lanes.filter((l) => l !== free).forEach((l) => spawn(g, obstacle(), l * LANE_W, 0, sz));
    } else if (r < t3) {
      const l = pick();
      const type: ObjType = Math.random() < 0.5 ? 'COIN_BOW' : 'COIN_MORIN';
      for (let i = 0; i < 5; i++) spawn(g, type, l * LANE_W, 1.0, sz - i * 2.4);
    } else {
      // an obstacle with a golden arc to jump through
      const l = pick();
      spawn(g, obstacle(), l * LANE_W, 0, sz);
      [-2.4, 0, 2.4].forEach((dz, i) => spawn(g, 'COIN_BOW', l * LANE_W, i === 1 ? 2.1 : 1.6, sz + dz));
    }
  };

  const spawnDeco = (g: Game) => {
    const sz = spawnZ(g.speed);
    const side = Math.random() < 0.5 ? -1 : 1;
    const x = side * (6.5 + Math.random() * 20);
    const r = Math.random();
    const type: ObjType = r < 0.28 ? 'GER' : r < 0.46 ? 'SHEEP' : r < 0.54 ? 'HORSE' : r < 0.68 ? 'COW' : r < 0.78 ? 'OVOO' : 'TREE';
    // keep gers and trees away from the path, sheep may graze closer
    const xx = type === 'SHEEP' || type === 'HORSE' || type === 'COW' ? side * (5.5 + Math.random() * 12) : x;
    spawn(g, type, xx, 0, sz - 10, type === 'TREE' ? 0.9 + Math.random() * 0.5 : 1);
  };

  useFrame((state, dtRaw) => {
    const g = G.current;
    const dt = Math.min(dtRaw, 0.05);
    const playing = g.state === 'PLAYING';
    const idle = g.state === 'START';
    if (playing) g.time += dt;

    const target = playing ? START_SPEED + g.time * RAMP : idle ? 5 : 0;
    g.speed = THREE.MathUtils.lerp(g.speed, target, 1 - Math.exp(-(playing ? 3 : 4) * dt));
    const step = g.speed * dt;
    g.dist += step;
    grass.offset.y += step / 5;
    path.offset.y += step / 5.5;

    // lane smoothing and jump
    g.laneX = THREE.MathUtils.lerp(g.laneX, g.lane * LANE_W, 1 - Math.exp(-14 * dt));
    if (playing) {
      g.jumpBuf = Math.max(0, g.jumpBuf - dt);
      if (g.jumpBuf > 0 && g.y <= 0.001) { g.vy = JUMP_V; g.jumpBuf = 0; }
      g.vy += GRAVITY * dt;
      g.y += g.vy * dt;
      if (g.y <= 0) { g.y = 0; g.vy = 0; }
      g.comboT -= dt;
      if (g.comboT <= 0) g.combo = 0;
      g.score = g.bonus + Math.floor(g.dist * 0.5);

      g.nextRow -= step;
      if (g.nextRow <= 0) {
        spawnRow(g);
        g.nextRow = Math.max(12, 8 + g.speed * 0.3);
      }
    }
    g.nextDeco -= step;
    if (g.nextDeco <= 0) {
      spawnDeco(g);
      g.nextDeco = 3.5 + Math.random() * 6;
    }

    // move objects, collisions
    let dirty = false;
    let crashed = false;
    const keep: Obj[] = [];
    for (const o of g.objects) {
      const prevZ = o.z;
      o.z += step;
      let remove = o.z > 14;
      if (playing && !remove && o.z > -0.9 && prevZ < 0.9 && Math.abs(o.x - g.laneX) < 0.95 && ((isObstacle(o.type) || isPickup(o.type)))) {
        if (isObstacle(o.type)) {
          if (g.y < 0.85) {
            if (g.shield) {
              g.shield = false;
              g.shake = 0.6;
              remove = true;
              onShieldHit();
            } else {
              crashed = true;
            }
          }
        } else if (isPickup(o.type) && Math.abs(o.y - (g.y + 1)) < 1.4) {
          remove = true;
          if (o.type === 'POWER_SHIELD') {
            g.shield = true;
          } else {
            g.combo += 1;
            g.comboT = 3;
            g.bonus += 10 * comboMult(g.combo);
          }
        }
      }
      if (remove) { dirty = true; continue; }
      if (o.ref) o.ref.position.set(o.x, o.y, o.z);
      keep.push(o);
    }
    if (keep.length !== g.objects.length) g.objects = keep;

    // objects added this frame also need a render pass
    if (g.objects.some((o) => !o.ref)) dirty = true;
    if (dirty) setVersion((v) => (v + 1) % 1e6);

    if (crashed) {
      g.state = 'GAMEOVER';
      g.shake = 1;
      onEnd(g.score);
    }

    // camera
    const sh = g.shake;
    g.shake = Math.max(0, g.shake - dt * 2.2);
    camera.position.set(g.laneX * 0.35 + (Math.random() - 0.5) * sh * 0.6, 4.3 + (Math.random() - 0.5) * sh * 0.4, 8.6);
    camera.lookAt(g.laneX * 0.2, 1.4, -9);
    const cam = camera as THREE.PerspectiveCamera;
    const fov = 52 + Math.min(1, Math.max(0, (g.speed - START_SPEED) / 30)) * 9;
    if (Math.abs(fov - fovRef.current) > 0.05) {
      fovRef.current = fov;
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // HUD, only when something changed
    const mult = comboMult(g.combo);
    const key = `${g.score}|${mult}|${g.combo}|${g.shield}|${levelOf(g.speed)}`;
    if (key !== lastHud.current) {
      lastHud.current = key;
      onHud({ score: g.score, mult, combo: g.combo, shield: g.shield, level: levelOf(g.speed) });
    }
  });

  const shadows = !isMobile;
  return (
    <>
      <fog attach="fog" args={[FOG, 38, 125]} />
      <hemisphereLight args={['#ffe9c4', '#5d6b33', 0.75]} />
      <directionalLight
        position={[-14, 16, 10]}
        intensity={1.9}
        color="#ffd9a0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
      {!isMobile && <Sky sunPosition={[-34, 7, -120]} turbidity={7} rayleigh={1.8} mieCoefficient={0.012} mieDirectionalG={0.92} />}
      {isMobile && <color attach="background" args={['#f3cf9d']} />}

      <Backdrop />

      {/* ground and path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -60]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -50]} receiveShadow>
        <planeGeometry args={[LANE_W * 3 + 0.4, 200]} />
        <meshStandardMaterial map={path} roughness={1} />
      </mesh>

      <Rider G={G} dust={!isMobile} character={character} />
      {G.current.objects.map((o) => (
        <Item key={o.id} o={o} shadows={shadows} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// The game component (HUD, start and game-over screens, leaderboard)
// ---------------------------------------------------------------------------
export default function LetsPlayGame() {
  const { t, i18n } = useTranslation();
  const r = (k: string, o?: Record<string, unknown>) => t(`heritagePage.runner.${k}`, o);

  const G = useRef<Game>(newGame('START'));
  const [state, setState] = useState<GameState>('START');
  const [hud, setHud] = useState<Hud>({ score: 0, mult: 1, combo: 0, shield: false, level: 1 });
  const [finalScore, setFinalScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [flash, setFlash] = useState(false);
  const [character, setCharacter] = useState<CharacterId>('herder');

  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      setBest(parseInt(localStorage.getItem('steppe-best') || '0', 10) || 0);
      const saved = localStorage.getItem('steppe-character') as CharacterId | null;
      if (saved && CHARACTER_IDS.includes(saved)) setCharacter(saved);
    } catch { /* storage blocked */ }

    const params = new URLSearchParams(window.location.search);
    const parsed = parseInt(params.get('score') || '', 10);
    if (!isNaN(parsed) && parsed > 0) setChallengeScore(parsed);

    const q = query(collection(db, 'game_scores'), orderBy('score', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scores: { name: string; score: number }[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        scores.push({ name: data.player_name ?? data.name ?? '?', score: Number(data.score) || 0 });
      });
      setLeaderboard(scores);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubscribe();
      window.dispatchEvent(new Event('game-ended'));
    };
  }, []);

  const act = (a: 'left' | 'right' | 'jump') => {
    const g = G.current;
    if (g.state !== 'PLAYING') return;
    if (a === 'left') g.lane = Math.max(-1, g.lane - 1);
    if (a === 'right') g.lane = Math.min(1, g.lane + 1);
    if (a === 'jump') g.jumpBuf = 0.14;
  };

  // keyboard (only while playing, so the page scrolls normally otherwise)
  useEffect(() => {
    if (state !== 'PLAYING') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') act('left');
      if (e.code === 'ArrowRight' || e.code === 'KeyD') act('right');
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') act('jump');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);

  const startGame = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    G.current = newGame('PLAYING');
    setHud({ score: 0, mult: 1, combo: 0, shield: false, level: 1 });
    setGameKey((k) => k + 1);
    setState('PLAYING');
    setHasSubmittedScore(false);
    setPlayerName('');
    setNewBest(false);
    window.dispatchEvent(new Event('game-started'));
    container.current?.focus();
  };

  const onEnd = (score: number) => {
    setFinalScore(score);
    setState('GAMEOVER');
    let isBest = false;
    try {
      const prev = parseInt(localStorage.getItem('steppe-best') || '0', 10) || 0;
      if (score > prev) {
        localStorage.setItem('steppe-best', String(score));
        isBest = score > 0;
        setBest(score);
      }
    } catch { /* storage blocked */ }
    setNewBest(isBest);
    window.dispatchEvent(new Event('game-ended'));
  };

  const chooseCharacter = (id: CharacterId) => {
    setCharacter(id);
    try { localStorage.setItem('steppe-character', id); } catch { /* storage blocked */ }
  };

  const onShieldHit = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 260);
  };

  const lang = (i18n.language || 'en').slice(0, 2);
  const shareUrl = 'https://mongoliancenter.org/game' + (finalScore > 0 ? `?score=${finalScore}&lang=${lang}` : '');
  const shareTitle = finalScore > 0 ? r('shareScore', { score: finalScore }) : r('shareInvite');

  const handleShare = (platform: string) => {
    let url = '';
    if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    if (platform === 'twitter') url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    if (platform === 'linkedin') url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    const list = [...leaderboard, { name: playerName.trim(), score: finalScore }].sort((a, b) => b.score - a.score);
    setLeaderboard(list.slice(0, 15));
    setHasSubmittedScore(true);
    try {
      await addDoc(collection(db, 'game_scores'), { playerName: playerName.trim(), score: Math.max(0, Math.min(finalScore, 1000000)), createdAt: serverTimestamp() });
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  const ctl = 'w-16 h-16 bg-brand-ink/80 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto active:bg-brand-gold active:text-brand-ink transition-colors shadow-lg';

  return (
    <div
      ref={container}
      id="lets-play-game-container"
      tabIndex={0}
      className="relative w-full h-[620px] bg-brand-ink rounded-[32px] overflow-hidden my-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-brand-gold/25 outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/50 cursor-pointer select-none touch-pan-y"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, input, form')) return;
        if (state === 'START') startGame(e);
        else if (state === 'PLAYING') act('jump');
      }}
      onKeyDown={(e) => {
        if (e.code === 'Space' && state !== 'PLAYING') {
          if ((e.target as HTMLElement).tagName === 'INPUT') return;
          startGame(e);
        }
      }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        const s = touch.current;
        touch.current = null;
        if (!s || state !== 'PLAYING') return;
        const dx = e.changedTouches[0].clientX - s.x;
        const dy = e.changedTouches[0].clientY - s.y;
        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) act(dx < 0 ? 'left' : 'right');
        else if (dy < -36) act('jump');
      }}
    >
      <Canvas shadows={!isMobile} dpr={[1, isMobile ? 1.5 : 2]} camera={{ position: [0, 4.3, 8.6], fov: 52, near: 0.1, far: 320 }}>
        <Scene key={gameKey} G={G} isMobile={isMobile} character={character} onHud={setHud} onEnd={onEnd} onShieldHit={onShieldHit} />
      </Canvas>

      {/* warm vignette */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(60,30,10,0.35)_100%)]" />
      {flash && <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-sky-300/35" />}

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex justify-between items-start pointer-events-none gap-3">
        <div className="flex flex-col gap-2 items-start">
          <div className="bg-brand-ink/80 backdrop-blur text-brand-gold px-5 py-2.5 rounded-full font-serif text-xl border border-brand-gold/30">
            {r('score')}: {hud.score}
          </div>
          {state === 'PLAYING' && (
            <div className="flex gap-2 flex-wrap">
              {hud.combo >= 2 && (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/90 text-brand-ink text-xs font-bold px-3 py-1.5 rounded-full">
                  <Flame size={14} /> {r('combo')} ×{hud.mult}
                </span>
              )}
              {hud.shield && (
                <span className="inline-flex items-center gap-1.5 bg-sky-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <ShieldCheck size={14} /> {r('shield')}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="text-white/80 text-xs uppercase tracking-widest font-bold bg-black/40 px-4 py-2 rounded-full">
            {r('level')} {hud.level}
          </div>
          {best > 0 && <div className="text-brand-gold/90 text-xs font-semibold bg-black/40 px-4 py-1.5 rounded-full">{r('best')}: {best}</div>}
        </div>
      </div>

      {/* touch controls */}
      {state === 'PLAYING' && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-6 z-20 pointer-events-none md:hidden px-4">
          <button className={ctl} aria-label="Left" onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); act('left'); }} onClick={(e) => e.stopPropagation()}><ChevronLeft size={30} /></button>
          <button className={ctl} aria-label="Jump" onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); act('jump'); }} onClick={(e) => e.stopPropagation()}><ChevronUp size={30} /></button>
          <button className={ctl} aria-label="Right" onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); act('right'); }} onClick={(e) => e.stopPropagation()}><ChevronRight size={30} /></button>
        </div>
      )}

      {state === 'START' && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-brand-ink/45 to-brand-ink/75 flex flex-col items-center justify-center z-10 text-center pointer-events-none px-4">
          <h2 className="text-5xl md:text-6xl font-serif text-brand-gold mb-3 italic drop-shadow-lg">{r('title')}</h2>
          {challengeScore !== null && (
            <div className="bg-brand-gold/20 border border-brand-gold/50 text-brand-gold px-6 py-2.5 rounded-2xl mb-4 animate-pulse text-sm font-semibold max-w-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              🏆 {r('challenge', { score: challengeScore })}
            </div>
          )}
          <p className="text-white/85 mb-5 max-w-md">{r('startText')}</p>
          <div className="pointer-events-auto mb-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-brand-gold/80 mb-2 font-semibold">{r('chooseCharacter')}</div>
            <div className="flex gap-2 md:gap-3 justify-center">
              {CHARACTER_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); chooseCharacter(id); }}
                  aria-pressed={character === id}
                  className={`flex flex-col items-center gap-1.5 w-[74px] md:w-[88px] pt-2 pb-2 rounded-2xl border transition-all ${character === id ? 'border-brand-gold bg-brand-gold/20 scale-105 shadow-[0_0_18px_rgba(212,175,55,0.35)]' : 'border-white/20 bg-black/30 hover:border-brand-gold/60'}`}
                >
                  <Avatar id={id} />
                  <span className={`text-[11px] md:text-xs font-semibold ${character === id ? 'text-brand-gold' : 'text-white/80'}`}>{r(`char.${id}`)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex gap-10 mb-8 text-white/70 text-sm">
            <div className="flex flex-col items-center gap-1.5"><span className="text-lg text-white font-mono">A / D / ← / →</span><span>{r('move')}</span></div>
            <div className="flex flex-col items-center gap-1.5"><span className="text-lg text-white font-mono">SPACE / ↑</span><span>{r('jump')}</span></div>
          </div>
          <p className="md:hidden text-white/70 mb-8 px-6 text-sm">{r('touchHint')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-xs text-white/70">
            <span><b className="text-brand-gold">◆</b> {r('tipCollect')}</span>
            <span><b className="text-sky-300">◆</b> {r('tipShield')}</span>
          </div>
          <button
            onClick={startGame}
            className="bg-brand-gold text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold shadow-[0_0_30px_rgba(212,175,55,0.45)] pointer-events-auto hover:bg-white transition-all hover:scale-105"
          >
            {r('start')}
          </button>
        </div>
      )}

      {state === 'GAMEOVER' && (
        <div className="absolute inset-0 bg-[#3a1415]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-center z-10 gap-8 pointer-events-none p-6 overflow-y-auto w-full">
          <div className="text-center w-full max-w-sm shrink-0">
            <h2 className="text-5xl font-serif text-white mb-2">{r('gameOver')}</h2>
            <p className="text-2xl text-brand-gold mb-2 font-serif">{r('finalScore')}: {finalScore}</p>
            {newBest && <p className="text-amber-300 text-sm font-semibold mb-4">★ {r('newBest')}</p>}
            {!newBest && <div className="mb-4" />}

            {!hasSubmittedScore && finalScore > 0 ? (
              <form onSubmit={saveScore} className="mb-6 pointer-events-auto">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={r('namePlaceholder')}
                  className="w-full bg-black/30 border border-brand-gold/30 rounded-full px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold mb-4 text-center text-lg shadow-inner"
                  maxLength={15}
                  required
                />
                <button type="submit" className="w-full bg-brand-gold text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  {r('submit')}
                </button>
              </form>
            ) : (
              <div className="mb-6 text-brand-gold/80 italic font-serif">
                {finalScore > 0 && challengeScore !== null
                  ? finalScore >= challengeScore
                    ? `🏆 ${r('beat', { score: challengeScore })}`
                    : r('noBeat', { score: challengeScore })
                  : finalScore > 0
                    ? r('saved')
                    : r('tryAgain')}
              </div>
            )}

            <button onClick={startGame} className="bg-white text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold shadow-xl pointer-events-auto hover:bg-brand-gold hover:text-white transition-all hover:scale-105">
              {r('playAgain')}
            </button>

            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-brand-gold/20 pointer-events-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/60">{r('share')}</span>
              <div className="flex gap-2 justify-center">
                <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/80 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors" aria-label="Facebook"><Facebook size={16} /></button>
                <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/80 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors" aria-label="Twitter"><Twitter size={16} /></button>
                <button onClick={() => handleShare('linkedin')} className="w-10 h-10 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/80 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors" aria-label="LinkedIn"><Linkedin size={16} /></button>
                <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/80 hover:bg-brand-gold hover:text-brand-ink hover:border-brand-gold transition-colors" aria-label="Copy link">{copied ? <Check size={16} /> : <LinkIcon size={16} />}</button>
              </div>
            </div>
          </div>

          <div className={`bg-brand-ink/90 border border-brand-gold/30 rounded-3xl p-6 w-full max-w-sm pointer-events-auto relative overflow-hidden ${hasSubmittedScore || finalScore === 0 ? 'block' : 'hidden md:block'}`}>
            <h3 className="text-xl font-serif text-brand-gold mb-6 text-center flex items-center justify-center gap-2 relative z-10">
              <span className="w-8 h-px bg-brand-gold/30" />
              {r('hall')}
              <span className="w-8 h-px bg-brand-gold/30" />
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {leaderboard.length === 0 ? (
                <p className="text-white/50 text-center text-sm italic">{r('noHeroes')}</p>
              ) : (
                leaderboard.map((entry, i) => (
                  <div key={i} className="flex justify-between items-center group bg-black/20 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-4">
                      <span className={`font-serif ${i === 0 ? 'text-2xl text-brand-gold' : i === 1 ? 'text-xl text-gray-300' : i === 2 ? 'text-lg text-amber-600' : 'text-base text-white/50'} w-6 text-center`}>{i + 1}</span>
                      <span className="text-white font-medium group-hover:text-brand-gold transition-colors">{entry.name}</span>
                    </div>
                    <span className="font-mono text-brand-gold/80 bg-brand-gold/10 px-3 py-1 rounded-full text-sm">{entry.score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
