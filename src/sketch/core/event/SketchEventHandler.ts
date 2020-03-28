import {ClickEvent} from './ClickEvent';
import {DragMouseEvent} from './DragMouseEvent';
import {IInteractiveComponent} from './IInteractiveComponent';
import {ResizableComponent} from './ResizableComponent';

export class SketchEventHandler {
  public collisionMap;
  // private debugLayer;
  private s;
  private components: IInteractiveComponent[] = [];
  private callbackMap: { [color: number]: IInteractiveComponent } = {};
  private lastHover: IInteractiveComponent | undefined;

  private colorIndex = 255;

  constructor(s, width: number, height: number) {
    this.s = s;
    this.collisionMap = s.createGraphics(width, height);
    this.collisionMap.noStroke();
  }

  public addComponent = <T extends IInteractiveComponent>(component: T) => {
    this.components.push(component);
  };

  public addComponents = (components: IInteractiveComponent[]) => {
    for (const component of components) {
      this.addComponent(component);
    }
  };

  // TODO : refactor to cycle through hit-box functions rather than a hitmap for memory purposes.
  public updateCollisionMap = () => {
    console.log(`SketchEventHandler: Updating collision map`);

    this.colorIndex = 255;
    this.collisionMap.background(0, 0, 0, 0);
    this.collisionMap.noStroke();
    // this.collisionMap.blendMode(this.s.REPLACE);

    // TODO : scaling needs to be applied to the collision map as well.
    for (const component of this.components) {
      this.collisionMap.push();
      this.collisionMap.fill(this.colorIndex);
      component.registerBounds(this.collisionMap);
      this.collisionMap.pop();
      this.callbackMap[this.colorIndex--] = component;
    }

    // TODO : commented for efficiency
    this.collisionMap.loadPixels();

    // const debugCanvas = this.s.createGraphics(this.collisionMap.width, this.collisionMap.height);
    // debugCanvas.background(255);
    // this.debugLayer = this.collisionMap.get();
    // (this.debugLayer = this.collisionMap.get()).mask(debugCanvas.get());
  };

  public queryHitMap = (x: number, y: number): IInteractiveComponent | undefined => {
    // The first four values (indices 0-3) in the array will be the R, G, B, A values of the pixel at (0, 0).
    // The second four values (indices 4-7) will contain the R, G, B, A values of the pixel at (1, 0).
    const pixelIndex = 4 * (y * this.collisionMap.width + x);
    const hitColor = this.collisionMap.pixels[pixelIndex];
    // console.log(`Color was ${hitColor} at ${pixelIndex} of ${this.collisionMap.pixels.length}`);
    return this.callbackMap[hitColor];
  };

  public handleClick = (clickEvent: ClickEvent) => {
    const component = this.queryHitMap(clickEvent.x, clickEvent.y);
    // console.log(`Got clickevent at ${clickEvent.x}, ${clickEvent.y}\n Component was ${component}`);
    // console.log(this.collisionMap.pixels);
    if (!component) {
      return;
    }
    component.onClick(clickEvent);
  };

  public handleHover(clickEvent: ClickEvent) {
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

  public isResizable = (component: IInteractiveComponent | ResizableComponent): component is IInteractiveComponent => {
    return (component as ResizableComponent).handleResize !== undefined;
  };

  public handleCanvasResize = (width: number, height: number) => {
    this.collisionMap.resizeCanvas(width, height);
    this.collisionMap.clear();
    this.collisionMap.noStroke();

    // for (const component of this.components) {
    //   if (this.isResizable(component)) {
    //     (component as (InteractiveComponent & ResizableComponent)).handleResize(width, height);
    //   }
    // }
    this.updateCollisionMap();
  };

  // public debugHitBoxes = () => {
  //   // this.s.image(1 / 0.571);
  //   this.s.image(this.debugLayer, -this.s.width / 2, -this.s.height / 2);
  // };

  public handleMouseDrag(dragEvent: DragMouseEvent) {
    for (const component of this.components) {
      component.onMouseDrag(dragEvent);
    }
  }
}
