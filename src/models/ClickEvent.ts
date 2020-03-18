export class ClickEvent {
  public x;
  public y;
  public mouseButton;

  constructor(s) {
    this.x = s.mouseX;
    this.y = s.mouseY;
    this.mouseButton = s.mouseButton;
  }
}
