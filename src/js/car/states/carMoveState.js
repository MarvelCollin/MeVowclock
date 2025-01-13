import { Direction } from '../helper/direction.js';
import { SpriteLoader } from '../helper/spriteLoader.js';

export class CarMoveState {
    constructor(car, isRunning = false, spriteLoader) {
        this.car = car;
        this.isRunning = isRunning;
        this.speed = isRunning ? 8 : 4;
        this.spriteLoader = spriteLoader; 
        this.initializeSprite();
    }

    async initializeSprite() {
        try {
            const response = await fetch('../../assets/assets.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const assets = await response.json();
            const config = this.isRunning ? assets.CAT.RUN : assets.CAT.WALK;
            console.log('Loading movement sprites:', config);
            
            const spritePaths = [];
            for(let i = 1; i <= config.FRAMES; i++) {
                spritePaths.push(`${config.PATH}${i}.png`);
            }
            
            const loadedSprites = await this.spriteLoader.loadSprites(spritePaths);
            this.car.spriteHandler.setSprites(loadedSprites, config.DELAY);
        } catch (error) {
            console.error('Failed to initialize move sprites:', error);
        }
    }

    update() {
        const position = this.car.getPosition();
        let direction = this.car.getDirection();
        const canvas = document.getElementById('catCanvas');
        
        const previousX = position.x; 

        position.x += this.speed * (direction === Direction.LEFT ? -1 : 1);

        position.x = Math.max(0, Math.min(position.x, canvas.width - 64)); 

        // Update the car's position
        this.car.setPosition(position.x, position.y);

        if (position.x === previousX) {
            this.car.setState('idle');
        }

        if (position.x <= 0) {
            this.car.setDirection(Direction.RIGHT);
        } else if (position.x >= canvas.width - 64) {
            this.car.setDirection(Direction.LEFT);
        }
    }
}
