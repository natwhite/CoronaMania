import {ClickEvent} from './core/event/ClickEvent';
import {DragMouseEvent} from './core/event/DragMouseEvent';
import {SceneTransitionManager, TransitionDirectionType} from './core/SceneTransitionManager';
import {OptionsScene} from './scenes/options/options.scene';
import {TitleScene} from './scenes/title/title.scene';

// Going to need a way to import, obj files.
// TODO : Rewrite this whole library to meet ES6 standards.
// TODO : Create a base P5JSGame Object that handles default functionality and event creation.
export const GameSketch = (s) => {
  let width;
  let height;
  let canvas;
  let dragging = false;
  let dragStart: ClickEvent;
  let ready = false;
  let sceneTransitionManager: SceneTransitionManager;

  s.preload = () => {
    return;
  };

  s.setup = () => {
    // s.createCanvas(width, height, s.WEBGL);
    width = s.windowWidth;
    height = s.windowHeight;
    s.frameRate(30);

    const titleScene1 = new TitleScene(s);
    const titleScene2 = new OptionsScene(s);
    sceneTransitionManager = new SceneTransitionManager(s, [
      titleScene1,
      titleScene2
    ]);
    // TODO : Scene transitions need to be more 'snappy' rather than transitions.
    // TODO : Resize events don't trigger on unloaded scenes, nor on scene changes.
    titleScene1.onStartClick.on('transition', () => {
      console.log(`Title 1 Transition`);
      sceneTransitionManager.transitionToScene(1, TransitionDirectionType.RIGHT);
    });
    titleScene2.onStartClick.on('transition', () => {
      console.log(`Title 2 Transition`);
      sceneTransitionManager.transitionToScene(0, TransitionDirectionType.LEFT);
    });

    canvas = s.createCanvas(width, height, s.WEBGL);

    canvas.mouseOver(() => {
      console.log('GameManager: Mouse Over');
    });

    sceneTransitionManager.initialize();
    ready = true;

    // img = s.loadImage('../assets/CoronaMania_Vector.svg');
  };

  s.renderMouse = () => {
    s.push();
    s.translate(-width / 2, -height / 2);
    s.stroke(0);
    s.strokeWeight(10);
    s.fill(0);
    const x = s.constrain(s.mouseX, 0, width);
    const y = s.constrain(s.mouseY, 0, height);
    s.ellipse(x, y, 15, 15);
    if (dragging) {
      s.line(dragStart.x, dragStart.y, x, y);
      s.ellipse(dragStart.x, dragStart.y, 15, 15);
      // console.log(`Drawing line ${dragStart.x}, ${dragStart.y}`);
    }
    s.pop();
  };

  s.draw = () => {
    s.background(0);
    s.renderMouse();
    if (dragging) {
      const x = s.constrain(s.mouseX, 0, width);
      s.translate(x - dragStart.x, 0);
      sceneTransitionManager.handleMouseDrag(new DragMouseEvent(s, dragStart.x, dragStart.y));
    }
    sceneTransitionManager.draw();
  };

  s.mouseMoved = () => {
    if (!ready) {
      return;
    }
    sceneTransitionManager.handleHover(new ClickEvent(s));
  };

  s.mousePressed = () => {
    if (!ready) {
      return;
    }
    sceneTransitionManager.handleClick(new ClickEvent(s));
  };

  s.touchMoved = () => {
    if (!ready) {
      return;
    }
    if (!dragging) {
      dragStart = new ClickEvent(s);
    }
    dragging = true;
  };

  s.mouseReleased = () => {
    dragging = false;
  };

  s.keyTyped = () => {
    if (!ready) {
      return;
    }
    console.log(`Got Keypress ${s.key}`);
    if (s.key === '_') {
      // componentManager.enableDebugMode(true);
    } else if (s.key === '+') {
      // componentManager.enableDebugMode(false);
    }
  };

  s.windowResized = () => {
    if (!ready) {
      return;
    }
    width = s.windowWidth;
    height = s.windowHeight;

    s.resizeCanvas(width, height);
    sceneTransitionManager.handleCanvasResize(width, height);
  };
};
