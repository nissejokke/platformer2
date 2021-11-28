import { Objct, delay, Context, Point } from "./common.js";
import Vector from "./vector.js";

export class World {
  objs: Objct[];
  collisionMap: (Objct | undefined)[][];
  collisionSize: number;
  constructor(
    private context: Context,
    private canvas: HTMLCanvasElement
  ) {
    this.objs = [];
    this.collisionMap = [];
    this.collisionSize = 2;
  }

  add(obj: Objct) {
    this.objs.push(obj);
  }

  async draw() {
    this.context.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.resetCollisionMap();
    for (const obj of this.objs) {
      obj.addForces();
    }
    // update positions is before add object collisions because otherwise causes flicker
    for (const obj of this.objs) this.updatePosition(obj);

    for (const obj of this.objs) {
      this.addObjectToCollisionMap(obj);
    }

    for (const obj of this.objs) {
      obj.draw();
    }

    await delay(25);
  }

  updatePosition(obj: Objct) {
    obj.x += obj.force.x;
    obj.y += obj.force.y;

    // wrap y
    if (obj.y < 0) obj.y += this.canvas.offsetHeight;
    if (obj.y > this.canvas.offsetHeight) obj.y -= this.canvas.offsetHeight;

    // wrap x
    if (obj.x < 0) obj.x += this.canvas.offsetWidth;
    if (obj.x > this.canvas.offsetWidth) obj.x -= this.canvas.offsetWidth;
  }

  resetCollisionMap() {
    for (let n = 0; n < this.collisionSize; n++) this.collisionMap[n] = [];
  }

  addObjectToCollisionMap(obj: Objct) {
    const worldWidth = this.canvas.offsetWidth;
    const worldHeight = this.canvas.offsetHeight;

    // how many pixels on map is a "pixel" in collision map
    const stepX = Math.round(worldWidth / this.collisionSize);
    const stepY = Math.round(worldHeight / this.collisionSize);
    
    obj.isObjectCollisionBelow = false;

    for (let x = obj.x; x < obj.x + obj.width; x += stepX) {
      for (let y = obj.y; y < obj.y + obj.height; y += stepY) {
        // object position in steps
        const xx = Math.round(this.collisionSize * (x / worldWidth));
        const yy = Math.round(this.collisionSize * (y / worldHeight));

        if (xx >= 0 && xx < this.collisionMap.length && yy >= 0) {
          const isCollisionWithOtherObject = this.collisionMap[xx][yy] && this.collisionMap[xx][yy] !== obj;
          if (isCollisionWithOtherObject) {
            const obj1 = this.collisionMap[xx][yy] as Objct;
            // always let the second object be the heavier for simplicy in collide
            if (obj1.mass < obj.mass)
              this.collide(obj1, obj);
          } else {
            this.collisionMap[xx][yy] = obj;
          }
        }
      }
    }
    // this.ctx.font = "30px serif";
    // this.ctx.fillText(
    //   `${xval.join(",")}x${yval.join(",")}`,
    //   obj.x,
    //   obj.y - 20,
    //   200
    // );
    // console.log(xval, yval);
  }

  isOverlapDown(obj1: Objct, obj2: Objct): boolean {
    const obj1yWithinObj2Y = obj1.y < obj2.y && obj1.y + obj1.height > obj2.y;
    const notOvr = (obj1.x < obj2.x && obj1.x + obj1.width < obj2.x) || (obj2.x < obj1.x && obj2.x + obj2.width < obj1.x);
    return obj1yWithinObj2Y && !notOvr;

    // |-----|
    //     |---|

    //    |-----|
    // |---|

    // |--------|
    //    |--|

  }

  /**
   * 
   * @param obj1 
   * @param obj2 the more massive object
   * @returns 
   */
  collide(obj1: Objct, obj2: Objct): boolean {
    // /--\
    // | /--\
    // | |  |
    // \-|  |
    //   \--/

    // vf = (m1 * v1) / (m1 + m2)
    // p = m * v

    // m1 * v1 = m2 * v2
    // KEf=1/2m1*v1^2+1/2*m2*v2^2

    const isDownCollision = this.isOverlapDown(obj1, obj2);

    if (isDownCollision && obj1.force.y > 0) {
      obj1.force.y = 0;
      // force obj1 position to prevent clipping into object
      obj1.y = obj2.y - obj1.height;
      obj1.isObjectCollisionBelow = true;
    }

    return true;
  }
}
