import {SketchComponent} from './SketchComponent';
import {SketchEventHandler} from './SketchEventHandler';
import {InteractiveComponent} from './InteractiveComponent';
import {ClickEvent} from './ClickEvent';

export class SketchComponentManager {
  s;
  width: number;
  height: number;
  componentInitializers: (new(s, w, d) => SketchComponent)[];
  components: SketchComponent[];
  eventHandler: SketchEventHandler;

  constructor(s, width: number, height: number) {
    this.s = s;
    this.width = width;
    this.height = height;
    this.components = [];
    this.componentInitializers = [];
    this.eventHandler = new SketchEventHandler(s, width, height);
  }

  initialize = () => {
    console.log('SketchComponentManager: Initializing component manager');

    for (const component of this.componentInitializers) {
      const createdComponent = new component(this.s, this.width, this.height);
      this.components.push(createdComponent);

      if (this.isInteractive(createdComponent)) {
        this.eventHandler.addComponent(createdComponent);
      }
    }
    this.eventHandler.updateCollisionMap();
  };

  isInteractive = (component: any | InteractiveComponent): component is InteractiveComponent => {
    return (component as InteractiveComponent).onClick !== undefined;
  };

  addComponent = (component: new(s, w, h) => SketchComponent) => {
    this.componentInitializers.push(component);
  };

  // TODO : Convert to just appending all to the end of componentInitializers.
  addComponents = (components: (new(s, w, d) => SketchComponent)[]) => {
    for (const component of components) {
      this.addComponent(component);
    }
  };

  renderComponents = () => {
    for (const component of this.components) {
      component.render();
    }
  };

  handleCanvasResize = (width: number, height: number) => {
    for (const component of this.components) {
      component.handleResize(width, height);
    }
  };

  handleClick = (clickEvent: ClickEvent) => {
    this.eventHandler.handleClick(clickEvent);
  };

  handleHover = (clickEvent: ClickEvent) => {
    this.eventHandler.handleHover(clickEvent);
  };

  debugHitBoxes = () => {
    this.eventHandler.debugHitBoxes();
  };
}
