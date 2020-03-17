import {SketchComponent} from './SketchComponent';

export class SketchComponentManager {
  s;
  width: number;
  height: number;
  components: SketchComponent[];

  constructor(s, width: number, height: number) {
    this.s = s;
    this.width = width;
    this.height = height;
    this.components = [];
  }

  addComponent = <T extends SketchComponent>(component: new(s, w, h) => T) => {
    this.components.push(new component(this.s, this.width, this.height));
  };

  addComponents = (components: (new(s, w, d) => SketchComponent)[]) => {
    for (const component of components) {
      this.components.push(new component(this.s, this.width, this.height));
    }
  };

  renderComponents = () => {
    for (const component of this.components) {
      component.render();
    }
  };

  handleComponentsClickEvents = (clickEvent) => {
    for (const component of this.components) {
      component.onClick(clickEvent);
    }
  };

  handleCanvasResize = (width: number, height: number) => {
    for (const component of this.components) {
      component.handleResize(width, height);
    }
  };
}
