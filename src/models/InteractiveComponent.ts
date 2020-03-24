import {ClickEvent} from './ClickEvent';

export interface InteractiveComponent {
  registerBounds(s): any;

  onClick(clickEvent: ClickEvent);

  onHover();

  onHoverLost();
}
