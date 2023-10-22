import { calculateClip, Context, Objct } from "./common.js";
import Vector from "./vector.js";

export class Obstacle implements Objct {
  force: Vector;
  isInConcactWithGround: boolean;
  constructor(
    private context: Context,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public mass: number
  ) {
    this.force = new Vector(0, 0);
    this.isInConcactWithGround = false;
  }
  collision(obj: Objct): void {
    
  }
  
  addForces(): void {
    // no forces added to obstacle
    // this.force.add(new Vector(0, this.context.gravity));
  }
  draw(): void {
    const { ctx } = this.context;
    const grassheight = 7;

    // grass
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, grassheight);
    
    // dirt
    ctx.fillStyle = '#4c362e';
    ctx.fillRect(this.x, this.y + grassheight, this.width, this.height - grassheight);

    // grass roots
    ctx.strokeStyle = 'darkgreen';
    ctx.lineWidth = 2;
    for (let i = 0; i < this.width; i+=10) {
      ctx.beginPath();
      ctx.moveTo(this.x + i, this.y + grassheight);
      ctx.lineTo(this.x + i, this.y + grassheight + 3);
      ctx.stroke();
    }

    // dirt dots to make more live dirt
    // ctx.strokeStyle = '#795548';
    // ctx.lineWidth = 2;
    // for (let i = 0; i < this.width; i+=10) {
    //   for (let j = 0; j < this.height - grassheight - 10; j+=15) {
    //     ctx.beginPath();
    //     ctx.moveTo(this.x + i, this.y + grassheight + 10 + j);
    //     ctx.lineTo(this.x + i + 3, this.y + grassheight + 10 + j);
    //     ctx.stroke();
    //   }
    // }
  }
}
