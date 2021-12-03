import Vector from "./vector.js";

export interface Context {
  ctx: CanvasRenderingContext2D;

  keys: Keys;

  // speed multiplier
  speed: number;

  // jump force
  jumpForce: number;

  // ground force, applied when in contact with ground
  groundForce: number;

  // ground force limit
  groundForceLimit: number;

  // reduction of ground force every draw
  groundForceReduction: number;

  // air movement when changing direction
  airForce: number;

  // limit air movement
  airForceLimit: number;

  gravity: number;
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

export interface Movable {
  moveLeft(): void;
  moveRight(): void;
  jump(): void;
}

export type Keys = Record<string, boolean>;

export interface Objct extends Point, Size, Mass {
  isInConcactWithGround: boolean;
  force: Vector;
  draw(): void;
  addForces(): void;
  collision(obj: Objct): void;
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Clip { 
  isClippingLeft: boolean; 
  isClippingRight: boolean;
  isClippingUp: boolean; 
  isClippingDown: boolean; 
};

export function calculateClip(obj1: Objct, obj2: Objct): Clip {
  const isClippingLeft = obj2.x < obj1.x && obj2.x + obj2.width >= obj1.x && obj1.x + obj1.width > obj2.x + obj2.width && obj2.x + obj2.width - obj1.x < 25; 
  const isClippingRight = obj1.x < obj2.x && obj1.x + obj1.width >= obj2.x && obj1.x + obj1.width < obj2.x + obj2.width && obj1.x + obj1.width - obj2.x < 25;
  const isClippingDown = obj1.y < obj2.y && obj1.y + obj1.height >= obj2.y && obj2.y + obj2.height > obj1.y + obj1.height && obj1.y + obj1.height - obj2.y < 25;
  const isClippingUp = obj2.y < obj1.y && obj2.y + obj2.height >= obj1.y && obj2.y + obj2.height < obj1.y + obj1.height && obj2.y + obj2.height - obj1.y < 25;

  return { isClippingLeft, isClippingRight, isClippingUp, isClippingDown };
}