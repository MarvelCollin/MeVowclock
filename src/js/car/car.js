import { CarIdleState } from './states/carIdleState.js';
import { CarMoveState } from './states/carMoveState.js';
import { CarSleepState } from './states/carSleepState.js';
import { CarSpriteHandler } from './helper/carSpriteHandler.js';
import { Direction } from './helper/direction.js';
import { SpriteLoader } from './helper/spriteLoader.js';

export class Car {
    constructor(initialPosition = { x: 64, y: window.innerHeight - 100 }) {
        this.spriteLoader = new SpriteLoader();
        this.state = null;
        this.spriteHandler = new CarSpriteHandler(this.spriteLoader);
        this.position = initialPosition; 
        this.targetPosition = { x: 0, y: initialPosition.y }; 
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
                    let newTargetX;
                    const minDistance = 100;
                    do {
                        newTargetX = Math.random() * (canvas.width - 64) + 32;
                    } while (Math.abs(newTargetX - this.position.x) < minDistance);
                    
                    this.targetPosition = {
                        x: newTargetX,
                        y: canvas.height - 100
                    };
                
                    if (this.targetPosition.x < this.position.x) {
                        this.setDirection(Direction.LEFT);
                    } else {
                        this.setDirection(Direction.RIGHT);
                    }
                    this.currentStateDuration = Math.random() * 3000 + 2000; // 2-5 seconds
                    // console.log(`Setting walk state towards x: ${this.targetPosition.x}`);
                    break;
                    
                case 'sleep':
                    this.currentStateDuration = Math.random() * 3000 + 4000; // 4-7 seconds
                    // console.log(`Setting sleep state for duration: ${this.currentStateDuration}ms`);
                    break;
                    
                case 'idle':
                    this.currentStateDuration = Math.random() * 2000 + 1000; // 1-3 seconds
                    // console.log(`Setting idle state for duration: ${this.currentStateDuration}ms`);
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
            // console.log(this.state);
            const currentTime = Date.now();
            const stateElapsed = currentTime - this.stateStartTime;

            if (this.state.constructor.name === 'CarMoveState') {
                const dx = this.targetPosition.x - this.position.x;
                const distance = Math.abs(dx);

                if (distance > 1) {
                    const speed = this.state.speed;
                    const direction = dx > 0 ? 1 : -1;
                    this.position.x += speed * direction;
                }
            }

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
        const canvas = document.getElementById('catCanvas');
        const margin = 20; 
        this.position.x = Math.max(0, Math.min(x, canvas.width - 64)); 
        this.position.y = window.innerHeight - 18;
    }
}