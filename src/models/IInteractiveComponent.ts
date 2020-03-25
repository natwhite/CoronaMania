import {ClickEvent} from './ClickEvent';
import {DragMouseEvent} from './DragMouseEvent';

export interface IInteractiveComponent {
  registerBounds(s): any;

  onClick(clickEvent: ClickEvent);

  onMouseDrag(dragEvent: DragMouseEvent);

  onHover();

  onHoverLost();
}
