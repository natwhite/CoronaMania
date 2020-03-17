import {LayeredRendition} from './LayeredRendition';

export abstract class SketchComponent implements LayeredRendition {

  protected constructor(s, width: number, height: number, layered = true, renderType = s.P2D) {
    this.s = s;
    this.layered = layered;
    this.width = width;
    this.height = height;

    if (layered) {
      const graphics = s.createGraphics(this.width, this.height, renderType);
      graphics.clear();
      this.renderer = graphics;
    } else {
      this.renderer = s;
    }
  }

  s;
  layered;
  graphics;
  renderer;
  width: number;
  height: number;

  createGraphic: () => void;
  onClick?: (clickEvent) => void;
  onResize?: (width: number, height: number) => void;
  render = () => {
    if (this.layered) {
      this.renderer.clear();
      this.renderer.push();
      this.createGraphic();
      this.renderer.pop();
      this.s.image(this.renderer, -this.width / 2, -this.height / 2);
    } else {
      this.createGraphic();
    }
  };

  handleResize = (width: number, height: number) => {
    this.width = width;
    this.height = height;

    if (this.layered) {
      this.renderer.resizeCanvas(this.width, this.height);
    }

    if (this.onResize) {
      this.onResize(this.width, this.height);
    }
  };
}
