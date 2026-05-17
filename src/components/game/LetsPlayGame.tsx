import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Environment, BakeShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronUp, ChevronRight } from 'lucide-react';

// 1. Types & Constants
const LANE_WIDTH = 2;
const MAX_LANES = 1; // -1, 0, 1
const OBSTACLE_SPEED = 15;
const GRAVITY = -30;
const JUMP_FORCE = 12;

type GameState = 'START' | 'PLAYING' | 'GAMEOVER';

type GameObject = {
  id: string;
  type: 'OBSTACLE_ROCK' | 'OBSTACLE_FENCE' | 'COLLECTIBLE_BOW' | 'COLLECTIBLE_SHIELD' | 'COLLECTIBLE_MORIN' | 'DECORATION_GER' | 'DECORATION_TREE';
  position: [number, number, number];
  collected?: boolean;
};

// 2. Character Component
const Player = ({ position, isJumping, onGround, isPlaying }: { position: [number, number, number], isJumping: boolean, onGround: boolean, isPlaying: boolean }) => {
  const group = useRef<THREE.Group>(null);
  
  // Horse parts
  const hFrontLeft = useRef<THREE.Mesh>(null);
  const hFrontRight = useRef<THREE.Mesh>(null);
  const hBackLeft = useRef<THREE.Mesh>(null);
  const hBackRight = useRef<THREE.Mesh>(null);
  const hNeck = useRef<THREE.Mesh>(null);
  
  // Rider parts
  const rLeftArm = useRef<THREE.Mesh>(null);
  const rRightArm = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    
    // Smooth position interpolation
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.2);
    group.current.position.y = position[1];
    group.current.position.z = position[2];

    if (!isPlaying) {
      if (hFrontLeft.current) hFrontLeft.current.rotation.x = 0;
      if (hFrontRight.current) hFrontRight.current.rotation.x = 0;
      if (hBackLeft.current) hBackLeft.current.rotation.x = 0;
      if (hBackRight.current) hBackRight.current.rotation.x = 0;
      if (hNeck.current) hNeck.current.rotation.x = Math.PI / 4;
      if (rLeftArm.current) rLeftArm.current.rotation.x = 0;
      if (rRightArm.current) rRightArm.current.rotation.x = 0;
      return;
    }

    const time = state.clock.getElapsedTime();
    const runSpeed = 20;
    
    // Galloping animation
    if (onGround) {
      // Horse galloping (front legs together, back legs together roughly)
      const gallopOffset = Math.sin(time * runSpeed) * 0.5;
      if (hFrontLeft.current) hFrontLeft.current.rotation.x = gallopOffset;
      if (hFrontRight.current) hFrontRight.current.rotation.x = gallopOffset - 0.2;
      if (hBackLeft.current) hBackLeft.current.rotation.x = -gallopOffset + 0.2;
      if (hBackRight.current) hBackRight.current.rotation.x = -gallopOffset;
      
      // Neck bobs
      if (hNeck.current) hNeck.current.rotation.x = (Math.PI / 4) + (Math.sin(time * runSpeed) * 0.1);
      
      // Rider bounces a bit (the whole group moves in GameLoop, but we can animate arms)
      if (rLeftArm.current) rLeftArm.current.rotation.x = -0.3 + (Math.sin(time * runSpeed) * 0.1);
      if (rRightArm.current) rRightArm.current.rotation.x = -0.3 + (Math.sin(time * runSpeed) * 0.1);
    } else {
      // Jumping pose
      if (hFrontLeft.current) hFrontLeft.current.rotation.x = -0.5;
      if (hFrontRight.current) hFrontRight.current.rotation.x = -0.5;
      if (hBackLeft.current) hBackLeft.current.rotation.x = 0.3;
      if (hBackRight.current) hBackRight.current.rotation.x = 0.3;
      if (hNeck.current) hNeck.current.rotation.x = (Math.PI / 4) - 0.2;
      
      if (rLeftArm.current) rLeftArm.current.rotation.x = -0.6;
      if (rRightArm.current) rRightArm.current.rotation.x = -0.6;
    }
  });

  const horseColor = "#8B4513";
  const horseManeColor = "#3e1c00";
  const riderGold = "#d4af37";

  return (
    <group ref={group}>
      {/* ---------------- HORSE ---------------- */}
      <group position={[0, Math.sin(0)*0.1 /* optional bounce */, 0]}>
        {/* Horse Body */}
        <mesh position={[0, 0.8, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.6, 1.3]} />
          <meshStandardMaterial color={horseColor} />
        </mesh>
        
        {/* Horse Tail */}
        <mesh position={[0, 0.9, 0.5]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={horseManeColor} />
        </mesh>

        {/* Horse Neck & Head */}
        <group ref={hNeck} position={[0, 1.1, -0.6]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.7, 0.3]} />
            <meshStandardMaterial color={horseColor} />
          </mesh>
          {/* Mane */}
          <mesh position={[0, 0.3, 0.15]} castShadow>
            <boxGeometry args={[0.05, 0.7, 0.1]} />
            <meshStandardMaterial color={horseManeColor} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.7, -0.1]} rotation={[-Math.PI / 4 + 0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.25, 0.25, 0.6]} />
            <meshStandardMaterial color={horseColor} />
          </mesh>
        </group>

        {/* Horse Legs */}
        {/* Front Left */}
        <mesh ref={hFrontLeft} position={[-0.2, 0.4, -0.6]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color={horseColor} />
        </mesh>
        {/* Front Right */}
        <mesh ref={hFrontRight} position={[0.2, 0.4, -0.6]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color={horseColor} />
        </mesh>
        {/* Back Left */}
        <mesh ref={hBackLeft} position={[-0.2, 0.4, 0.3]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color={horseColor} />
        </mesh>
        {/* Back Right */}
        <mesh ref={hBackRight} position={[0.2, 0.4, 0.3]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <meshStandardMaterial color={horseColor} />
        </mesh>
      </group>

      {/* ---------------- RIDER ---------------- */}
      <group position={[0, 1.1, 0]}>
        {/* Body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.3]} />
          <meshStandardMaterial color="#8a2a2b" />
        </mesh>
        {/* Belt */}
        <mesh position={[0, 0.1, 0.02]} castShadow>
          <boxGeometry args={[0.42, 0.1, 0.32]} />
          <meshStandardMaterial color={riderGold} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#ffc099" />
        </mesh>
        {/* Hat */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0, 0.25, 0.3, 4]} />
          <meshStandardMaterial color="#1f3b4d" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshStandardMaterial color="#8a2a2b" />
        </mesh>
        {/* Arms */}
        <mesh ref={rLeftArm} position={[-0.25, 0.4, 0]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#8a2a2b" />
        </mesh>
        <mesh ref={rRightArm} position={[0.25, 0.4, 0]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshStandardMaterial color="#8a2a2b" />
        </mesh>
        {/* Rider Legs (splayed over horse) */}
        <mesh position={[-0.25, 0, 0]} rotation={[0.2, 0, 0.4]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[0.2, 0, -0.4]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
};

// 3. Environment & Objects
const Ger = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[2, 2, 2, 16]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
    <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
      <coneGeometry args={[2.2, 1, 16]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  </group>
);

const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Trunk */}
    <mesh position={[0, 1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.3, 0.4, 2]} />
      <meshStandardMaterial color="#4a3018" />
    </mesh>
    {/* Leaves */}
    <mesh position={[0, 3, 0]} castShadow receiveShadow>
      <coneGeometry args={[1.5, 3, 8]} />
      <meshStandardMaterial color="#2d5a27" />
    </mesh>
    <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
      <coneGeometry args={[1.2, 2.5, 8]} />
      <meshStandardMaterial color="#356b2f" />
    </mesh>
  </group>
);

const ObstacleRock = ({ position }: { position: [number, number, number] }) => (
  <mesh position={position} castShadow receiveShadow>
    <dodecahedronGeometry args={[0.6, 0]} />
    <meshStandardMaterial color="#7f8c8d" roughness={0.8} />
  </mesh>
);

const ObstacleFence = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.8, 0.2]} />
      <meshStandardMaterial color="#8b5a2b" />
    </mesh>
  </group>
);

