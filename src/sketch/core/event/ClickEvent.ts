export class ClickEvent {
  public x;
  public y;
  public mouseButton;

  constructor(s) {
    this.x = s.constrain(Math.floor(s.mouseX), 0, s.width);
    this.y = s.constrain(Math.floor(s.mouseY), 0, s.height);
    this.mouseButton = s.mouseButton;
  }
}
