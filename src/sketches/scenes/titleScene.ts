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
  public onStartClick: EventEmitter = new EventEmitter();

  constructor(s) {
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    console.log(`Dimensions at title scene are ${this.width}, ${this.height}`);
    this.componentManager = new SketchComponentManager(s, this.width, this.height);
    // this.componentManager.addComponentsByClass([
    //   BackgroundGraphics,
    //   // MenuController,
    //   RotatingGraphicSketch,
    //   MainMenuSketch
    // ]);

    const mainMenu = new MainMenuSketch(s, this.width, this.height);
    mainMenu.onInteraction.on('click', () => {
      console.log(`Got click from MainMenu`);
      this.onStartClick.emit('transition');
    });
    this.componentManager.addComponents([
      new BackgroundGraphics(s, this.width, this.height),
      // MenuController,
      new RotatingGraphicSketch(s, this.width, this.height),
      mainMenu
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
