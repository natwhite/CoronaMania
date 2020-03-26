import {EventEmitter} from 'events';
import {ShrinkGrow} from '../../../core/Animations';
import {ClickEvent} from '../../../core/event/ClickEvent';
import {DragMouseEvent} from '../../../core/event/DragMouseEvent';
import {IInteractiveComponent} from '../../../core/event/IInteractiveComponent';
import {Functions} from '../../../core/Functions';
import {SketchComponent} from '../../../core/SketchComponent';

// TODO : Refactor and split into title and startbutton sketch components.
export class StartButtonComponent extends SketchComponent implements IInteractiveComponent {

  public startButtonShrinkGrow;
  public startButtonColor = [0, 0, 0];
  public outlineColor = 0;
  public startButtonHovered = false;

  public onInteraction: EventEmitter = new EventEmitter();

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.smooth();
    this.startButtonShrinkGrow = new ShrinkGrow(this.renderer, 1, 1.2, 1);
  }

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
