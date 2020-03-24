export class ClickEvent {
  public x;
  public y;
  public mouseButton;

  constructor(s) {
    this.x = Math.floor(s.mouseX);
    this.y = Math.floor(s.mouseY);
    this.mouseButton = s.mouseButton;
  }
}
