import Assets from '../assets.js';

export class CarSleepState {
    constructor(car) {
        this.car = car;
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('/assets/assets.json');
            const assets = await response.json();
            const sleepConfig = assets.CAT.SLEEP;
            
            const spritePaths = [];
            for(let i = 1; i <= sleepConfig.FRAMES; i++) {
                spritePaths.push(`${sleepConfig.PATH}${i}.png`);
            }
            
            await this.loadSprites(spritePaths);
            this.car.spriteHandler.setSprites(this.loadedSprites, sleepConfig.DELAY);
        } catch (error) {
            console.error('Failed to initialize sleep sprites:', error);
        }
    }

    // ...existing code...
}
