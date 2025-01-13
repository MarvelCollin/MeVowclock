import { Car } from "./car/car.js";
import { Renderer } from "./car/helper/renderer.js";
import { Direction } from "./car/helper/direction.js";

// Add a constant for the number of cats
const NUMBER_OF_CATS = 5;

// Initialize an array to hold multiple cat instances
const cats = [];

// Function to generate random spawn position with random x and fixed y
function getRandomPosition() {
    const canvas = document.getElementById("catCanvas");
    const x = Math.random() * (canvas.width - 64) + 32; // Ensure within canvas width
    const y = window.innerHeight - 100; // Fixed y position
    return { x, y };
}

// Instantiate a single Renderer
const renderer = new Renderer("catCanvas", 2); // Single Renderer for one canvas

// Instantiate multiple cats with random positions
for (let i = 0; i < NUMBER_OF_CATS; i++) {
    const cat = new Car(getRandomPosition());
    cats.push(cat);
}

let lastTime = 0;

const canvas = document.getElementById("catCanvas");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Reposition all cats with new random x positions
  cats.forEach(cat => {
      cat.setPosition(
        Math.random() * (canvas.width - 64) + 32, 
        window.innerHeight - 100 // Fixed y position on resize
      ); 
  });
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Update the game loop to handle multiple cats
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

