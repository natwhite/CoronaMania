import {ResizableComponent} from './ResizableComponent';

export abstract class SketchComponent extends ResizableComponent {

  protected constructor(s, width: number, height: number, layered = true, renderType = s.P2D) {
    super();
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

  protected s;
  layered;
  renderer;
  rendering = true;

  protected createGraphic: () => void;
  render = () => {
    if (!this.rendering) {
      return;
    }
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

  setRendering(state: boolean) {
    this.rendering = state;
  }
}
