export class CarSleepState {
    constructor(car) {
        this.car = car;
        this.loadedSprites = [];
        this.sleepDuration = 5000;
        this.sleepStartTime = Date.now();
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('/assets/assets.json');
            console.log('Fetching assets.json for sleep state');
            
            if (!response.ok) throw new Error('Network response was not ok');
            const assets = await response.json();
            console.log('Assets loaded:', assets);
            
            const goingToSleepConfig = assets.CAT.GOING_TO_SLEEP;
            const sleepConfig = assets.CAT.SLEEP;
            
            const spritePaths = [];
            // Generate absolute paths
            for(let i = 1; i <= goingToSleepConfig.FRAMES; i++) {
                const path = `/assets/cat/going_to_sleep/sleep_${i}.png`;
                console.log('Adding sprite path:', path);
                spritePaths.push(path);
            }
            for(let i = 1; i <= sleepConfig.FRAMES; i++) {
                const path = `/assets/cat/sleep/sleep_${i}.png`;
                console.log('Adding sprite path:', path);
                spritePaths.push(path);
            }
            
            const loadedImages = await this.loadSprites(spritePaths);
            console.log('Loaded images:', loadedImages.length);
            this.car.spriteHandler.setSprites(loadedImages, sleepConfig.DELAY);
        } catch (error) {
            console.error('Failed to initialize sleep sprites:', error);
        }
    }

    async loadSprites(paths) {
        try {
            return await Promise.all(
                paths.map(path => this.loadImage(path))
            );
        } catch (error) {
            console.error('Error loading sprites:', error);
            return [];
        }
    }

    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                console.log('Successfully loaded sprite:', path);
                resolve(img);
            };
            img.onerror = () => {
                console.error('Failed to load sprite:', path);
                reject(new Error(`Failed to load image: ${path}`));
            };
            img.src = path;
        });
    }

    update() {
        if (Date.now() - this.sleepStartTime > this.sleepDuration) {
            this.car.setState('idle');
        }
    }
}
