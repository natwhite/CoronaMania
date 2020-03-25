import {ClickEvent} from '../models/ClickEvent';
import {DragMouseEvent} from '../models/DragMouseEvent';
import {Scene} from '../models/Scene';
import {Lerp} from '../models/transforms/Lerp';

export class SceneTransitionManager {

  private readonly s;
  private width;
  private height;
  private readonly scenes;
  private currentScene;
  private nextScene;
  private transitionSpeed = 0.06666;
  private transitioning = false;
  private lerpTransform;
  private transitionMultMatrix = [0, 0];
  private transitionDestMatrix = [0, 0];

  constructor(s, scenes: Scene[]) {
    if (scenes.length <= 0) {
      throw new Error(`Tried to create a SceneTransitionManager with no scenes!`);
    }
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    this.scenes = scenes;
    this.currentScene = this.scenes[0];
  }

  public transitionToScene(sceneIndex: number, transitionType: TransitionType) {
    if (sceneIndex >= this.scenes.length) {
      throw new Error(`Requested scene out of range : Scene ${sceneIndex}`);
    } else if (this.scenes[sceneIndex] === this.currentScene) {
      throw new Error(`Cannot transition to the same scene.`);
    }
    console.log(`Transitioning to scene ${sceneIndex}`);
    this.nextScene = this.scenes[sceneIndex];

    switch (transitionType) {
      case TransitionType.RIGHT:
        this.lerpTransform = new Lerp(0, -this.width, this.transitionSpeed);
        this.transitionMultMatrix = [1, 0];
        break;
      case TransitionType.LEFT:
        this.lerpTransform = new Lerp(0, this.width, this.transitionSpeed);
        this.transitionMultMatrix = [-1, 0];
        break;
      case TransitionType.UP:
        this.lerpTransform = new Lerp(0, this.height, this.transitionSpeed);
        this.transitionMultMatrix = [0, -1];
        break;
      case TransitionType.DOWN:
        this.lerpTransform = new Lerp(0, -this.height, this.transitionSpeed);
        this.transitionMultMatrix = [0, 1];
        break;
      case TransitionType.FADEs:
        throw new Error(`Transition Type not handled`);
        break;
    }

    this.lerpTransform.onComplete.on('completed', () => {
      console.log(`Transition to Scene ${sceneIndex} complete.`);
      this.currentScene = this.nextScene;
      this.transitioning = false;
    });
    this.transitioning = true;
  }

  public setTransitionOnDrag(sceneNum: number, transitionType: TransitionType) {
    throw new Error(`Unhandled Transition Request`);
  }

  public initialize = () => {
    for (const scene of this.scenes) {
      scene.initialize();
    }
  };

  public draw = () => {
    if (this.transitioning) {
      const nextState = this.lerpTransform.nextState();
      this.s.translate(
        nextState * Math.abs(this.transitionMultMatrix[0]),
        nextState * Math.abs(this.transitionMultMatrix[1])
      );
      this.currentScene.draw();
      this.s.translate(
        this.width * this.transitionMultMatrix[0],
        this.height * this.transitionMultMatrix[1]
      );
      this.nextScene.draw();
    } else {
      this.currentScene.draw();
    }
  };

  public handleClick = (clickEvent: ClickEvent) => {
    this.currentScene.handleClick(clickEvent);
  };

  public handleHover = (clickEvent: ClickEvent) => {
    this.currentScene.handleHover(clickEvent);
  };

  public handleMouseDrag = (dragEvent: DragMouseEvent) => {
    this.currentScene.handleMouseDrag(dragEvent);
  };

  public handleCanvasResize = (width, height) => {
    this.width = width;
    this.height = height;
    this.currentScene.handleCanvasResize(width, height);
  };
}

export enum TransitionType {
  RIGHT,
  LEFT,
  UP,
  DOWN,
  FADEs
}
