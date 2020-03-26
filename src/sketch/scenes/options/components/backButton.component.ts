import {EventEmitter} from 'events';
import {ClickEvent} from '../../../core/event/ClickEvent';
import {DragMouseEvent} from '../../../core/event/DragMouseEvent';
import {IInteractiveComponent} from '../../../core/event/IInteractiveComponent';
import {SketchComponent} from '../../../core/SketchComponent';

export class BackButtonComponent extends SketchComponent implements IInteractiveComponent {

  public onInteraction: EventEmitter = new EventEmitter();
  private readonly message = 'Back';
  private readonly font;
  private readonly fontSize = 60;
  private readonly boxPadding = 80 * 0.3;
  private outlineColor: number[] = [0, 0, 0, 0];
  private hovered: boolean = false;

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/NanotechLlc-ed2B.otf');
    this.renderer.textFont(this.font, 100);
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.smooth();
  }

  public createGraphic = () => {
    this.renderer.push();
    this.renderer.noFill();
    this.registerBounds(this.renderer);
    this.renderer.fill(0);
    this.renderer.strokeWeight(4);
    this.renderer.stroke(this.outlineColor);

    if (this.hovered) {
      this.renderer.scale(1.3);
      this.renderer.translate(0, this.fontSize * 0.2);
    }

    this.renderer.text(this.message, 0, 0);
    this.renderer.pop();
  };

  public onClick(clickEvent: ClickEvent) {
    this.onInteraction.emit('click');
  }

  public onMouseDrag(dragEvent: DragMouseEvent) {
    return;
  }

  public onHover() {
    this.outlineColor = [255];
    this.hovered = true;
  }

  public onHoverLost() {
    this.outlineColor = [0, 0, 0, 0];
    this.hovered = false;
  }

  public registerBounds(s): any {
    s.translate(this.width * 0.85, this.height * 0.07);
    s.rectMode(s.CENTER);
    s.noStroke();
    s.textSize(this.fontSize);
    s.rect(
      0,
      -this.fontSize / 4,
      s.textWidth(this.message) + this.boxPadding,
      this.fontSize + this.boxPadding
    );
  }
}
