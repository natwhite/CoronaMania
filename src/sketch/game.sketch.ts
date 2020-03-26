import {ClickEvent} from './core/event/ClickEvent';
import {DragMouseEvent} from './core/event/DragMouseEvent';
import {SceneTransitionManager, TransitionDirectionType} from './core/SceneTransitionManager';
import {BackgroundGraphics} from './global/components/backgroundGraphics.component';
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
  let backgroundGraphics;

  s.preload = () => {
    return;
  };

  s.setup = () => {
    // s.createCanvas(width, height, s.WEBGL);
    width = s.windowWidth;
    height = s.windowHeight;
    s.frameRate(30);

    const title = new TitleScene(s);
    const options = new OptionsScene(s);

    sceneTransitionManager = new SceneTransitionManager(s, [
      title,
      options
    ]);
    sceneTransitionManager.setTransitionOnDrag(0, 1, TransitionDirectionType.RIGHT);
    // TODO : Scene transitions need to be more 'snappy' rather than transitions.
    // TODO : Resize events don't trigger on unloaded scenes, nor on scene changes.
    title.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(1, TransitionDirectionType.LEFT);
    });
    options.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(0, TransitionDirectionType.RIGHT);
    });

    canvas = s.createCanvas(width, height, s.WEBGL);

    canvas.mouseOver(() => {
      console.log('GameManager: Mouse Over');
    });

    backgroundGraphics = new BackgroundGraphics(s, width, height);

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
    backgroundGraphics.render();
    s.renderMouse();
    if (dragging) {
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
    backgroundGraphics.handleResize(width, height);
    sceneTransitionManager.handleCanvasResize(width, height);
  };
};
