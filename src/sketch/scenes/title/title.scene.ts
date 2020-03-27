import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {LogoComponent} from './components/logo.component';
import {RotatingGraphicComponent} from './components/rotatingGraphic.component';
import {StartButtonComponent} from './components/startButton.component';

export class TitleScene extends Scene {
  public onClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const startButton = new StartButtonComponent(s, this.width, this.height);
    startButton.onInteraction.on('click', () => {
      console.log(`Got click from startButton`);
      this.onClick.emit('transition');
    });

    this.componentManager.addComponents([
      new RotatingGraphicComponent(s, this.width, this.height),
      new LogoComponent(s, this.width, this.height),
      startButton
    ]);
  }
}
