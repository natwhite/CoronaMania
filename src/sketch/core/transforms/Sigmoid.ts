import {EventEmitter} from 'events';
import {Functions} from '../Functions';
import {ITransform} from '../ITransform';

export class Sigmoid implements ITransform<number> {
  public state: number;
  public onComplete: EventEmitter = new EventEmitter();
  private readonly start: number;
  private readonly stop: number;
  private readonly delta: number;
  private readonly strength: number;
  private readonly spread: number;
  private readonly completeRange: number;
  private readonly completePercent = 0.01;

  constructor(start: number, stop: number, delta: number, strength: number = 1, initialPercent = 0) {
    this.start = start;
    this.stop = stop;
    this.spread = 5.0 / strength;
    this.completeRange = Math.abs(this.stop - this.start) * this.completePercent;
    this.delta = delta * (this.spread * 2);
    this.strength = strength;
    this.state = -this.spread + 2 * this.spread * initialPercent;
  }

  public nextState(): number {
    const value =
      Functions.sigmoid(
        this.state += this.delta,
        this.stop - this.start,
        (this.stop - this.start) / 2
      );
    // console.log(`Sigmoid at value ${value}`);
    if (Math.abs(value) + this.completeRange >= Math.abs(this.stop)) {
      this.onComplete.emit('completed');
    }
    return value;
  }
}
