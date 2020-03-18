import {InteractiveComponent} from './InteractiveComponent';
import {ClickEvent} from './ClickEvent';
import {ResizableComponent} from './ResizableComponent';

export class SketchEventHandler {
  collisionMap;
  private debugLayer;
  collisionMapPixels;
  private s;
  private components: InteractiveComponent[] = [];
  private callbackMap: { [color: number]: InteractiveComponent } = {};
  private lastHover: InteractiveComponent | undefined;

  constructor(s, width: number, height: number) {
    this.s = s;
    this.collisionMap = s.createGraphics(width, height);
    this.collisionMap.noStroke();
  }

  private colorIndex = 255;

  addComponent = <T extends InteractiveComponent>(component: T) => {
    this.components.push(component);
  };

  addComponents = (components: InteractiveComponent[]) => {
    for (const component of components) {
      this.addComponent(component);
    }
  };

  handleMouseMove = (width: number, height: number) => {
  };

  updateCollisionMap = () => {
    console.log(`SketchEventHandler: Updating collision map`);

    this.colorIndex = 255;
    this.collisionMap.background(0);
    // this.collisionMap.blendMode(this.s.REPLACE);

    for (const component of this.components) {
      this.collisionMap.push();
      this.collisionMap.fill(this.colorIndex);
      component.registerBounds(this.collisionMap);
      this.collisionMap.pop();
      this.callbackMap[this.colorIndex--] = component;
    }

    // this.collisionMap.blendMode(this.s.ADD);
    this.collisionMap.loadPixels();
    this.collisionMapPixels = this.collisionMap.pixels;

    const debugCanvas = this.s.createGraphics(this.s.width, this.s.height);
    debugCanvas.background(0);
    (this.debugLayer = debugCanvas.get()).mask(this.collisionMap.get());
  };

  queryHitMap = (x: number, y: number): InteractiveComponent | undefined => {
    // The first four values (indices 0-3) in the array will be the R, G, B, A values of the pixel at (0, 0).
    // The second four values (indices 4-7) will contain the R, G, B, A values of the pixel at (1, 0).
    const hitColor = this.collisionMapPixels[4 * (y * this.collisionMap.width + x)];
    return this.callbackMap[hitColor];
    // console.log(hitColor, clickEvent.y * this.collisionMap.width + clickEvent.x);
  };

  handleClick = (clickEvent: ClickEvent) => {
    const component = this.queryHitMap(clickEvent.x, clickEvent.y);
    if (!component) {
      return;
    }
    component.onClick(clickEvent);
  };

  handleHover(clickEvent: ClickEvent) {
    const component = this.queryHitMap(clickEvent.x, clickEvent.y);

    if (this.lastHover && this.lastHover !== component) {
      this.lastHover.onHoverLost();
    }

    this.lastHover = component;

    if (!component) {
      return;
    }

    component.onHover();
  }

  isResizable = (component: InteractiveComponent | ResizableComponent): component is InteractiveComponent => {
    return (component as ResizableComponent).handleResize !== undefined;
  };

  handleCanvasResize = (width: number, height: number) => {
    this.collisionMap = this.s.Graphics(width, height);

    for (const component of this.components) {
      if (this.isResizable(component)) {
        (component as (InteractiveComponent & ResizableComponent)).handleResize(width, height);
      }
    }
  };

  debugHitBoxes = () => {
    this.s.image(this.debugLayer, -this.s.width / 2, -this.s.height / 2);
  };
}

