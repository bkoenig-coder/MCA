import * as THREE from 'three';

export type Mood = 'dawn' | 'day' | 'sunset' | 'night';

export interface MoodParams {
  /** sun/moon direction (a point far away) */
  sun: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  fog: string;
  fogNear: number;
  fogFar: number;
  /** sky gradient: overhead, middle, horizon, and how strongly the sun glows */
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  glow: number;
  stars: number;
  envIntensity: number;
  bloom: number;
  exposure: number;
  cloud: string;
  cloudShade: string;
  sparkle: string;
}

export const MOODS: Record<Mood, MoodParams> = {
  dawn: {
    sun: [60, 10, -35],
    sunColor: '#ffc7a1',
    sunIntensity: 2.4,
    hemiSky: '#c4b5e8',
    hemiGround: '#5b4a5c',
    hemiIntensity: 0.75,
    fog: '#eeb3b0',
    fogNear: 45,
    fogFar: 190,
    skyTop: '#464c9c',
    skyMid: '#e59db4',
    skyBottom: '#ffd0a4',
    glow: 1.1,
    stars: 0.0,
    envIntensity: 0.55,
    bloom: 0.45,
    exposure: 1.0,
    cloud: '#fff0ec',
    cloudShade: '#b886a8',
    sparkle: '#ffe3c4',
  },
  day: {
    sun: [25, 55, -15],
    sunColor: '#fff4dc',
    sunIntensity: 3.0,
    hemiSky: '#a9cdf5',
    hemiGround: '#55653c',
    hemiIntensity: 0.9,
    fog: '#cfe4f6',
    fogNear: 55,
    fogFar: 230,
    skyTop: '#2a72d4',
    skyMid: '#8ac2f2',
    skyBottom: '#e6f1fb',
    glow: 0.4,
    stars: 0.0,
    envIntensity: 0.8,
    bloom: 0.25,
    exposure: 1.0,
    cloud: '#ffffff',
    cloudShade: '#a9c4e4',
    sparkle: '#fff7d6',
  },
  sunset: {
    sun: [-55, 13, -30],
    sunColor: '#ffae63',
    sunIntensity: 3.4,
    hemiSky: '#e9a98a',
    hemiGround: '#40355a',
    hemiIntensity: 0.95,
    fog: '#f2a273',
    fogNear: 45,
    fogFar: 190,
    skyTop: '#1c2268',
    skyMid: '#dc5f66',
    skyBottom: '#ffb25e',
    glow: 1.5,
    stars: 0.0,
    envIntensity: 0.6,
    bloom: 0.6,
    exposure: 1.05,
    cloud: '#fff0dc',
    cloudShade: '#a64f6e',
    sparkle: '#ffd9a0',
  },
  night: {
    sun: [35, 26, -50],
    sunColor: '#86a7ff',
    sunIntensity: 1.5,
    hemiSky: '#4a62b4',
    hemiGround: '#141c3a',
    hemiIntensity: 0.85,
    fog: '#0b1740',
    fogNear: 35,
    fogFar: 150,
    skyTop: '#02040f',
    skyMid: '#0a1433',
    skyBottom: '#1c2c66',
    glow: 0.25,
    stars: 1.0,
    envIntensity: 0.3,
    bloom: 1.0,
    exposure: 1.2,
    cloud: '#5b73b8',
    cloudShade: '#101a45',
    sparkle: '#ffd37a',
  },
};

export const MOOD_LIST: Mood[] = ['dawn', 'day', 'sunset', 'night'];

export const tmpColor = new THREE.Color();
