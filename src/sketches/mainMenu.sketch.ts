import {SketchComponent} from '../models/SketchComponent';
import {ShrinkGrow} from '../models/Animations';
import {InteractiveComponent} from '../models/InteractiveComponent';
import {ClickEvent} from '../models/ClickEvent';
import {getRandomColor} from '../models/Functions';
import {Oscillator} from '../models/Transforms';

export class MainMenuSketch extends SketchComponent implements InteractiveComponent {

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/NanotechLlc-ed2B.otf');
    this.renderer.textFont(this.font, 100);
    // The text must be centered!
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.smooth();
    this.startButtonShrinkGrow = new ShrinkGrow(this.renderer, 1, 1.2, 1);
    this.logoOscillator = new Oscillator(1 - this.logoOscillationRange, 1 + this.logoOscillationRange, this.logoCyclesPerSecond);
  }

  message = 'Rhythm Game!';
  font;
  logoRadius = 500;
  startButtonShrinkGrow;
  logoOscillator;
  logoOscillationRange = 0.01;
  logoOscillationWaveLength = 1;
  logoCyclesPerSecond = 0.5;
  startButtonColor = [0, 0, 0];
  outlineColor = 0;
  startButtonHovered = false;

  createLogo = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.3 + this.logoRadius);
    let arclength = this.logoRadius * this.renderer.PI / 2 - this.renderer.textWidth(this.message) / 2;
    this.logoOscillator.nextState();
    for (let i = 0; i < this.message.length; i++) {
      const currentChar = this.message.charAt(i);
      const w = this.renderer.textWidth(currentChar);
      const localRadius = this.logoRadius * this.logoOscillator.stateAtPoint(i * this.logoOscillationWaveLength);
      // console.log(localRadius);

      arclength += w / 2;
      const theta = this.renderer.PI + arclength / this.logoRadius;
      this.renderer.push();
      this.renderer.translate(this.logoRadius * this.renderer.cos(theta), localRadius * this.renderer.sin(theta));
      this.renderer.rotate(theta + this.renderer.PI / 2);
      this.renderer.fill(0);
      this.renderer.text(currentChar, 0, 0);
      this.renderer.pop();
      arclength += w / 2;
    }
    this.renderer.pop();
  };

  createStartButton = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.7);
    this.renderer.rectMode(this.renderer.CENTER);

    if (this.startButtonHovered) {
      this.renderer.scale(1.3);
    } else {
      this.startButtonShrinkGrow.nextState();
    }

    this.renderer.fill(this.startButtonColor);
    this.renderer.strokeWeight(4);
    this.renderer.stroke(this.outlineColor);
    this.renderer.textSize(80);
    this.renderer.text('Tap To Start!', 0, 0);
    this.renderer.pop();
  };

  createGraphic = () => {
    this.createLogo();
    this.createStartButton();
  };

  onClick(clickEvent: ClickEvent) {
    console.log(`Clicked Start Button`);
    this.startButtonColor = getRandomColor();
  }

  onHover() {
    console.log(`Hovered Start Button`);
    this.outlineColor = 255;
    this.startButtonHovered = true;
  }

  onHoverLost() {
    this.outlineColor = 0;
    this.startButtonHovered = false;
  }

  registerBounds(s): any {
    s.translate(this.width / 2, this.height * 0.7 - 30);
    s.rectMode(this.renderer.CENTER);
    s.rect(0, 0, 500, 100);
  }
}
