import { Context, Keys } from "./common.js";
import { Man } from "./man.js";
import { Obstacle } from "./obstacle.js";
import Vector from "./vector.js";
import { World } from "./world.js";

export async function draw() {
  var canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas?.getContext) return;

  const keys: Keys = {};
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "ArrowUp") {
      if (keys[e.code] === undefined) keys[e.code] = true;
      else keys[e.code] = false;
    } else {
      // empty;
      keys[e.code] = true;
    }
    console.log(e.code);
  });

  document.addEventListener("keyup", (e: KeyboardEvent) => {
    delete keys[e.code];
  });

  // speed multiplier
  const speed = 10;

  // jump force
  const jumpForce = speed * 2.5;

  // ground force, applied when in concat with ground
  const groundForce = speed * 0.1;

  // ground force limit
  const groundForceLimit = speed * 10;

  // reduction of ground force every draw
  const groundForceReduction = 0.2;

  // air movement when changing direction
  const airForce = speed * 0.75;

  // limit air movement
  const airForceLimit = speed * 10;

  var ctx = canvas.getContext("2d")!;

  const context:Context = {
    speed,
    jumpForce,
    airForce,
    airForceLimit,
    ctx,
    groundForce,
    groundForceLimit,
    groundForceReduction,
    keys
  };

  const world = new World(context, canvas);
  const man = new Man(context, 250, 250);
  const ground = new Obstacle(
    context,
    0,
    canvas.offsetHeight - 30,
    canvas.width,
    30,
    100000
  );
  world.add(man);
  world.add(ground);
  world.add(new Obstacle(context, 100, canvas.offsetHeight - 80, 50, 50, 100000));

  for (let n = 0; n < 2500; n++) {
    await world.draw();
  }
}
