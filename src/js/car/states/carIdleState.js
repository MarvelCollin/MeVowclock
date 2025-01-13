import { SpriteLoader } from '../helper/spriteLoader.js';

export class CarIdleState {
    constructor(car, spriteLoader) {
        this.car = car;
        this.spriteLoader = spriteLoader; // Use the passed SpriteLoader
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('../../assets/assets.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const assets = await response.json();
            const idleConfig = assets.CAT.IDLE_FRONT; 
            console.log('Loading IDLE_FRONT sprites:', idleConfig);
            
            const spritePaths = [];
            for(let i = 1; i <= idleConfig.FRAMES; i++) {
                spritePaths.push(`${idleConfig.PATH}${i}.png`);
            }
            
            const loadedSprites = await this.spriteLoader.loadSprites(spritePaths);
            this.car.spriteHandler.setSprites(loadedSprites, idleConfig.DELAY);
        } catch (error) {
            console.error('Failed to initialize idle sprites:', error);
        }
    }

    update() {
        // Optionally, remove or adjust conditions that switch states
        // if (Math.random() < 0.001) { 
        //     this.car.setState('sleep');
        // }
    }
}
