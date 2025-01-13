import { SpriteLoader } from '../helper/spriteLoader.js';

export class CarSleepState {
    constructor(car) {
        this.car = car;
        this.spriteLoader = new SpriteLoader();
        this.sleepDuration = 5000;
        this.sleepStartTime = Date.now();
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('/assets/assets.json');
            // console.log('Fetching assets.json for sleep state');
            
            if (!response.ok) throw new Error('Network response was not ok');
            const assets = await response.json();
            // console.log('Assets loaded:', assets);
            
            const sleepConfig = assets.CAT.SLEEP;
            
            const spritePaths = [];
            for(let i = 1; i <= sleepConfig.FRAMES; i++) {
                const path = `/assets/cat/sleep/sleep_${i}.png`;
                // console.log('Adding sprite path:', path);
                spritePaths.push(path);
            }
            
            const loadedImages = await this.spriteLoader.loadSprites(spritePaths);
            console.log('Loaded images:', loadedImages.length);
            this.car.spriteHandler.setSprites(loadedImages, sleepConfig.DELAY);
        } catch (error) {
            console.error('Failed to initialize sleep sprites:', error);
        }
    }

    update() {
        if (Date.now() - this.sleepStartTime > this.sleepDuration) {
            this.car.setState('idle');
        }
    }
}
