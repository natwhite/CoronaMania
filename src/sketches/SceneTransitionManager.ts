import {ClickEvent} from '../models/ClickEvent';
import {DragMouseEvent} from '../models/DragMouseEvent';
import {Scene} from '../models/Scene';
import {ITransform} from '../models/Transforms';
import {Lerp} from '../models/transforms/Lerp';
import {Sigmoid} from '../models/transforms/Sigmoid';

export class SceneTransitionManager {

  private readonly s;
  private width;
  private height;
  private readonly scenes;
  private currentScene;
  private nextScene;
  private transitionSpeed = 0.06666;
  private transitioning = false;
  private sceneTransform: ITransform<number>;
  private transitionMultMatrix = [0, 0];

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

  public transitionToScene(
    sceneIndex: number,
    transitionDirection: TransitionDirectionType,
    transitionType: TransitionType = TransitionType.Sigmoid
  ) {
    if (sceneIndex >= this.scenes.length) {
      throw new Error(`Requested scene out of range : Scene ${sceneIndex}`);
    } else if (this.scenes[sceneIndex] === this.currentScene) {
      throw new Error(`Cannot transition to the same scene.`);
    }
    console.log(`Transitioning to scene ${sceneIndex}`);
    this.nextScene = this.scenes[sceneIndex];

    const createTransition = (stop: number, type: TransitionType): ITransform<number> => {
      let transitionFunction: ITransform<number> = null;
      switch (type) {
        case TransitionType.Linear:
          transitionFunction = new Lerp(0, stop, this.transitionSpeed);
          break;
        case TransitionType.Sigmoid:
          transitionFunction = new Sigmoid(0, stop, this.transitionSpeed, 1.5);
          break;
      }
      return transitionFunction;
    };

    const createTypedTransition = (stop: number) => createTransition(stop, transitionType);

    switch (transitionDirection) {
      case TransitionDirectionType.RIGHT:
        this.sceneTransform = createTypedTransition(-this.width);
        this.transitionMultMatrix = [1, 0];
        break;
      case TransitionDirectionType.LEFT:
        this.sceneTransform = createTypedTransition(this.width);
        this.transitionMultMatrix = [-1, 0];
        break;
      case TransitionDirectionType.UP:
        this.sceneTransform = createTypedTransition(this.height);
        this.transitionMultMatrix = [0, -1];
        break;
      case TransitionDirectionType.DOWN:
        this.sceneTransform = createTypedTransition(-this.height);
        this.transitionMultMatrix = [0, 1];
        break;
      case TransitionDirectionType.FADEs:
        throw new Error(`Transition Type not handled`);
        break;
    }

    this.sceneTransform.onComplete.on('completed', () => {
      console.log(`Transition to Scene ${sceneIndex} complete.`);
      this.currentScene = this.nextScene;
      this.transitioning = false;
    });
    this.transitioning = true;
  }

  public setTransitionOnDrag(sceneNum: number, transitionType: TransitionDirectionType) {
    throw new Error(`Unhandled Transition Request`);
  }

  public initialize = () => {
    for (const scene of this.scenes) {
      scene.initialize();
    }
  };

  public draw = () => {
    if (this.transitioning) {
      const nextState = this.sceneTransform.nextState();
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

export enum TransitionDirectionType {
  RIGHT,
  LEFT,
  UP,
  DOWN,
  FADEs
}

export enum TransitionType {
  Linear,
  Sigmoid
}
