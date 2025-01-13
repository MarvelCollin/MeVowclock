import { Direction } from '../helper/direction.js';

export class CarMoveState {
    constructor(car, isRunning = false) {
        this.car = car;
        this.isRunning = isRunning;
        this.speed = isRunning ? 5 : 2;
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('/assets/assets.json');
            const assets = await response.json();
            const config = this.isRunning ? assets.CAT.RUN : assets.CAT.WALK;
            
            const spritePaths = [];
            for(let i = 1; i <= config.FRAMES; i++) {
                spritePaths.push(`${config.PATH}${i}.png`);
            }
            
            await this.loadSprites(spritePaths);
            this.car.spriteHandler.setSprites(this.loadedSprites, config.DELAY);
        } catch (error) {
            console.error('Failed to initialize move sprites:', error);
        }
    }

    async loadSprites(spritePaths) {
        this.loadedSprites = await Promise.all(spritePaths.map(path => this.loadImage(path)));
    }

    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }
}
