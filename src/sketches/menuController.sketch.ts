import {MainMenuSketch} from './mainMenu.sketch';

export class MenuController {
  public mainMenu;

  constructor(s, width: number, height: number) {
    this.mainMenu = new MainMenuSketch(s, width, height);
  }

  public createGraphic = () => {
    this.mainMenu.createGraphic();
  };
}
