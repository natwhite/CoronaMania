import {SketchComponent} from '../../core/SketchComponent';

interface IBackgroundRay {
  color: [number, number, number];
  rotation: number;
  step: number;
}

export class BackgroundGraphics extends SketchComponent {
  public rays: IBackgroundRay[];

  public rayColors: Array<[number, number, number]> = [
    [171, 68, 247],
    [7, 156, 255],
    [18, 248, 245],
    [216, 253, 25],
    [246, 206, 10],
    [247, 23, 0],
  ];
  public rayRotationAcceleration = -0.0003;
  public rayLength;
  public rayWidth = 100;

  constructor(s, width, height) {
    super(s, width, height);
    this.rays = [];
    let lastRotation = 0;

    for (const rayCol of this.rayColors) {
      this.rays.push({color: rayCol, rotation: 45, step: lastRotation += this.rayRotationAcceleration});
    }

    this.rayLength = Math.max(this.width, this.height) * 1.4;
  }

  public createGraphic = () => {
    this.renderer.translate(this.width / 2, this.height / 2);
    this.renderer.background(50, 348, 255);
    this.renderer.noStroke();
    this.renderer.rectMode(this.renderer.CENTER);
    for (const ray of this.rays) {
      this.renderer.push();
      this.renderer.fill(ray.color);
      this.renderer.rotate(ray.rotation += ray.step);
      this.renderer.rect(0, 0, this.rayLength, this.rayWidth);
      this.renderer.pop();
    }
  };

  public onResize = (width, height) => {
    this.rayLength = Math.max(width, height) * 1.4;
  };
}
