import { Direction } from './direction.js';

export class CarSpriteHandler {
    constructor() {
        this.currentFrame = 0;
        this.frameCount = 0;
        this.direction = Direction.RIGHT;
        this.sprites = null;
        this.frameDelay = 100; // Default delay
        this.lastFrameTime = 0;
    }

    setSprites(sprites, delay = 100) {
        this.sprites = sprites;
        this.frameCount = sprites ? sprites.length : 0;
        this.currentFrame = 0;
        this.frameDelay = delay;
    }

    updateFrame(timestamp) {
        if (!this.sprites || this.frameCount === 0) return null;
        
        if (timestamp - this.lastFrameTime > this.frameDelay) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.lastFrameTime = timestamp;
        }
        return this.getCurrentSprite();
    }

    getCurrentSprite() {
        return this.sprites ? this.sprites[this.currentFrame] : null;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }
}
