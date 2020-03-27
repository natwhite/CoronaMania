import {EventEmitter} from 'events';
import {SketchComponent} from '../../../core/SketchComponent';

export class CreditsComponent extends SketchComponent {
  public onInteraction: EventEmitter = new EventEmitter();
  private readonly title = 'Credits';
  private readonly people: Array<{ name: string, title: string }> = [
    {name: 'Person 1', title: 'Good person'},
    {name: 'Person 2', title: 'Good person'},
    {name: 'Person 3', title: 'Good person'},
    {name: 'Person 4', title: 'Good person'},
  ];
  private readonly font;
  private readonly titleFontSize = 80;
  private readonly fontSize = 50;

  constructor(s, w, h) {
    super(s, w, h, true, s.P2D);

    this.font = s.loadFont('../assets/NanotechLlc-ed2B.otf');
    this.renderer.textFont(this.font, 100);
  }

  public createGraphic = () => {
    this.renderer.push();
    this.renderer.translate(this.width / 2, this.height * 0.45);
    this.renderer.textAlign(this.renderer.CENTER);
    this.renderer.rectMode(this.renderer.CENTER);
    this.renderer.noStroke();
    this.renderer.textSize(this.titleFontSize);
    this.renderer.fill(0);
    this.renderer.strokeWeight(4);
    // this.renderer.stroke(this.outlineColor);
    this.renderer.text(this.title, 0, 0);
    this.renderer.translate(0, this.fontSize * 2);
    this.renderer.textSize(this.fontSize);
    for (const person of this.people) {
      this.renderer.text(`${person.name} : ${person.title}`, 0, 0);
      this.renderer.translate(0, this.fontSize * 1.2);
    }
    this.renderer.pop();
  };
}
