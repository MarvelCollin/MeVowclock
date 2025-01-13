import { CarIdleState } from './states/carIdleState.js';
import { CarMoveState } from './states/carMoveState.js';
import { CarSleepState } from './states/carSleepState.js';
import { CarSpriteHandler } from './helper/carSpriteHandler.js';
import { Direction } from './helper/direction.js';

export class Car {
    constructor() {
        this.state = null;
        this.spriteHandler = new CarSpriteHandler();
        this.setState('idle');
        this.position = { x: 0, y: 0 };
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
                this.state = new CarIdleState(this);
                break;
            case 'sleep':
                this.state = new CarSleepState(this);
                break;
            case 'walk':
                this.state = new CarMoveState(this, false);
                break;
            case 'run':
                this.state = new CarMoveState(this, true);
                break;
        }
    }

    update(timestamp) {
        if (this.state) {
            this.state.update();
            this.spriteHandler.updateFrame(timestamp);
        }
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
}