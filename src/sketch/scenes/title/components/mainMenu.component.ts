import {EventEmitter} from 'events';
import {ShrinkGrow} from '../../../core/Animations';
import {ClickEvent} from '../../../core/event/ClickEvent';
import {DragMouseEvent} from '../../../core/event/DragMouseEvent';
import {IInteractiveComponent} from '../../../core/event/IInteractiveComponent';
import {Functions} from '../../../core/Functions';
import {SketchComponent} from '../../../core/SketchComponent';
import {Oscillator} from '../../../core/transforms/Oscillator';
import {RNGColorOscillator} from '../../../core/transforms/RNGColorOscillator';

// TODO : Refactor and split into title and startbutton sketch components.
export class MainMenuComponent extends SketchComponent implements IInteractiveComponent {

  public message = 'Corona Mania!';
  public font;
  public logoRadius = 500;
  public startButtonShrinkGrow;
  public logoOscillator;
  public logoColorOscillator;
  public logoOscillationRange = 0.01;
  public logoOscillationWaveLength = 1;
  public logoCyclesPerSecond = 0.5;
  public startButtonColor = [0, 0, 0];
  public outlineColor = 0;
  public startButtonHovered = false;

  public onInteraction: EventEmitter = new EventEmitter();

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/NanotechLlc-ed2B.otf');
    this.renderer.textFont(this.font, 100);
    // The text must be centered!
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.smooth();
    this.startButtonShrinkGrow = new ShrinkGrow(this.renderer, 1, 1.2, 1);
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
    // this.renderer.fill(Functions.getRandomColor());
    for (let i = 0; i < this.message.length; i++) {
      const currentChar = this.message.charAt(i);
      const w = this.renderer.textWidth(currentChar);
      const localRadius = this.logoRadius * this.logoOscillator.stateAtPoint(i * this.logoOscillationWaveLength);
      arclength += w / 2;
      const theta = this.renderer.PI + arclength / this.logoRadius;

      this.renderer.push();
      this.renderer.translate(this.logoRadius * this.renderer.cos(theta), localRadius * this.renderer.sin(theta));
      this.renderer.rotate(theta + this.renderer.PI / 2);
      this.renderer.fill(this.logoColorOscillator.stateAtPoint(i * this.logoOscillationWaveLength));
      this.renderer.text(currentChar, 0, 0);
      this.renderer.pop();
      arclength += w / 2;
    }
    this.renderer.pop();
  };

  public createStartButton = () => {
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

  public createGraphic = () => {
    this.createLogo();
    this.createStartButton();
  };

  public onClick(clickEvent: ClickEvent) {
    this.startButtonColor = Functions.getRandomColor();
    this.onInteraction.emit('click');
  }

  public onMouseDrag(dragEvent: DragMouseEvent) {
    return;
  }

  public onHover() {
    this.outlineColor = 255;
    this.startButtonHovered = true;
  }

  public onHoverLost() {
    this.outlineColor = 0;
    this.startButtonHovered = false;
  }

  public registerBounds(s): any {
    s.translate(this.width / 2, this.height * 0.7 - 30);
    s.rectMode(this.renderer.CENTER);
    s.rect(0, 0, 500, 100);
  }
}
