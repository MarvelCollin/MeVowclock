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
            const response = await fetch('../../assets/assets.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const assets = await response.json();
            const config = this.isRunning ? assets.CAT.RUN : assets.CAT.WALK;
            console.log('Loading movement sprites:', config);
            
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

    update() {
        const position = this.car.getPosition();
        const direction = this.car.getDirection();
        const canvas = document.getElementById('catCanvas');
        
        let moved = false;

        const maxX = canvas.width / 3;

        switch(direction) {
            case Direction.LEFT:
                if (position.x > 64) { 
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

        if (Math.random() < 0.005) { 
            this.car.setState(this.isRunning ? 'walk' : 'run');
        }    }
}
