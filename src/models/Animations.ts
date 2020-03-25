import {Oscillator} from './Transforms';

export interface IAnimation {
  nextState();
}

export class ShrinkGrow implements IAnimation {
  public oscillator;
  public s;

  constructor(s, min: number, max: number, cyclesPerSecond: number) {
    this.s = s;
    this.oscillator = new Oscillator(min, max, cyclesPerSecond);
  }

  public nextState() {
    this.s.scale(this.oscillator.nextState());
  }
}
