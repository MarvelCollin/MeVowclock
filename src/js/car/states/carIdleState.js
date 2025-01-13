export class CarIdleState {
    constructor(car) {
        this.car = car;
        this.loadedSprites = [];
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('/assets/assets.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const assets = await response.json();
            const idleConfig = assets.CAT.IDLE;
            
            const spritePaths = [];
            for(let i = 1; i <= idleConfig.FRAMES; i++) {
                spritePaths.push(`${idleConfig.PATH}${i}.png`);
            }
            
            await this.loadSprites(spritePaths);
            this.car.spriteHandler.setSprites(this.loadedSprites, idleConfig.DELAY);
        } catch (error) {
            console.error('Failed to initialize idle sprites:', error);
        }
    }

    async loadSprites(paths) {
        try {
            const loadedImages = await Promise.all(
                paths.map(path => this.loadImage(path))
            );
            this.car.updateSprite(loadedImages);
        } catch (error) {
            console.error('Error loading sprites:', error);
        }
    }

    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
        });
    }

    update() {
    }
}
