import {EventEmitter} from 'events';
import {SketchComponent} from '../../../core/SketchComponent';

export class LevelSelectTitleComponent extends SketchComponent {

  public onInteraction: EventEmitter = new EventEmitter();
  private readonly message = 'Level Select';
  private readonly font;
  private readonly fontSize = 80;
  private readonly boxPadding = 80 * 0.3;

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/ttg_by_westralinc-dbnnkt8.ttf');
    this.renderer.textFont(this.font, 100);
    this.renderer.textAlign(this.renderer.CENTER);
  }

  public createGraphic = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.1);
    this.renderer.rectMode(this.renderer.CENTER);
    this.renderer.noStroke();
    this.renderer.fill(255);
    this.renderer.textSize(this.fontSize);
    this.renderer.rect(
      0,
      -this.fontSize / 4,
      this.renderer.textWidth(this.message) + this.boxPadding,
      this.fontSize + this.boxPadding
    );
    this.renderer.fill(0);
    this.renderer.strokeWeight(4);
    // this.renderer.stroke(this.outlineColor);
    this.renderer.text(this.message, 0, 0);
    this.renderer.pop();
  };
}
