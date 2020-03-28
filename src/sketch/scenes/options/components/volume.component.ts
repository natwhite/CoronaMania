import {EventEmitter} from 'events';
import {SketchComponent} from '../../../core/SketchComponent';

export class VolumeComponent extends SketchComponent {
  public onInteraction: EventEmitter = new EventEmitter();
  private readonly title = 'Volume';
  private readonly font;
  private readonly fontSize = 60;

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/ttg_by_westralinc-dbnnkt8.ttf');
    this.renderer.textFont(this.font, 100);
  }

  public createGraphic = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.25);
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.rectMode(this.renderer.CENTER);
    this.renderer.noStroke();
    this.renderer.textSize(this.fontSize);
    this.renderer.fill(0);
    this.renderer.strokeWeight(4);
    this.renderer.text(this.title, 0, 0);
    this.renderer.pop();
  };
}
