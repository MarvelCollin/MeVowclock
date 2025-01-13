import { SpriteLoader } from './spriteLoader.js';

export class Renderer {
  constructor(canvasId, defaultScale = 2) {
    this.debug = false;

    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
        console.error(`Canvas with id "${canvasId}" not found.`);
        return;
    }
    this.ctx = this.canvas.getContext("2d");
    this.sprites = new Map();

    this.ctx.imageSmoothingEnabled = true; // Enable smoothing for better quality
    this.ctx.webkitImageSmoothingEnabled = true;
    this.ctx.mozImageSmoothingEnabled = true;

    this.scale = defaultScale;
    this.spriteLoader = new SpriteLoader();
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  async loadSprite(spritePath) {
    return this.spriteLoader.loadSprite(spritePath);
  }

  drawSprite(sprite, x, y, flipX = false, scale = this.scale) {
    if (!sprite || !this.ctx) return;

    this.ctx.save();

    this.ctx.scale(scale, scale);

    // Adjust position for high-DPI displays
    this.ctx.translate(x / scale, y / scale);

    if (flipX) {
        this.ctx.scale(1, 1);
    } else {
        this.ctx.scale(-1, 1);
        x = -x;
    }

    this.ctx.drawImage(sprite, 0, -sprite.height);

    if(this.debug) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.rect(0, -sprite.height, sprite.width, sprite.height);
        this.ctx.stroke();
    }

    this.ctx.restore();
  }

  getBoundedPosition(x, y, spriteWidth, spriteHeight) {
    const scaledWidth = spriteWidth * this.scale;
    const scaledHeight = spriteHeight * this.scale;

    return {
      x: Math.max(0, Math.min(x, this.canvas.width / this.scale - scaledWidth)),
      y: Math.max(0, Math.min(y, this.canvas.height / this.scale - scaledHeight)),
    };
  }

  resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = true; // Enable smoothing after resizing
  }
}
