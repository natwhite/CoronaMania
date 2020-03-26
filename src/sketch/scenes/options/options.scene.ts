import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {BackgroundGraphics} from '../../global/components/backgroundGraphics.component';
import {MainMenuComponent} from '../title/components/mainMenu.component';
import {RotatingGraphicComponent} from '../title/components/rotatingGraphic.component';

export class OptionsScene extends Scene {
  public onStartClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const mainMenu = new MainMenuComponent(s, this.width, this.height);
    mainMenu.onInteraction.on('click', () => {
      console.log(`Got click from MainMenu`);
      this.onStartClick.emit('transition');
    });
    this.componentManager.addComponents([
      new BackgroundGraphics(s, this.width, this.height),
      // MenuController,
      new RotatingGraphicComponent(s, this.width, this.height),
      mainMenu
    ]);
  }
}
