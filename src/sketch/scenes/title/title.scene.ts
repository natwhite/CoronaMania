import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {BackgroundGraphics} from '../../global/components/backgroundGraphics.component';
import {LogoComponent} from './components/logo.component';
import {RotatingGraphicComponent} from './components/rotatingGraphic.component';
import {StartButtonComponent} from './components/startButton.component';

export class TitleScene extends Scene {
  public onStartClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const startButton = new StartButtonComponent(s, this.width, this.height);
    startButton.onInteraction.on('click', () => {
      console.log(`Got click from startButton`);
      this.onStartClick.emit('transition');
    });
    this.componentManager.addComponents([
      new BackgroundGraphics(s, this.width, this.height),
      // MenuController,
      new RotatingGraphicComponent(s, this.width, this.height),
      new LogoComponent(s, this.width, this.height),
      startButton
    ]);
  }
}
