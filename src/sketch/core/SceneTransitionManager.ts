import {ClickEvent} from './event/ClickEvent';
import {DragMouseEvent} from './event/DragMouseEvent';
import {Functions} from './Functions';
import {ITransform} from './ITransform';
import {Scene} from './Scene';
import {Lerp} from './transforms/Lerp';
import {Sigmoid} from './transforms/Sigmoid';

export class SceneTransitionManager {

  private readonly s;
  private width: number;
  private height: number;
  private readonly scenes: Array<{ dragMap: ISceneDragMap, scene: Scene }>;
  private currentSceneIndex: number;
  private currentScene: Scene;
  private nextScene: Scene;
  private transitionSpeed = 0.06666;
  private transitioning = false;
  private sceneTransform: ITransform<number>;
  private transitionMultMatrix = [0, 0];
  private draggableTransitionsDefined = false;

  constructor(s, scenes: Scene[]) {
    if (scenes.length <= 0) {
      throw new Error(`Tried to create a SceneTransitionManager with no scenes!`);
    }
    this.s = s;
    this.width = s.windowWidth;
    this.height = s.windowHeight;
    this.scenes = scenes.map((scene, index) => ({
      dragMap: {index} as ISceneDragMap,
      scene
    }));
    this.currentScene = this.scenes[0].scene;
    this.currentSceneIndex = 0;
  }

  public transitionToScene(
    sceneIndex: number,
    transitionDirection: TransitionDirectionType,
    transitionType: TransitionType = TransitionType.Sigmoid
  ) {
    if (sceneIndex >= this.scenes.length) {
      throw new Error(`Requested scene out of range : Scene ${sceneIndex}`);
    } else if (this.scenes[sceneIndex].scene === this.currentScene) {
      throw new Error(`Cannot transition to the same scene.`);
    }
    console.log(`Transitioning to scene ${sceneIndex}`);
    this.nextScene = this.scenes[sceneIndex].scene;
    // TODO : The resize on transition isn't as smooth as I'd like.
    // TODO : Find a way to handle resized selectively while avoiding a hitmap update.
    this.nextScene.handleCanvasResize(this.width, this.height);

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
    }

    this.sceneTransform.onComplete.on('completed', () => {
      console.log(`Transition to Scene ${sceneIndex} complete.`);
      this.currentScene = this.nextScene;
      this.currentSceneIndex = sceneIndex;
      this.transitioning = false;
    });
    this.transitioning = true;
  }

  public setTransitionOnDrag(fromScene: number, toScene: number, transitionType: TransitionDirectionType) {
    this.draggableTransitionsDefined = true;

    // TODO : POC implementation in desperate need of a refactor.
    switch (transitionType) {
      case TransitionDirectionType.RIGHT:
        this.scenes[fromScene].dragMap.RIGHT = this.scenes[fromScene].dragMap;
        break;
      case TransitionDirectionType.LEFT:
        this.scenes[fromScene].dragMap.LEFT = this.scenes[fromScene].dragMap;
        break;
      case TransitionDirectionType.UP:
        this.scenes[fromScene].dragMap.UP = this.scenes[fromScene].dragMap;
        break;
      case TransitionDirectionType.DOWN:
        this.scenes[fromScene].dragMap.DOWN = this.scenes[fromScene].dragMap;
        break;

    }
    // throw new Error(`Unhandled Transition Request`);
  }

  public initialize = () => {
    for (const scene of this.scenes) {
      scene.scene.initialize();
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
    if (this.transitioning) {
      return;
    }
    this.currentScene.handleClick(clickEvent);
  };

  public handleHover = (clickEvent: ClickEvent) => {
    if (this.transitioning) {
      return;
    }
    this.currentScene.handleHover(clickEvent);
  };

  public handleMouseDrag = (dragEvent: DragMouseEvent) => {
    if (this.draggableTransitionsDefined) {
      // this.currentScene.translate(dragEvent.x2 - dragEvent.x1, 0);
    }
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
}

export enum TransitionType {
  Linear,
  Sigmoid
}

export interface ISceneDragMap {
  index: number;
  RIGHT: ISceneDragMap;
  LEFT: ISceneDragMap;
  UP: ISceneDragMap;
  DOWN: ISceneDragMap;
}
