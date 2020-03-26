import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {BackgroundGraphics} from '../../global/components/backgroundGraphics.component';
import {LogoComponent} from '../title/components/logo.component';
import {RotatingGraphicComponent} from '../title/components/rotatingGraphic.component';
import {StartButtonComponent} from '../title/components/startButton.component';

export class OptionsScene extends Scene {
  public onStartClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const startButtonComponent = new StartButtonComponent(s, this.width, this.height);
    startButtonComponent.onInteraction.on('click', () => {
      console.log(`Got click from MainMenu`);
      this.onStartClick.emit('transition');
    });
    this.componentManager.addComponents([
      new BackgroundGraphics(s, this.width, this.height),
      // MenuController,
      new RotatingGraphicComponent(s, this.width, this.height),
      new LogoComponent(s, this.width, this.height),
      startButtonComponent
    ]);
  }
}
