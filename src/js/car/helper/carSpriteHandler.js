import { Direction } from './direction.js';

export class CarSpriteHandler {
    constructor(spriteLoader) {
        this.spriteLoader = spriteLoader;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.direction = Direction.RIGHT;
        this.sprites = null;
        this.frameDelay = 100; 
        this.lastFrameTime = 0;
    }

    setSprites(sprites, delay = 100) {
        if (!sprites || sprites.length === 0) {
            // console.error('Attempting to set empty sprites array');
            return;
        }
        // console.log('Setting sprites:', {
        //     count: sprites.length,
        //     delay: delay,
        //     firstSprite: sprites[0]
        // });
        this.sprites = sprites;
        this.frameCount = sprites.length;
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
        const sprite = this.sprites ? this.sprites[this.currentFrame] : null;
        if (!sprite) {
            // console.log('No sprite available:', {
            //     sprites: this.sprites?.length,
            //     currentFrame: this.currentFrame
            // });
        }
        return sprite;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }
}
