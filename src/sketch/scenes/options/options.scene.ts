import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {BackgroundGraphics} from '../../global/components/backgroundGraphics.component';
import {LogoComponent} from '../title/components/logo.component';
import {RotatingGraphicComponent} from '../title/components/rotatingGraphic.component';
import {BackButtonComponent} from './components/backButton.component';
import {OptionsTitleComponent} from './components/optionsTitle.component';

export class OptionsScene extends Scene {
  public onStartClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const backButtonComponent = new BackButtonComponent(s, this.width, this.height);
    backButtonComponent.onInteraction.on('click', () => {
      console.log(`Got click from backButton`);
      this.onStartClick.emit('transition');
    });
    this.componentManager.addComponents([
      new BackgroundGraphics(s, this.width, this.height),
      new RotatingGraphicComponent(s, this.width, this.height),
      new OptionsTitleComponent(s, this.width, this.height),
      new LogoComponent(s, this.width, this.height),
      backButtonComponent
    ]);
  }
}
