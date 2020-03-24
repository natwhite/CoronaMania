import {BackgroundGraphics} from './backgroundGraphics.sketch';
import {SketchComponentManager} from '../models/SketchComponentManager';
import {MainMenuSketch} from './mainMenu.sketch';
import {RotatingGraphicSketch} from './rotatingGraphic.sketch';
import {ClickEvent} from '../models/ClickEvent';

// Going to need a way to import, obj files.
export const GameSketch = (s) => {
  let width;
  let height;
  let componentManager;
  let canvas;
  let dragging = false;
  let dragStart: ClickEvent;
  let ready = false;

  s.preload = () => {
  };

  s.setup = () => {
    // s.createCanvas(width, height, s.WEBGL);
    width = s.windowWidth;
    height = s.windowHeight;
    s.frameRate(30);

    componentManager = new SketchComponentManager(s, width, height);
    componentManager.addComponents([
      BackgroundGraphics,
      // MenuController,
      RotatingGraphicSketch,
      MainMenuSketch
    ]);

    canvas = s.createCanvas(width, height, s.WEBGL);

    canvas.mouseOver(() => {
      console.log('GameManager: Mouse Over');
    });

    componentManager.initialize();
    ready = true;
  };

  s.draw = () => {
    s.push();
    s.translate(-width / 2, -height / 2);
    s.stroke(0);
    s.strokeWeight(10);
    s.fill(0);
    s.ellipse(s.mouseX, s.mouseY, 15, 15);
    if (dragging) {
      s.line(dragStart.x, dragStart.y, s.mouseX, s.mouseY);
      s.ellipse(dragStart.x, dragStart.y, 15, 15);
      // console.log(`Drawing line ${dragStart.x}, ${dragStart.y}`);
    }
    s.pop();
    if (dragging) {
      s.translate(s.mouseX - dragStart.x, 0);
    }
    componentManager.renderComponents();
    s.translate(-width, 0);
    componentManager.renderComponents();
  };

  s.mouseMoved = () => {
    if (!ready) {
      return;
    }
    componentManager.handleHover(new ClickEvent(s));
  };

  s.mousePressed = () => {
    if (!ready) {
      return;
    }
    componentManager.handleClick(new ClickEvent(s));
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
      componentManager.enableDebugMode(true);
    } else if (s.key === '+') {
      componentManager.enableDebugMode(false);
    }
  };

  s.windowResized = () => {
    if (!ready) {
      return;
    }
    width = s.windowWidth;
    height = s.windowHeight;

    s.resizeCanvas(width, height);
    componentManager.handleCanvasResize(width, height);
  };
};
