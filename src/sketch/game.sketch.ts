import {ClickEvent} from './core/event/ClickEvent';
import {DragMouseEvent} from './core/event/DragMouseEvent';
import {SceneTransitionManager, TransitionDirectionType} from './core/SceneTransitionManager';
import {BackgroundGraphics} from './global/components/backgroundGraphics.component';
import {LevelSelectScene} from './scenes/levelSelect/levelSelect.scene';
import {OptionsScene} from './scenes/options/options.scene';
import {RewardsScene} from './scenes/rewards/rewards.scene';
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
  let scale = 1;

  s.preload = () => {
    console.log(`Width : ${s.windowWidth}`);
    scale = s.windowWidth / 1000;
    return;
  };

  s.setup = () => {
    // s.createCanvas(width, height, s.WEBGL);
    console.log(`Scale : ${scale}`);
    width = Math.floor(s.windowWidth / scale);
    height = Math.floor(s.windowHeight / scale);
    s.frameRate(30);

    const title = new TitleScene(s, width, height);
    const options = new OptionsScene(s, width, height);
    const rewards = new RewardsScene(s, width, height);
    const levelSelect = new LevelSelectScene(s, width, height);

    sceneTransitionManager = new SceneTransitionManager(s, [
        title,
        options,
        rewards,
        levelSelect
      ],
      width,
      height
    );
    sceneTransitionManager.setTransitionOnDrag(0, 1, TransitionDirectionType.LEFT);
    sceneTransitionManager.setTransitionOnDrag(1, 0, TransitionDirectionType.RIGHT);

    sceneTransitionManager.setTransitionOnDrag(0, 2, TransitionDirectionType.RIGHT);
    sceneTransitionManager.setTransitionOnDrag(2, 0, TransitionDirectionType.LEFT);
    // TODO : Scene transitions need to be more 'snappy' rather than transitions.
    // TODO : Resize events don't trigger on unloaded scenes, nor on scene changes.
    title.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(3, TransitionDirectionType.DOWN);
    });
    options.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(0, TransitionDirectionType.RIGHT);
    });
    rewards.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(0, TransitionDirectionType.LEFT);
    });
    levelSelect.onClick.on('transition', () => {
      sceneTransitionManager.transitionToScene(0, TransitionDirectionType.UP);
    });

    canvas = s.createCanvas(width, height, s.WEBGL);

    canvas.mouseOver(() => {
      console.log('GameManager: Mouse Over');
    });

    backgroundGraphics = new BackgroundGraphics(s, width, height);

    s.resizeCanvas(s.windowWidth, s.windowHeight, false);
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
    const mouse = new ClickEvent(s, width, height, scale);
    s.ellipse(mouse.x, mouse.y, 15, 15);
    if (dragging) {
      s.line(dragStart.x, dragStart.y, mouse.x, mouse.y);
      s.ellipse(dragStart.x, dragStart.y, 15, 15);
      // console.log(`Drawing line ${dragStart.x}, ${dragStart.y}`);
    }
    s.pop();
  };

  s.draw = () => {
    s.scale(scale);
    s.background(0);
    backgroundGraphics.render();
    s.renderMouse();
    if (dragging) {
      const dragMouseEvent = new DragMouseEvent(s, dragStart.x, dragStart.y, width, height, scale);
      if (Math.abs(dragMouseEvent.deltaX) + Math.abs(dragMouseEvent.deltaY) > 10) {
        sceneTransitionManager.handleMouseDrag(dragMouseEvent);
      }
    }
    sceneTransitionManager.draw();
  };

  s.mouseMoved = () => {
    if (!ready) {
      return;
    }
    sceneTransitionManager.handleHover(new ClickEvent(s, width, height, scale));
  };

  s.mousePressed = () => {
    if (!ready) {
      return;
    }
    sceneTransitionManager.handleClick(new ClickEvent(s, width, height, scale));
  };

  s.touchStarted = () => {
    if (!ready) {
      return;
    }
    sceneTransitionManager.handleClick(new ClickEvent(s, width, height, scale));
  };

  s.touchMoved = () => {
    if (!ready) {
      return;
    }
    if (!dragging) {
      dragStart = new ClickEvent(s, width, height, scale);
    }
    dragging = true;
  };

  s.mouseReleased = () => {
    dragging = false;
    sceneTransitionManager.handleMouseRelease(new ClickEvent(s, width, height, scale));
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
    // width = s.windowWidth;
    // height = s.windowHeight;
    s.resizeCanvas(s.windowWidth, s.windowHeight);

    width = Math.floor(s.windowWidth / scale);
    height = Math.floor(s.windowHeight / scale);
    backgroundGraphics.handleResize(width, height);
    sceneTransitionManager.handleCanvasResize(width, height);
  };
};
