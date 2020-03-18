import {SketchComponent} from '../models/SketchComponent';
import {InteractiveComponent} from '../models/InteractiveComponent';
import {ClickEvent} from '../models/ClickEvent';

export class RotatingGraphicSketch extends SketchComponent implements InteractiveComponent {
  constructor(s, width: number, height: number) {
    super(s, width, height, true, s.WEBGL);
  }

  rotation = 0;
  boundsUpdated = false;

  color1 = [255, 0, 255];
  color2 = [0, 255, 255];
  strokeColor = 0;
  strokeWeight = 1;
  private scaling = 1;
  hitDimentions = 350;

  getNumberBetween = (start: number, end: number) => {
    return Math.floor(Math.random() * (end - start) + start);
  };

  getRandomColor = () => {
    return [this.getNumberBetween(0, 255), this.getNumberBetween(0, 255), this.getNumberBetween(0, 255)];
  };

  createGraphic = () => {
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

  registerBounds = (s) => {
    s.translate(s.width / 2, s.height / 2);
    s.rect(-this.hitDimentions / 2, -this.hitDimentions / 2, this.hitDimentions, this.hitDimentions);
  };

  onClick = (clickEvent: ClickEvent) => {
    // TODO : Find the constants for each mouse button.
    // if (clickEvent.mouseButton == this.s.MOUSE)
    // console.log('Got clicked');
    this.color1 = this.getRandomColor();
    this.color2 = this.getRandomColor();

    // console.log(`Colors are ${this.color1}, ${this.color2}`);
  };

  onHover = () => {
    console.log('RotatingGraphic: Hovered');
    this.strokeColor = 255;
    this.strokeWeight = 5;
    this.scaling = 1.1;
  };

  onHoverLost = () => {
    console.log('RotatingGraphic: Lost Hover');
    this.strokeColor = 0;
    this.strokeWeight = 1;
    this.scaling = 1;
  };
}
