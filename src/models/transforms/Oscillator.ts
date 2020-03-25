import {EventEmitter} from 'events';
import {ITransform} from '../Transforms';

export class Oscillator implements ITransform<number> {

  public state = 0;
  public onComplete: EventEmitter;
  private readonly min;
  private readonly max;
  private readonly baseSpeed;
  private readonly cyclesPerSecond: number;

  constructor(min: number, max: number, cyclesPerSecond: number) {
    this.min = min;
    this.max = max;
    this.cyclesPerSecond = cyclesPerSecond;
    this.baseSpeed = 6.28318530717958647693 / 30;
  }

  public nextState() {
    this.state += this.baseSpeed;
    return this.stateAtPoint(0);
  }

  public stateAtPoint(x: number) {
    return (this.max - this.min) / 2 * (Math.sin((this.state + x) * this.cyclesPerSecond) + 1) + this.min;
  }
}
