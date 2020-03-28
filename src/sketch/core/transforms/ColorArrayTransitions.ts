import {EventEmitter} from 'events';
import {Functions} from '../Functions';
import {ITransform} from '../ITransform';

export class ColorArrayTransitions implements ITransform<number[]> {

  public state = [0, 0, 0];
  public onComplete: EventEmitter;
  private readonly colors;
  private currentColorIndex;
  private statePercent: number = 0;
  private currentColor;
  private nextColor;
  private delta: number;

  constructor(colors: Array<[number, number, number]>, framesPerCycle = 60) {
    this.colors = colors;
    this.currentColorIndex = 0;
    this.currentColor = colors[0];
    this.nextColor = colors[1];
    this.statePercent = 0;
    this.delta = 100 / framesPerCycle;
  }

  // TODO : Fix jumping to 100% of next color before beginning next transition.
  public nextState = () => {
    this.statePercent += this.delta;

    if (this.statePercent >= 100) {
      this.statePercent = 0;
      this.currentColorIndex++;
      this.currentColorIndex %= this.colors.length;
      this.currentColor = this.colors[this.currentColorIndex];
      this.nextColor = this.colors[(this.currentColorIndex + 1) % this.colors.length];
    }

    return [...Array(3).keys()].map(
      (i) => Functions.lerp(this.currentColor[i], this.nextColor[i], this.statePercent / 100)
    );
  };
}
