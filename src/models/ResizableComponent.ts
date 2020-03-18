export abstract class ResizableComponent {
  width: number;
  height: number;

  protected onResize?: (width: number, height: number) => void;

  handleResize = (width: number, height: number) => {
    this.width = width;
    this.height = height;

    if (this.onResize) {
      this.onResize(this.width, this.height);
    }
  };
}
