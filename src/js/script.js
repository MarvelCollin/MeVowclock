import { Car } from "./car/car.js";
import { Renderer } from "./car/helper/renderer.js";
import { Direction } from "./car/helper/direction.js";

const NUMBER_OF_CATS = 1;

const cats = [];

function getRandomPosition() {
    const canvas = document.getElementById("catCanvas");
    const x = Math.random() * (canvas.width - 64) + 32;
    const y = window.innerHeight - 100;
    return { x, y };
}

const renderer = new Renderer("catCanvas", 2);

for (let i = 0; i < NUMBER_OF_CATS; i++) {
    const cat = new Car(getRandomPosition());
    cats.push(cat);
}

let lastTime = 0;

const canvas = document.getElementById("catCanvas");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cats.forEach(cat => {
      cat.setPosition(
        Math.random() * (canvas.width - 64) + 32, 
        window.innerHeight - 100 
      ); 
  });
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function gameLoop(timestamp) {
  cats.forEach(cat => {
      cat.update(timestamp);
  });

  renderer.clear();
  
  cats.forEach(cat => {
      const sprite = cat.spriteHandler.getCurrentSprite();
      if (sprite) {
          const pos = cat.getPosition();
          const isFlipped = cat.getDirection() === Direction.LEFT; 
          renderer.drawSprite(sprite, pos.x, pos.y, isFlipped, 3);  
      }
  });

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

