import { CarIdleState } from './states/carIdleState.js';
import { CarMoveState } from './states/carMoveState.js';
import { CarSleepState } from './states/carSleepState.js';
import { CarSpriteHandler } from './helper/carSpriteHandler.js';
import { Direction } from './helper/direction.js';
import { SpriteLoader } from './helper/spriteLoader.js';

export class Car {
    constructor() {
        this.spriteLoader = new SpriteLoader();
        this.state = null;
        this.spriteHandler = new CarSpriteHandler(this.spriteLoader);
        this.position = { x: 64, y: window.innerHeight - 100 }; // Start from bottom left
        this.targetPosition = { x: 0, y: 0 };
        this.moveTimeout = null;
        this.setDirection(Direction.LEFT); 
        this.setState('idle');
        this.currentStateDuration = 0;
        this.stateStartTime = Date.now();
        this.setupRandomMovement();
    }

    setupRandomMovement() {
        const pickNewState = () => {
            const canvas = document.getElementById('catCanvas');
            const states = ['walk', 'sleep', 'idle'];
            const randomState = states[Math.floor(Math.random() * states.length)];
            
            switch(randomState) {
                case 'walk':
                    // Keep cat within left third of screen
                    this.targetPosition = {
                        x: Math.random() * (canvas.width / 3),
                        y: canvas.height - 100
                    };
                    
                    if (this.targetPosition.x < this.position.x) {
                        this.setDirection(Direction.LEFT);
                    } else {
                        this.setDirection(Direction.RIGHT);
                    }
                    this.currentStateDuration = Math.random() * 3000 + 2000; // 2-5 seconds
                    break;
                    
                case 'sleep':
                    this.currentStateDuration = Math.random() * 3000 + 4000; // 4-7 seconds
                    break;
                    
                case 'idle':
                    this.currentStateDuration = Math.random() * 2000 + 1000; // 1-3 seconds
                    break;
            }
            
            this.setState(randomState);
            this.stateStartTime = Date.now();
            
            this.moveTimeout = setTimeout(pickNewState, this.currentStateDuration);
        };

        pickNewState();
    }

    update(timestamp) {
        if (this.state) {
            console.log(this.state);
            const currentTime = Date.now();
            const stateElapsed = currentTime - this.stateStartTime;

            if (this.state.constructor.name === 'CarMoveState') {
                const dx = this.targetPosition.x - this.position.x;
                const distance = Math.abs(dx);

                if (distance > 1) {
                    const speed = 2;
                    const direction = dx > 0 ? 1 : -1;
                    this.position.x += speed * direction;
                }
            }

            // Let the current state update itself
            this.state.update();
            this.spriteHandler.updateFrame(timestamp);
        }
    }

    updateSprite(sprites) {
        this.spriteHandler.setSprites(sprites);
    }

    setDirection(direction) {
        this.spriteHandler.setDirection(direction);
    }

    getDirection() {
        return this.spriteHandler.getDirection();
    }

    setState(stateName) {
        switch(stateName) {
            case 'idle':
                this.state = new CarIdleState(this, this.spriteLoader);
                break;
            case 'sleep':
                this.state = new CarSleepState(this, this.spriteLoader);
                break;
            case 'walk':
                this.state = new CarMoveState(this, false, this.spriteLoader);
                break;
            case 'run':
                this.state = new CarMoveState(this, true, this.spriteLoader);
                break;
        }
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y) {
        // Ensure cat stays within canvas boundaries and above bottom
        const canvas = document.getElementById('catCanvas');
        const margin = 20; // margin from bottom
        this.position.x = Math.max(0, Math.min(x, canvas.width - 64)); // assuming sprite width is 64
        this.position.y = Math.max(64 + margin, Math.min(y, canvas.height)); // y is now the bottom position
    }
}