const Collectible = ({ type, position }: { type: string, position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 2;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position}>
      {type === 'COLLECTIBLE_BOW' && (
        <group scale={1.5} position={[0, -0.2, 0]}>
          {/* Bow body */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
          {/* Bow string */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.6]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
          <pointLight color="#f1c40f" distance={3} intensity={2} />
          <Sparkles count={10} color="#f1c40f" scale={0.5} size={2} speed={0.4} />
        </group>
      )}
      
      {type === 'COLLECTIBLE_SHIELD' && (
        <group rotation={[Math.PI / 2, 0, 0]} scale={1.2}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
            <meshStandardMaterial color="#e67e22" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
          </mesh>
          <pointLight color="#e67e22" distance={3} intensity={2} />
          <Sparkles count={10} color="#e67e22" scale={0.5} size={2} speed={0.4} />
        </group>
      )}

      {type === 'COLLECTIBLE_MORIN' && (
        <group scale={1.2} position={[0, -0.2, 0]}>
          {/* Fiddle body */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.1]} />
            <meshStandardMaterial color="#5c3a21" />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.5]} />
            <meshStandardMaterial color="#2c1a0e" />
          </mesh>
          {/* Horse head top */}
          <mesh position={[0, 0.5, 0.05]} castShadow>
            <boxGeometry args={[0.1, 0.15, 0.15]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
          <pointLight color="#e74c3c" distance={3} intensity={2} />
          <Sparkles count={10} color="#e74c3c" scale={0.5} size={2} speed={0.4} />
        </group>
      )}
    </group>
  );
};

