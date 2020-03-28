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
  private currentScene: { dragMap: ISceneDragMap, scene: Scene };
  private nextScene: { dragMap: ISceneDragMap, scene: Scene };
  private transitionSpeed = 0.06666;
  private transitioning = false;
  private sceneTransform: ITransform<number>;
  private transitionMultMatrix = [0, 0];
  private draggableTransitionsDefined = false;
  private transitionDragEvent: DragMouseEvent;
  private transitionTriggerPercent = 0.3;

  constructor(s, scenes: Scene[], width: number = null, height: number = null) {
    if (scenes.length <= 0) {
      throw new Error(`Tried to create a SceneTransitionManager with no scenes!`);
    }
    this.s = s;
    this.width = width ? width : s.windowWidth;
    this.height = height ? height : s.windowHeight;
    this.scenes = scenes.map((scene, index) => ({
      dragMap: {index} as ISceneDragMap,
      scene
    }));
    this.currentScene = this.scenes[0];
  }

  public transitionToScene(
    sceneIndex: number,
    transitionDirection: TransitionDirectionType,
    transitionType: TransitionType = TransitionType.Sigmoid,
    startingPercent: number = 0
  ) {
    if (sceneIndex >= this.scenes.length) {
      throw new Error(`Requested scene out of range : Scene ${sceneIndex}`);
    } else if (this.scenes[sceneIndex] === this.currentScene) {
      throw new Error(`Cannot transition to the same scene.`);
    }
    console.log(`Transitioning to scene ${sceneIndex}`);
    this.nextScene = this.scenes[sceneIndex];
    // TODO : The resize on transition isn't as smooth as I'd like.
    // TODO : Find a way to handle resized selectively while avoiding a hitmap update.
    this.nextScene.scene.handleCanvasResize(this.width, this.height);

    const createTransition = (stop: number, type: TransitionType): ITransform<number> => {
      let transitionFunction: ITransform<number> = null;
      switch (type) {
        case TransitionType.Linear:
          transitionFunction = new Lerp(0, stop, this.transitionSpeed);
          break;
        case TransitionType.Sigmoid:
          transitionFunction = new Sigmoid(0, stop, this.transitionSpeed, 1.5, startingPercent);
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
      // console.log(`Transition to Scene ${sceneIndex} complete.`);
      this.currentScene = this.nextScene;
      this.transitioning = false;
    });
    this.transitioning = true;
  }

  public setTransitionOnDrag(fromScene: number, toScene: number, transitionType: TransitionDirectionType) {
    this.draggableTransitionsDefined = true;

    // TODO : POC implementation in desperate need of a refactor.
    switch (transitionType) {
      case TransitionDirectionType.RIGHT:
        this.scenes[fromScene].dragMap.RIGHT = this.scenes[toScene].dragMap;
        break;
      case TransitionDirectionType.LEFT:
        this.scenes[fromScene].dragMap.LEFT = this.scenes[toScene].dragMap;
        break;
      case TransitionDirectionType.UP:
        this.scenes[fromScene].dragMap.UP = this.scenes[toScene].dragMap;
        break;
      case TransitionDirectionType.DOWN:
        this.scenes[fromScene].dragMap.DOWN = this.scenes[toScene].dragMap;
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
      this.currentScene.scene.draw();
      this.s.translate(
        this.width * this.transitionMultMatrix[0],
        this.height * this.transitionMultMatrix[1]
      );
      this.nextScene.scene.draw();
    } else {
      this.currentScene.scene.draw();
    }
  };

  public handleClick = (clickEvent: ClickEvent) => {
    if (this.transitioning) {
      return;
    }
    this.currentScene.scene.handleClick(clickEvent);
  };

  public handleHover = (clickEvent: ClickEvent) => {
    if (this.transitioning) {
      return;
    }
    this.currentScene.scene.handleHover(clickEvent);
  };

  public handleMouseDrag = (dragEvent: DragMouseEvent) => {
    if (this.draggableTransitionsDefined) {
      this.transitionDragEvent = dragEvent;
      // this.s.translate(100, 100);
      // console.log(`Draggable transitions defined for scene ${this.currentSceneIndex}`);
      const leftMap = this.currentScene.dragMap.LEFT;
      const rightMap = this.currentScene.dragMap.RIGHT;
      this.s.translate(dragEvent.x2 - dragEvent.x1, 0);
      if (leftMap) {
        this.s.push();
        this.s.translate(-this.width, 0);
        // console.log(`Rendering left scene`);
        this.scenes[leftMap.index].scene.draw();
        this.s.pop();
      }
      if (rightMap) {
        this.s.push();
        this.s.translate(this.width, 0);
        // console.log(`Rendering right scene`);
        this.scenes[rightMap.index].scene.draw();
        this.s.pop();
      }
    }
    this.currentScene.scene.handleMouseDrag(dragEvent);
  };

  public handleCanvasResize = (width, height) => {
    this.width = width;
    this.height = height;
    this.currentScene.scene.handleCanvasResize(width, height);
  };

  public handleMouseRelease(clickEvent: ClickEvent) {
    if (this.draggableTransitionsDefined && this.transitionDragEvent) {
      if (Math.abs(this.transitionDragEvent.deltaX) >= this.width * this.transitionTriggerPercent) {
        const left = this.currentScene.dragMap.LEFT;
        const right = this.currentScene.dragMap.RIGHT;
        const percent = Math.abs(this.transitionDragEvent.deltaX / this.width);

        if (this.transitionDragEvent.deltaX > 0 && left) {
          this.transitionToScene(left.index, TransitionDirectionType.LEFT, TransitionType.Sigmoid, percent);
          // console.log(`Triggering scene transition to left.`);
        } else if (right) {
          this.transitionToScene(right.index, TransitionDirectionType.RIGHT, TransitionType.Sigmoid, percent);
          // console.log(`Triggering scene transition to right.`);
        }
      }
      this.transitionDragEvent = null;
    }
  }
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
