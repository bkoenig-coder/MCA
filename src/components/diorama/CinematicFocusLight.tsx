import React from 'react';

interface CinematicLightProps {
  hovered: boolean;
  color?: string;
  position?: [number, number, number];
}

export function CinematicFocusLight({ hovered, color = "#ffcfaa", position = [0, 8, 0] }: CinematicLightProps) {
  return null;
}
