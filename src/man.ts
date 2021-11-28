import { Context, Keys, Objct, Point } from "./common.js";
import Vector from "./vector.js";

export class Man implements Objct {
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
  mass: number;
  force: Vector;
  drawCounter: number;
  isObjectCollisionBelow: boolean;

  constructor(private context: Context, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.scale = 0.1;
    this.mass = 10;
    this.force = new Vector(0, 0);
    this.drawCounter = 0;
    this.isObjectCollisionBelow = false;
  }
  collision(obj1: Objct, obj2: Objct): void {}

  addForces() {

    const xForce = this.isObjectCollisionBelow ? this.context.groundForce : this.context.groundForce / 10;

    // jump
    if (this.context.keys.ArrowUp && this.isObjectCollisionBelow) {
      this.force.add(new Vector(0, -this.context.jumpForce));
    }
    // move right
    if (this.context.keys.ArrowRight) {
      this.force.add(new Vector(xForce, 0));
      // move left
    } else if (this.context.keys.ArrowLeft) {
      this.force.add(new Vector(-xForce, 0));
    }

    this.force.add(new Vector(0, 2));
    if (this.isObjectCollisionBelow)
      this.force.add(new Vector(-this.force.x * this.context.groundForceReduction, 0));
    this.force.limitTo(this.context.airForceLimit);
    this.force.limitTo(this.context.groundForceLimit);

  }

  draw() {
    const offsetx = this.width / 2;
    const offsety = this.height / 2;
    const x = this.x + offsetx;
    const y = this.y + offsety;

    this.context.ctx.fillStyle = 'black';
    this.context.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.context.ctx.fillStyle = 'white';
    this.context.ctx.fillRect(this.x + this.width / 5, this.y + this.height / 10, this.width / 5, this.height / 10);

  }

  move(dx: number, dy: number) {
    // this.x += dx;
    // this.y += dy;
  }
}
