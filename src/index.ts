import { Context, Keys, Movable, Objct } from "./common.js";
import { Creature } from "./creature.js";
import { Obstacle } from "./obstacle.js";
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
  const speed = 3;

  // jump force
  const jumpForce = speed * 10;

  // ground force, applied when in contact with ground
  const groundForce = speed * 0.15;

  // ground force limit
  const groundForceLimit = speed * 5;

  // reduction of ground force every draw
  const groundForceReduction = 0.2;

  // air movement when changing direction
  const airForce = speed * 0.75;

  // limit air movement
  const airForceLimit = speed * 5;

  const gravity = speed * 0.33;

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
    gravity,
    keys
  };

  const world = new World(context, canvas);
  
  const player = new Creature(context, 250, 250);
  const ground = new Obstacle(context, 0, canvas.offsetHeight - 50, canvas.width, 50, 1e8);
  world.add(player);
  world.add(ground);

  world.add(new Obstacle(context, 100, canvas.offsetHeight - 100, 50, 50, 1e8));
  world.add(new Obstacle(context, 150, canvas.offsetHeight - 200, 50 + 100, 50, 1e8));
  world.add(new Obstacle(context, 360, canvas.offsetHeight - 200, 50 + 100, 50, 1e8));
  world.add(new Obstacle(context, 650, canvas.offsetHeight - 250, 50 + 100, 50, 1e8));

  // world.add(new Obstacle(context, 650, canvas.offsetHeight - 100, 50, 50, 1));

  for (let n = 0; n < 2500; n++) {
    applyControls(player, context);
    await world.draw();
  }
}

function applyControls(player: Movable, context: Context) {
  if (context.keys.ArrowUp) player.jump();
  if (context.keys.ArrowRight) player.moveRight();
  else if (context.keys.ArrowLeft) player.moveLeft();
}