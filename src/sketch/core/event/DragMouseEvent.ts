export class DragMouseEvent {
  public x1;
  public x2;
  public deltaX;
  public y1;
  public y2;
  public deltaY;

  constructor(s, x1, y1, width?: number, height?: number, scale: number = 1) {
    this.x1 = x1;
    this.y1 = y1;
    width = width ? width : s.windowWidth;
    height = height ? height : s.windowHeight;
    this.x2 = s.constrain(Math.floor(s.mouseX / scale), 0, width);
    this.y2 = s.constrain(Math.floor(s.mouseY / scale), 0, height);
    this.deltaX = this.x2 - this.x1;
    this.deltaY = this.y2 - this.y1;
  }
}