// 4. Game Engine
const GameLoop = ({ 
  gameState, 
  setGameState, 
  setScore, 
  score 
}: { 
  gameState: GameState, 
  setGameState: (s: GameState) => void, 
  setScore: (s: number | ((prev: number) => number)) => void,
  score: number
}) => {
  const [lane, setLane] = useState(0); // -1, 0, 1
  const [yPos, setYPos] = useState(0);
  const [yVel, setYVel] = useState(0);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const speedRef = useRef(OBSTACLE_SPEED);
  
  const playerZ = 0; // Player fixed Z
  
  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow typing in inputs
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      // Prevent scrolling for game keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (gameState !== 'PLAYING') return;
      
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && lane > -MAX_LANES) setLane(l => l - 1);
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && lane < MAX_LANES) setLane(l => l + 1);
      if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && yPos === 0) {
        setYVel(JUMP_FORCE);
      }
    };

    const handleCustomAction = (e: Event) => {
      const action = (e as CustomEvent).detail?.action;
      if (gameState !== 'PLAYING') return;
      if (action === 'left' && lane > -MAX_LANES) setLane(l => l - 1);
      if (action === 'right' && lane < MAX_LANES) setLane(l => l + 1);
      if (action === 'jump' && yPos === 0) setYVel(JUMP_FORCE);
    };

    // We get the element by ID we will define below to add the event listener to avoid global scroll blocking
    const container = document.getElementById('lets-play-game-container');
    if (container) {
       container.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('game-action', handleCustomAction);
    
    return () => {
      if (container) {
         container.removeEventListener('keydown', handleKeyDown);
      }
      window.removeEventListener('game-action', handleCustomAction);
    };
  }, [lane, yPos, gameState, setGameState, setScore]);

    // Game tick
    useFrame((state, delta) => {
      if (gameState !== 'PLAYING') return;
  
      // Physics
      let nextY = yPos + yVel * delta;
      let nextYVel = yVel + GRAVITY * delta;
      if (nextY <= 0) {
        nextY = 0;
        nextYVel = 0;
      }
      setYPos(nextY);
      setYVel(nextYVel);
  
      // Increase speed based on score (Level up every 50 points)
      const level = Math.floor(score / 50);
      const targetSpeed = OBSTACLE_SPEED + level * 5;
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 0.05);
  
      // Move objects
    let collision = false;
    let scoreIncrease = 0;
    
    const remaining: GameObject[] = [];
    objects.forEach(obj => {
      if (obj.collected) return;
      
      let newZ = obj.position[2] + speedRef.current * delta;
      
      // Collision Detection
      const hitX = Math.abs((obj.position[0] / LANE_WIDTH) - lane) < 0.5;
      const hitZ = newZ > -0.8 && newZ < 0.8;
      
      if (hitX && hitZ) {
        if (obj.type.startsWith('OBSTACLE')) {
           if (nextY < 0.8) {
             // Hit obstacle
             collision = true;
           }
        } else if (obj.type.startsWith('COLLECTIBLE')) {
          // Collect
          scoreIncrease += 10;
          return; // remove
        }
      }
      
      if (newZ < 10) { // keep if not past camera
         remaining.push({ ...obj, position: [obj.position[0], obj.position[1], newZ] });
      }
    });

    if (scoreIncrease > 0) {
      setScore(s => s + scoreIncrease);
    }

    // Spawn new objects
    if (Math.random() < 0.04 * (speedRef.current / OBSTACLE_SPEED) && remaining.length < 30) {
       const spawnLane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
       const rand = Math.random();
       let type: GameObject['type'] = 'OBSTACLE_ROCK';
       if (rand < 0.2) type = 'COLLECTIBLE_BOW';
       else if (rand < 0.3) type = 'COLLECTIBLE_SHIELD';
       else if (rand < 0.4) type = 'COLLECTIBLE_MORIN';
       else if (rand < 0.7) type = 'OBSTACLE_FENCE';
       
       // Prevent spawning inside another object too close
       const tooClose = remaining.some(o => Math.abs(o.position[2] - (-40)) < 6 && Math.abs((o.position[0]/LANE_WIDTH) - spawnLane) < 0.1);
       
       if (!tooClose) {
         remaining.push({
            id: Math.random().toString(),
            type,
            position: [spawnLane * LANE_WIDTH, type.includes('FENCE') ? 0 : type.includes('COLLECTIBLE') ? 1 : 0.3, -40]
         });
       }
    }

    // Spawn decorations
    if (Math.random() < 0.05 * (speedRef.current / OBSTACLE_SPEED)) {
       const side = Math.random() < 0.5 ? -1 : 1;
       const distMultiplier = 4 + Math.random() * 8; // Spawns at X = 8 to 24
       const decorationType: GameObject['type'] = Math.random() < 0.3 ? 'DECORATION_GER' : 'DECORATION_TREE';
       
       remaining.push({
          id: Math.random().toString(),
          type: decorationType,
          position: [side * LANE_WIDTH * distMultiplier, 0, -60] // Spawn slightly farther back
       });
    }

    setObjects(remaining);

    if (collision) {
      setGameState('GAMEOVER');
    }
  });

  return (
    <>
      <Player position={[lane * LANE_WIDTH, yPos, playerZ]} isJumping={yPos > 0} onGround={yPos === 0} isPlaying={gameState === 'PLAYING'} />
      
      {/* Scrolling Ground Pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -20]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a7a3a" />
      </mesh>
      
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow>
        <planeGeometry args={[LANE_WIDTH * 3 + 1, 100]} />
        <meshStandardMaterial color="#a0785a" />
      </mesh>

      {/* Environment (Ground path) is above */}

      {/* Dynamic Objects */}
      {objects.map(obj => {
         if (obj.type === 'OBSTACLE_ROCK') return <ObstacleRock key={obj.id} position={obj.position} />;
         if (obj.type === 'OBSTACLE_FENCE') return <ObstacleFence key={obj.id} position={obj.position} />;
         if (obj.type.startsWith('COLLECTIBLE')) return <Collectible key={obj.id} type={obj.type} position={obj.position} />;
         if (obj.type === 'DECORATION_GER') return <Ger key={obj.id} position={obj.position} />;
         if (obj.type === 'DECORATION_TREE') return <Tree key={obj.id} position={obj.position} />;
         return null;
      })}
    </>
  );
};

