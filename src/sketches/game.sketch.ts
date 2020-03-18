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

  s.preload = () => {
  };

  s.setup = () => {
    // s.createCanvas(width, height, s.WEBGL);
    width = s.windowWidth;
    height = s.windowHeight;

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
  };

  s.draw = () => {
    // s.scale(Math.min(width, width) / 800);
    componentManager.renderComponents();
    componentManager.handleHover(new ClickEvent(s));
    // componentManager.debugHitBoxes();


    // s.push();
    // s.noStroke();
    // s.fill(255);
    // s.rect(-100, -100, 100, 100);
    // s.blendMode(s.REMOVE);
    // s.fill(0, 0, 0, 255);
    // s.rect(-50, -50, 50, 50);
    // s.blendMode(s.ADD);
    // s.pop();
  };

  s.mousePressed = () => {
    // console.log('Got mouse Press');
    componentManager.handleClick(new ClickEvent(s));
  };

  s.windowResized = () => {
    width = s.windowWidth;
    height = s.windowHeight;

    s.resizeCanvas(width, height);
    componentManager.handleCanvasResize(width, height);
  };
};
