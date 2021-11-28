import { Context, Objct } from "./common.js";
import Vector from "./vector.js";

export class Obstacle implements Objct {
  force: Vector;
  isObjectCollisionBelow: boolean;
  constructor(
    private context: Context,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public mass: number
  ) {
    this.force = new Vector(0, 0);
    this.isObjectCollisionBelow = false;
  }
  collision(obj1: Objct, obj2: Objct): void {}
  
  addForces(): void {
    // no forces added to obstacle
  }
  draw(): void {
    this.context.ctx.fillStyle = '#795548';
    this.context.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