export default function LetsPlayGame() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number}[]>([]);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('letsPlayLeaderboard');
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }, []);

  const saveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    const newList = [...leaderboard, { name: playerName.trim(), score }];
    newList.sort((a, b) => b.score - a.score);
    const top10 = newList.slice(0, 10);
    setLeaderboard(top10);
    localStorage.setItem('letsPlayLeaderboard', JSON.stringify(top10));
    setHasSubmittedScore(true);
  };

  const startGame = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
       e.preventDefault();
       e.stopPropagation();
    }
    setScore(0);
    setGameKey(k => k + 1);
    setGameState('PLAYING');
    setHasSubmittedScore(false);
    setPlayerName('');
    document.getElementById('lets-play-game-container')?.focus();
  };

  return (
    <div 
      id="lets-play-game-container" 
      tabIndex={0} 
      className="relative w-full h-[600px] bg-brand-ink rounded-[40px] overflow-hidden my-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-brand-gold/20 outline-none focus:ring-4 focus:ring-brand-gold/50 cursor-pointer group"
      onClick={(e) => {
        if (gameState === 'START') startGame(e);
      }}
      onKeyDown={(e) => {
        if (e.code === 'Space' && gameState !== 'PLAYING') {
           if ((e.target as HTMLElement).tagName === 'INPUT') return;
           startGame(e);
        }
      }}
    >
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 50 }}>
        <color attach="background" args={['#87CEEB']} /> {/* Blue sky */}
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.4} />
        <directionalLight 
           position={[10, 20, 5]} 
           intensity={1.2} 
           castShadow 
           shadow-mapSize={[1024, 1024]}
        />
        
        <GameLoop key={gameKey} gameState={gameState} setGameState={setGameState} setScore={setScore} score={score} />
        
        <Sparkles count={200} scale={[40, 10, 40]} size={6} speed={0.2} opacity={0.3} position={[0, 5, -20]} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
        <div className="bg-brand-ink/80 backdrop-blur text-brand-gold px-6 py-3 rounded-full font-serif text-xl border border-brand-gold/30">
          Score: {score}
        </div>
        <div className="text-white/50 text-sm uppercase tracking-widest font-bold bg-black/40 px-4 py-2 rounded-full">
          Let's Play
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-6 z-20 pointer-events-none md:hidden px-4">
            <button 
                className="w-16 h-16 bg-brand-ink/80 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto active:bg-brand-gold active:text-brand-ink transition-colors shadow-lg"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('game-action', { detail: { action: 'left' } })); }}
            >
                <ChevronLeft size={32} />
            </button>
            <button 
                className="w-16 h-16 bg-brand-ink/80 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto active:bg-brand-gold active:text-brand-ink transition-colors shadow-lg mx-auto"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('game-action', { detail: { action: 'jump' } })); }}
            >
                <ChevronUp size={32} />
            </button>
            <button 
                className="w-16 h-16 bg-brand-ink/80 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white pointer-events-auto active:bg-brand-gold active:text-brand-ink transition-colors shadow-lg"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new CustomEvent('game-action', { detail: { action: 'right' } })); }}
            >
                <ChevronRight size={32} />
            </button>
        </div>
      )}

      {gameState === 'START' && (
        <div className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-center pointer-events-none">
          <h2 className="text-5xl font-serif text-brand-gold mb-4 italic">Steppe Runner</h2>
          <p className="text-white/80 mb-8 max-w-md px-4">Collect cultural artifacts. Avoid obstacles. Experience the endless Mongolian steppe.</p>
          <div className="flex gap-6 mb-12 text-white/60 hidden md:flex">
            <div className="flex flex-col items-center"><span className="text-2xl mb-2 text-white font-mono">A / D</span><span>Move</span></div>
            <div className="flex flex-col items-center"><span className="text-2xl mb-2 text-white font-mono">SPACE</span><span>Jump</span></div>
          </div>
          <div className="md:hidden text-white/60 mb-12 px-8 text-sm">
            Use the on-screen buttons to steer and jump.
          </div>
          <button 
            onClick={startGame}
            className="bg-brand-gold text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold shadow-[0_0_30px_rgba(212,175,55,0.4)] pointer-events-auto hover:bg-white transition-all transform hover:scale-105"
          >
            Start Journey
          </button>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 bg-[#4a1c1d]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-center z-10 gap-8 pointer-events-none p-6 overflow-y-auto">
           <div className="text-center flex-1 max-w-sm">
              <h2 className="text-5xl font-serif text-white mb-2">Game Over</h2>
              <p className="text-2xl text-brand-gold mb-8 font-serif">Final Score: {score}</p>
              
              {!hasSubmittedScore && score > 0 ? (
                 <form onSubmit={saveScore} className="mb-8 pointer-events-auto">
                    <input 
                      type="text" 
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      placeholder="Enter your name" 
                      className="w-full bg-black/30 border border-brand-gold/30 rounded-full px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-gold mb-4 text-center text-lg shadow-inner"
                      maxLength={15}
                      required
                    />
                    <button type="submit" className="w-full bg-brand-gold text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      Submit Score
                    </button>
                 </form>
              ) : (
                 <div className="mb-8 text-brand-gold/80 italic font-serif">
                   {score > 0 ? "Score saved to the chronicles." : "A valiant effort. Try again."}
                 </div>
              )}

              <button 
                onClick={startGame}
                className="bg-white text-brand-ink px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold shadow-xl pointer-events-auto hover:bg-brand-gold hover:text-white transition-all transform hover:scale-105"
              >
                Play Again
              </button>
           </div>

           {/* Leaderboard panel */}
           <div className={`bg-brand-ink/90 border border-brand-gold/30 rounded-3xl p-6 w-full max-w-sm pointer-events-auto relative overflow-hidden ${hasSubmittedScore || score === 0 ? 'block' : 'hidden md:block'}`}>
             {/* Decorative Background Pattern */}
             <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8cGF0aCBkPSJNMCAyMCBMMjAgMCBMNDAgMjAgTDIwIDQwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+CiAgPHBhdGggZD0iTTEwIDIwIEwyMCAxMCBMMzAgMjAgTDIwIDMwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2Q0YWYzNyIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPC9zdmc+')`, backgroundSize: '40px 40px' }}></div>
             
             <h3 className="text-xl font-serif text-brand-gold mb-6 text-center flex items-center justify-center gap-2 relative z-10">
               <span className="w-8 h-[1px] bg-brand-gold/30"></span>
               Hall of Heroes
               <span className="w-8 h-[1px] bg-brand-gold/30"></span>
             </h3>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
               {leaderboard.length === 0 ? (
                 <p className="text-white/50 text-center text-sm italic">No heroes recorded yet.</p>
               ) : (
                 leaderboard.map((entry, i) => (
                   <div key={i} className="flex justify-between items-center group">
                     <div className="flex items-center gap-3">
                       <span className={`font-serif ${i === 0 ? 'text-2xl text-brand-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]' : i === 1 ? 'text-xl text-gray-300' : i === 2 ? 'text-lg text-amber-600' : 'text-md text-white/50'} w-6 text-center`}>{i + 1}</span>
                       <span className="text-white group-hover:text-brand-gold transition-colors">{entry.name}</span>
                     </div>
                     <span className="font-mono text-brand-gold/80">{entry.score}</span>
                   </div>
                 ))
               )}
             </div>
             
             <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-brand-ink/80 to-transparent pointer-events-none"></div>
           </div>
        </div>
      )}
    </div>
  );
}
