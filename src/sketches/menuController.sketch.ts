import {MainMenuSketch} from './mainMenu.sketch';

export class MenuController {
  mainMenu;

  constructor(s, width: number, height: number) {
    this.mainMenu = new MainMenuSketch(s, width, height);
  }

  createGraphic = () => {
    this.mainMenu.createGraphic();
  };
}
