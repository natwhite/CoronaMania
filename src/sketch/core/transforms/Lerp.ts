import {EventEmitter} from 'events';
import {Functions} from '../Functions';
import {ITransform} from '../ITransform';

export class Lerp implements ITransform<number> {
  public state: number;
  public start: number;
  public stop: number;
  public delta: number;

  public onComplete: EventEmitter = new EventEmitter();

  constructor(start: number, stop: number, delta: number) {
    this.start = start;
    this.stop = stop;
    this.delta = delta;
    this.state = 0;

    // console.log(`Creating Lerp with ${start}, ${stop}, ${delta}`);
  }

  public nextState(): number {
    const value = Functions.constrain(
      Functions.lerp(
        this.start,
        this.stop,
        this.state += this.delta
      ),
      this.start,
      this.stop
    );
    // console.log(`Lerping to value ${value}`);
    if (Math.abs(value) >= Math.abs(this.stop)) {
      this.onComplete.emit('completed');
    }
    return value;
  }
}
