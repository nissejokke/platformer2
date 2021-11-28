import { Objct, delay, Context, Point } from "./common.js";
import Vector from "./vector.js";

export class World {
  objs: Objct[];
  collisionMap: (Objct | undefined)[][];
  collissionSizeX: number;
  collissionSizeY: number;

  constructor(
    private context: Context,
    private canvas: HTMLCanvasElement
  ) {
    this.objs = [];
    this.collisionMap = [];
    this.collissionSizeX = this.canvas.offsetWidth / 2;
    this.collissionSizeY = this.canvas.offsetHeight / 2;
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
    for (let n = 0; n < this.collissionSizeX; n++) this.collisionMap[n] = [];
  }

  addObjectToCollisionMap(obj: Objct) {
    const worldWidth = this.canvas.offsetWidth;
    const worldHeight = this.canvas.offsetHeight;

    // how many pixels on map is a "pixel" in collision map
    const stepX = Math.round(worldWidth / this.collissionSizeX);
    const stepY = Math.round(worldHeight / this.collissionSizeY);
    
    obj.isObjectCollisionBelow = false;
    const collidedObjects: [Objct, Objct][] = [];

    for (let x = obj.x; x < obj.x + obj.width; x += stepX) {
      for (let y = obj.y; y < obj.y + obj.height; y += stepY) {
        // object position in steps
        const xx = Math.round(this.collissionSizeX * (x / worldWidth));
        const yy = Math.round(this.collissionSizeY * (y / worldHeight));

        if (xx >= 0 && xx < this.collisionMap.length && yy >= 0) {
          const isCollisionWithOtherObject = this.collisionMap[xx][yy] && this.collisionMap[xx][yy] !== obj;
          if (isCollisionWithOtherObject) {
            const obj1 = this.collisionMap[xx][yy] as Objct;
            const alreadyCollidedObjects = collidedObjects.find(pair => (pair[0] === obj1 && pair[1] === obj) || (pair[0] === obj && pair[1] === obj1));
            
            if (!alreadyCollidedObjects) {
              // always let the second object be the heavier for simplicy in collide
              const objLightetsToHeaviest = obj1.mass > obj.mass ? [obj, obj1] : [obj1, obj];
              this.collide(objLightetsToHeaviest[0], objLightetsToHeaviest[1]);
              collidedObjects.push([objLightetsToHeaviest[0], objLightetsToHeaviest[1]]);
            }
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

  /**
   * 
   * @param obj1 
   * @param obj2 the more massive object
   * @returns 
   */
  collide(obj1: Objct, obj2: Objct): void {
    // /--\
    // | /--\
    // | |  |
    // \-|  |
    //   \--/

    const isClippingLeft = obj2.x < obj1.x && obj2.x + obj2.width >= obj1.x && obj1.x + obj1.width > obj2.x + obj2.width; 
    const isClippingRight = obj1.x < obj2.x && obj1.x + obj1.width >= obj2.x && obj1.x + obj1.width < obj2.x + obj2.width;
    const isClippingDown = obj1.y < obj2.y && obj1.y + obj1.height >= obj2.y && obj2.y + obj2.height > obj1.y + obj1.height;
    const isClippingUp = obj2.y < obj1.y && obj2.y + obj2.height >= obj1.y && obj2.y + obj2.height < obj1.y + obj1.height;

    console.log(obj1, obj2)

    if (isClippingDown && obj1.force.y > 0) {
      obj1.force.y = 0;
      // force obj1 position to prevent clipping into object
      obj1.y = obj2.y - obj1.height;
      obj1.isObjectCollisionBelow = true;
    }
    else if (isClippingLeft && obj1.force.x < 0) {
      obj1.force.x = 0;
      obj1.x = obj2.x + obj2.width;
    }
    else if (isClippingUp) {
      obj1.force.y = 0;
      obj1.y = obj2.y + obj2.height;
    }
    else if (isClippingRight) {
      obj1.force.x = 0;
      obj1.x = obj2.x - obj1.width;
    }
  }
}
