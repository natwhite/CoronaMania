export class ClickEvent {
  public x;
  public y;
  public mouseButton;

  constructor(s, width?: number, height?: number, scale: number = 1) {
    this.x = s.constrain(Math.floor(s.mouseX / scale), 0, width);
    this.y = s.constrain(Math.floor(s.mouseY / scale), 0, height);
    this.mouseButton = s.mouseButton;
  }
}
