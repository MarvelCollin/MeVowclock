export class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.sprites = new Map();

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;

    this.scale = 2;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async loadSprite(spritePath) {
    if (this.sprites.has(spritePath)) {
      return this.sprites.get(spritePath);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('Sprite loaded successfully:', spritePath);
        this.sprites.set(spritePath, img);
        resolve(img);
      };
      img.onerror = (e) => {
        console.error('Failed to load sprite:', spritePath, e);
        reject(new Error(`Failed to load sprite: ${spritePath}`));
      };
      console.log('Attempting to load sprite:', spritePath);
      img.src = spritePath;
    });
  }

  drawSprite(sprite, x, y, flipX = false) {
    if (!sprite) return;

    this.ctx.save();

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.ellipse(
        x + sprite.width / 2, 
        y + sprite.height, 
        sprite.width / 3, 
        10, 
        0, 
        0, 
        Math.PI * 2
    );
    this.ctx.fill();

    const scaleFactor = 2;
    this.ctx.scale(scaleFactor, scaleFactor);

    if (!flipX) {
      this.ctx.scale(-1, 1);
      x = -x - sprite.width;
    }

    this.ctx.drawImage(sprite, x / scaleFactor, y / scaleFactor);
    
    this.ctx.restore();
  }

  getBoundedPosition(x, y, spriteWidth, spriteHeight) {
    const scaledWidth = spriteWidth * this.scale;
    const scaledHeight = spriteHeight * this.scale;

    return {
      x: Math.max(0, Math.min(x, this.canvas.width - scaledWidth)),
      y: Math.max(0, Math.min(y, this.canvas.height - scaledHeight)),
    };
  }

  resizeCanvas(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = false;
  }
}
