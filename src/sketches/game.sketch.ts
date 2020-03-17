import {BackgroundGraphics} from './backgroundGraphics.sketch';
import {SketchComponentManager} from '../models/SketchComponentManager';
import {MainMenuSketch} from './mainMenu.sketch';
import {RotatingGraphicSketch} from './rotatingGraphic.sketch';

// Going to need a way to import, obj files.
export const GameSketch = (s) => {
  let width;
  let height;
  let componentManager;

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

    s.createCanvas(width, height, s.WEBGL);
  };

  s.draw = () => {
    // s.scale(Math.min(width, width) / 800);
    componentManager.renderComponents();
  };


  s.windowResized = () => {
    width = s.windowWidth;
    height = s.windowHeight;

    s.resizeCanvas(width, height);
    componentManager.handleCanvasResize(width, height);
  };
};
