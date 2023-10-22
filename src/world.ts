import { Objct, delay, Context } from "./common.js";

export class World {
  objs: Objct[];
  collisionMap: (Objct | undefined)[][];
  collisionSizeX: number;
  collisionSizeY: number;
  collidedObjects: [Objct, Objct][];

  constructor(
    private context: Context,
    private canvas: HTMLCanvasElement
  ) {
    this.objs = [];
    this.collisionMap = [];
    this.collisionSizeX = this.canvas.offsetWidth / 2;
    this.collisionSizeY = this.canvas.offsetHeight / 2;
    this.collidedObjects = [];
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
    for (const obj of this.objs) {
      this.updatePosition(obj);
      obj.x = Math.round(obj.x * 100) / 100;
      obj.y = Math.round(obj.y * 100) / 100;
    }

    for (const obj of this.objs) {
      this.addObjectToCollisionMap(obj);
    }

    for (const obj of this.objs) {
      obj.draw();
    }
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
    for (let n = 0; n < this.collisionSizeX; n++) this.collisionMap[n] = [];
    this.collidedObjects = [];
  }

  /**
   * Adds object to collision map and handles collisions
   * @param obj 
   */
  addObjectToCollisionMap(obj: Objct) {
    const worldWidth = this.canvas.offsetWidth;
    const worldHeight = this.canvas.offsetHeight;

    // how many pixels on map is a "pixel" in collision map
    const stepX = Math.round(worldWidth / this.collisionSizeX);
    const stepY = Math.round(worldHeight / this.collisionSizeY);
    
    obj.isInConcactWithGround = false;

    for (let x = obj.x; x < obj.x + obj.width; x += stepX) {
      for (let y = obj.y; y < obj.y + obj.height; y += stepY) {
        // object position in steps
        const xx = Math.round(this.collisionSizeX * (x / worldWidth));
        const yy = Math.round(this.collisionSizeY * (y / worldHeight));

        if (xx >= 0 && xx < this.collisionMap.length && yy >= 0) {
          const isCollisionWithOtherObject = this.collisionMap[xx][yy] && this.collisionMap[xx][yy] !== obj;
          if (isCollisionWithOtherObject) {
            const obj1 = this.collisionMap[xx][yy] as Objct;
            const alreadyCollidedObjects = this.collidedObjects.find(pair => pair[0] === obj && pair[1] === obj1);

            if (!alreadyCollidedObjects) {
              obj.collision(obj1);
              obj1.collision(obj);
              this.collidedObjects.push([obj, obj1]);
            }
          } else {
            this.collisionMap[xx][yy] = obj;
          }
        }
      }
    }
  }

  round(val: number): number {
    return Math.round(val * 100) / 100;
  }
}
