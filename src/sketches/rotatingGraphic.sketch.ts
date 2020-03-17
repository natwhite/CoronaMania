import {SketchComponent} from '../models/SketchComponent';

export class RotatingGraphicSketch extends SketchComponent {


  constructor(s, width: number, height: number) {
    super(s, width, height, true, s.WEBGL);
  }

  rotation = 0;

  createGraphic = () => {
    // this.renderer.translate(0, 0, -1000);
    this.renderer.rotateX(this.rotation += 0.003);
    this.renderer.rotateY(this.rotation += 0.003);
    this.renderer.rotateZ(this.rotation += 0.003);
    // this.renderer.background(150);
    this.renderer.fill(255, 0, 255);
    this.renderer.box(310, 210, 310);
    this.renderer.fill(0, 255, 255);
    this.renderer.box(210, 310, 210);
  };
}
