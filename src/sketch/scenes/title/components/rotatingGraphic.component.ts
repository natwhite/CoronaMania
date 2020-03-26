import {EventEmitter} from 'events';
import {ClickEvent} from '../../../core/event/ClickEvent';
import {DragMouseEvent} from '../../../core/event/DragMouseEvent';
import {IInteractiveComponent} from '../../../core/event/IInteractiveComponent';
import {Functions} from '../../../core/Functions';
import {SketchComponent} from '../../../core/SketchComponent';

export class RotatingGraphicComponent extends SketchComponent implements IInteractiveComponent {

  public rotation = 0;
  public boundsUpdated = false;

  public color1 = [255, 0, 255];
  public color2 = [0, 255, 255];
  public strokeColor = 0;
  public strokeWeight = 1;
  public hitDimensions = 350;
  public onInteraction: EventEmitter = new EventEmitter();
  private scaling = 1;

  constructor(s, width: number, height: number) {
    super(s, width, height, true, s.WEBGL);
  }

  public createGraphic = () => {
    // this.renderer.translate(0, 0, -1000);
    this.renderer.rotateX(this.rotation += 0.003);
    this.renderer.rotateY(this.rotation += 0.003);
    this.renderer.rotateZ(this.rotation += 0.003);
    // this.renderer.background(150);
    this.renderer.stroke(this.strokeColor);
    this.renderer.strokeWeight(this.strokeWeight);
    this.renderer.scale(this.scaling);
    this.renderer.fill(this.color1);
    this.renderer.box(310, 210, 310);
    this.renderer.fill(this.color2);
    this.renderer.box(210, 310, 210);
  };

  public registerBounds = (s) => {
    s.translate(s.width / 2, s.height / 2);
    s.rect(-this.hitDimensions / 2, -this.hitDimensions / 2, this.hitDimensions, this.hitDimensions);
  };

  public onClick = (clickEvent: ClickEvent) => {
    // TODO : Find the constants for each mouse button.
    // if (clickEvent.mouseButton == this.s.MOUSE)
    // console.log('Got clicked');
    this.color1 = Functions.getRandomColor();
    this.color2 = Functions.getRandomColor();
    this.onInteraction.emit('clicked');
    // console.log(`Colors are ${this.color1}, ${this.color2}`);
  };

  public onMouseDrag(dragEvent: DragMouseEvent) {
    return;
  }

  public onHover = () => {
    this.strokeColor = 255;
    this.strokeWeight = 5;
    this.scaling = 1.1;
  };

  public onHoverLost = () => {
    this.strokeColor = 0;
    this.strokeWeight = 1;
    this.scaling = 1;
  };
}
