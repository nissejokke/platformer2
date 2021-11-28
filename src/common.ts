import Vector from "./vector.js";

export interface Context {
  ctx: CanvasRenderingContext2D;

  keys: Keys;

  // speed multiplier
  speed: number;

  // jump force
  jumpForce: number;

  // ground force, applied when in concat with ground
  groundForce: number;

  // ground force limit
  groundForceLimit: number;

  // reduction of ground force every draw
  groundForceReduction: number;

  // air movement when changing direction
  airForce: number;

  // limit air movement
  airForceLimit: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Mass {
  mass: number;
}

export type Keys = Record<string, boolean>;

export interface Objct extends Point, Size, Mass {
  isObjectCollisionBelow: boolean;
  force: Vector;
  draw(): void;
  addForces(): void;
  collision(obj1: Objct, obj2: Objct): void;
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
