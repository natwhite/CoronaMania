import {ClickEvent} from './ClickEvent';

export interface InteractiveComponent {
  boundsUpdated: boolean;

  registerBounds(s): any;

  onClick(clickEvent: ClickEvent);

  onHover();

  onHoverLost();
}
