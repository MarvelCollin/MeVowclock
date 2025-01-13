import { Car } from "./car/car.js";
import { Renderer } from "./car/helper/renderer.js";
import { Direction } from "./car/helper/direction.js";

const renderer = new Renderer("catCanvas");
const cat = new Car();
let lastTime = 0;

const canvas = document.getElementById("catCanvas");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cat.setPosition(
    64, 
    window.innerHeight - 100 
  );
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function gameLoop(timestamp) {
  cat.update(timestamp);

  renderer.clear();
  const sprite = cat.spriteHandler.getCurrentSprite();
  if (sprite) {
    const pos = cat.getPosition();
    const isFlipped = cat.getDirection() === Direction.LEFT; 
    renderer.drawSprite(sprite, pos.x, pos.y, isFlipped);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

