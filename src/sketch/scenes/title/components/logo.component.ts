import {EventEmitter} from 'events';
import {SketchComponent} from '../../../core/SketchComponent';
import {Oscillator} from '../../../core/transforms/Oscillator';
import {RNGColorOscillator} from '../../../core/transforms/RNGColorOscillator';

// TODO : Refactor and split into title and startbutton sketch components.
export class LogoComponent extends SketchComponent {

  public message = 'Corona Mania!';
  public font;
  public logoRadius = 500;
  public logoOscillator;
  public logoColorOscillator;
  public logoOscillationRange = 0.01;
  public logoOscillationWaveLength = 1;
  public logoCyclesPerSecond = 0.5;

  public onInteraction: EventEmitter = new EventEmitter();

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/ttg_by_westralinc-dbnnkt8.ttf');
    this.renderer.textFont(this.font, 100);
    // The text must be centered!
    this.renderer.textAlign(this.renderer.CENTER);
    // this.renderer.smooth();
    this.logoOscillator = new Oscillator(
      1 - this.logoOscillationRange,
      1 + this.logoOscillationRange,
      this.logoCyclesPerSecond
    );
    this.logoColorOscillator = new RNGColorOscillator();
  }

  public createLogo = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.3 + this.logoRadius);
    let arclength = this.logoRadius * this.renderer.PI / 2 - this.renderer.textWidth(this.message) / 2;
    this.logoOscillator.nextState();
    this.logoColorOscillator.nextState();

    this.renderer.fill(0);
    for (let i = 0; i < this.message.length; i++) {
      const currentChar = this.message.charAt(i);
      const w = this.renderer.textWidth(currentChar);
      const localRadius = this.logoRadius * this.logoOscillator.stateAtPoint(i * this.logoOscillationWaveLength);
      arclength += w / 2;
      const theta = this.renderer.PI + arclength / this.logoRadius;

      this.renderer.push();
      this.renderer.translate(this.logoRadius * this.renderer.cos(theta), localRadius * this.renderer.sin(theta));
      this.renderer.rotate(theta + this.renderer.PI / 2);
      this.renderer.stroke(0);
      this.renderer.strokeWeight(3);
      this.renderer.fill(this.logoColorOscillator.stateAtPoint(i * this.logoOscillationWaveLength));
      this.renderer.text(currentChar, 0, 0);
      this.renderer.pop();
      arclength += w / 2;
    }
    this.renderer.pop();
  };

  public createGraphic = () => {
    this.createLogo();
  };
}
