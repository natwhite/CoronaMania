import {ClickEvent} from './event/ClickEvent';
import {DragMouseEvent} from './event/DragMouseEvent';
import {SketchComponentManager} from './SketchComponentManager';

export abstract class Scene {
  public s;
  public width;
  public height;
  public componentManager;

  protected constructor(s) {
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    this.componentManager = new SketchComponentManager(s, this.width, this.height);
  }

  public initialize = () => {
    this.componentManager.initialize();
  };

  public draw = () => {
    this.componentManager.renderComponents();
  };

  public handleClick = (clickEvent: ClickEvent) => {
    this.componentManager.handleClick(clickEvent);
  };

  public handleHover = (clickEvent: ClickEvent) => {
    this.componentManager.handleHover(clickEvent);
  };

  public handleMouseDrag = (dragEvent: DragMouseEvent) => {
    this.componentManager.handleMouseDrag(dragEvent);
  };

  public handleCanvasResize = (width, height) => {
    this.width = width;
    this.height = height;
    this.componentManager.handleCanvasResize(width, height);
  };
}
