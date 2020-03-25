import {EventEmitter} from 'events';
import {ClickEvent} from '../../models/ClickEvent';
import {DragMouseEvent} from '../../models/DragMouseEvent';
import {SketchComponentManager} from '../../models/SketchComponentManager';
import {BackgroundGraphics} from '../backgroundGraphics.sketch';
import {MainMenuSketch} from '../mainMenu.sketch';
import {RotatingGraphicSketch} from '../rotatingGraphic.sketch';

export class TitleScene {
  public s;
  public width;
  public height;
  public componentManager;
  public transition: EventEmitter = new EventEmitter();

  constructor(s) {
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    console.log(`Dimensions at title scene are ${this.width}, ${this.height}`);
    this.componentManager = new SketchComponentManager(s, this.width, this.height);
    this.componentManager.addComponents([
      BackgroundGraphics,
      // MenuController,
      RotatingGraphicSketch,
      MainMenuSketch
    ]);
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
