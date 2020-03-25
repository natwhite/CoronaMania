import {ClickEvent} from '../models/ClickEvent';
import {DragMouseEvent} from '../models/DragMouseEvent';
import {Scene} from '../models/Scene';

export class SceneTransitionManager {

  public s;
  public width;
  public height;
  public scenes;

  constructor(s, scenes: Scene[]) {
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    this.scenes = scenes;
  }

  public transitionScene(sceneNum: number, transitionType: TransitionType) {
    return new Error(`Unhandled Transition Request`);
  }

  public initialize = () => {
    for (const scene of this.scenes) {
      scene.initialize();
    }
  };
  public draw = () => {
    for (const scene of this.scenes) {
      scene.draw();
    }
  };

  public handleClick = (clickEvent: ClickEvent) => {
    for (const scene of this.scenes) {
      scene.handleClick(clickEvent);
    }
  };

  public handleHover = (clickEvent: ClickEvent) => {
    for (const scene of this.scenes) {
      scene.handleHover(clickEvent);
    }
  };

  public handleMouseDrag = (dragEvent: DragMouseEvent) => {
    for (const scene of this.scenes) {
      scene.handleMouseDrag(dragEvent);
    }
  };

  public handleCanvasResize = (width, height) => {
    for (const scene of this.scenes) {
      scene.handleCanvasResize(width, height);
    }
  };
}

export enum TransitionType {
  RIGHT,
  LEFT,
  UP,
  DOWN,
  FADEs
}
