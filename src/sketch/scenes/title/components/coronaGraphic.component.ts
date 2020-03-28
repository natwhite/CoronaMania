import {SketchComponent} from '../../../core/SketchComponent';

export class CoronaGraphicComponent extends SketchComponent {
  private image: any;
  private rotation: number;
  private rotationSpeed: number;

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.image = this.s.loadImage('../../../../assets/SARS-CoV-2_without_background.png');
    this.rotation = 0;
    this.rotationSpeed = 0.006;
  }

  public createGraphic = () => {
    this.renderer.push();
    this.renderer.translate(this.width * 0.5, this.height * 0.5);
    this.renderer.rotate(this.rotation += this.rotationSpeed);
    this.renderer.imageMode(this.renderer.CENTER);
    this.renderer.image(this.image, 0, 0, 400, 400);
    this.renderer.pop();
  };
}
