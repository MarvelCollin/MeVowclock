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
        const direction = this.car.getDirection();
        const canvas = document.getElementById('catCanvas');
        
        let moved = false;

        const maxX = canvas.width;
        switch(direction) {
            case Direction.LEFT:
                if (position.x > 32) {
                    position.x -= this.speed;
                    moved = true;
                }
                break;
            case Direction.RIGHT:
                if (position.x < maxX - 64) {
                    position.x += this.speed;
                    moved = true;
                }
                break;
        }

        if (moved) {
            this.car.setPosition(position.x, position.y);
        } else {
            this.car.setDirection(
                direction === Direction.LEFT ? Direction.RIGHT : Direction.LEFT
            );
        }

    }
}
