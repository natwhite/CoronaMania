import {SketchComponent} from '../models/SketchComponent';

export class MainMenuSketch extends SketchComponent {
  message = 'Rhythm Game!';
  f;
  r = 500;

  constructor(s, w, h) {
    super(s, w, h, true, s.WEBGL);

    this.f = s.loadFont('../assets/NanotechLlc-ed2B.otf');
    this.renderer.textFont(this.f, 70);
    // The text must be centered!
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.smooth();
  }

  createGraphic = () => {
    this.renderer.translate(0, this.r - 150);

    let arclength = this.r * this.renderer.PI / 2 - this.renderer.textWidth(this.message) / 2;

    for (let i = 0; i < this.message.length; i++) {
      const currentChar = this.message.charAt(i);
      const w = this.renderer.textWidth(currentChar);

      arclength += w / 2;
      const theta = this.renderer.PI + arclength / this.r;
      this.renderer.push();
      this.renderer.translate(this.r * this.renderer.cos(theta), this.r * this.renderer.sin(theta));
      this.renderer.rotate(theta + this.renderer.PI / 2);
      this.renderer.fill(0);
      this.renderer.text(currentChar, 0, 0);
      this.renderer.pop();
      arclength += w / 2;
    }
  };
}
