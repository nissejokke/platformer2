import { calculateClip, Context, Movable, Objct } from "./common.js";
import Vector from "./vector.js";

export class Creature implements Objct, Movable {
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
  mass: number;
  force: Vector;
  drawCounter: number;
  isInConcactWithGround: boolean;
  facingLeft: boolean;

  constructor(private context: Context, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.scale = 0.1;
    this.mass = 10;
    this.force = new Vector(0, 0);
    this.drawCounter = 0;
    this.isInConcactWithGround = false;
    this.facingLeft = false;
  }
  
  collision(obj: Objct): void {
    // Two objects clipping:
    // /--\
    // | /--\
    // | |  |
    // \-|  |
    //   \--/

    const obj1 = this;
    const obj2 = obj;
    const { isClippingDown, isClippingLeft, isClippingRight, isClippingUp } = calculateClip(obj1, obj2);

    // force obj position to prevent clipping into object
    if (isClippingDown) {
      obj1.force.y = 0;
      obj1.y = obj2.y - obj1.height;
      obj1.isInConcactWithGround = true;
    }
    else if (isClippingLeft) {
      obj1.force.x = 0;
      obj1.x = obj2.x + obj2.width;
    }
    else if (isClippingRight) {
      obj1.force.x = 0;
      obj1.x = obj2.x - obj1.width;
    }
    else if (isClippingUp) {
      obj1.force.y = 0;
      obj1.y = obj2.y + obj2.height;
    }
  }

  moveLeft() {
    const xForce = this.getXForce();
    this.force.add(new Vector(-xForce, 0));
  }

  moveRight() {
    const xForce = this.getXForce();
    this.force.add(new Vector(xForce, 0));
  }

  jump() {
    if (this.isInConcactWithGround) {
      this.force.add(new Vector(0, -this.context.jumpForce));
    }
  }

  private getXForce() {
      // side force is lower if not in contact with ground
      const xForce = this.isInConcactWithGround ? this.context.groundForce : this.context.groundForce / 2;
      return xForce;
  }

  addForces() {
    this.force.add(new Vector(0, this.context.gravity));

    if (this.isInConcactWithGround) {
      this.force.add(new Vector(-this.force.x * this.context.groundForceReduction, 0));
      this.force.limitTo(this.context.groundForceLimit);
    }
    else
      this.force.limitTo(this.context.airForceLimit);
  }

  draw() {
    const offsetx = this.width / 2;
    const offsety = this.height / 2;
    const x = this.x + offsetx;
    const y = this.y + offsety;
    const { ctx } = this.context;
    const previoslyFacingLeft = this.facingLeft;
    this.facingLeft = this.force.x === 0 ? previoslyFacingLeft : this.force.x < 0;
    
    // body
    const legheight = 7;
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height - legheight);
    
    // eye
    ctx.fillStyle = 'white';
    let eyeOffset: number;
    if (this.facingLeft)
      eyeOffset = 0;
    else 
      eyeOffset = 2 * this.width / 5;
      
    ctx.fillRect(this.x + this.width / 5 + eyeOffset, this.y + this.height / 5, this.width / 5, this.height / 10);
    
    // legs
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    let legOffset: number;
    if (this.facingLeft)
      legOffset = 0;
    else
      legOffset = 15;
      
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / (4-i*2) + legOffset, this.y + this.height - legheight);
      ctx.lineTo(this.x + this.width / (4-i*2) + legOffset, this.y + this.height);
      ctx.stroke();
    }
  }
}
