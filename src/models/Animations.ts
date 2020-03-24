import {Oscillator} from './Transforms';

export interface Animation {
  nextState();
}

export class ShrinkGrow implements Animation {
  oscillator;
  s;

  constructor(s, min: number, max: number, cyclesPerSecond: number) {
    this.s = s;
    this.oscillator = new Oscillator(min, max, cyclesPerSecond);
  }

  nextState() {
    this.s.scale(this.oscillator.nextState());
  }
}
