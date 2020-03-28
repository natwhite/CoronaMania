import {EventEmitter} from 'events';
import {Scene} from '../../core/Scene';
import {BackButtonComponent} from './components/backButton.component';
import {LevelSelectTitleComponent} from './components/levelSelectTitle.component';

export class LevelSelectScene extends Scene {
  public onClick: EventEmitter = new EventEmitter();

  constructor(s) {
    super(s);
    const backButtonComponent = new BackButtonComponent(s, this.width, this.height);
    backButtonComponent.onInteraction.on('click', () => {
      console.log(`Got click from backButton`);
      this.onClick.emit('transition');
    });
    this.componentManager.addComponents([
      new LevelSelectTitleComponent(s, this.width, this.height),
      backButtonComponent
    ]);
  }
}
