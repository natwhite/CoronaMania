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
  resizeDebounceTime = 250;
  timeSinceResizeRequest = 0;
  requireResize = true;
  debugMode = false;

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

    if (this.requireResize) {
      this.timeSinceResizeRequest += this.s.deltaTime;
      if (this.timeSinceResizeRequest >= this.resizeDebounceTime) {
        this.requireResize = false;
        this.timeSinceResizeRequest = 0;
        this.resizeCanvas();
      }
    }

    if (this.debugMode) {
      this.debugHitBoxes();
    }
  };

  resizeCanvas() {
    for (const component of this.components) {
      component.handleResize(this.width, this.height);
    }
    this.eventHandler.handleCanvasResize(this.width, this.height);
  }

  handleCanvasResize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.requireResize = true;
    this.timeSinceResizeRequest = 0;
  };

  handleClick = (clickEvent: ClickEvent) => {
    this.eventHandler.handleClick(clickEvent);
  };

  handleHover = (clickEvent: ClickEvent) => {
    this.eventHandler.handleHover(clickEvent);
  };

  enableDebugMode = (state: boolean) => {
    this.debugMode = state;
  };

  debugHitBoxes = () => {
    this.eventHandler.debugHitBoxes();
  };
}
