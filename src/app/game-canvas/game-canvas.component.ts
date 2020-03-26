import {Component, Input, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {GameSketch} from '../../sketch/game.sketch';

@Component({
  selector: 'app-game-canvas',
  template: '',
  styles: []
})
export class GameCanvasComponent implements OnInit {

  @Input() width = 800;
  @Input() height = 800;
  @Input() scaling = 1;

  canvas;

  constructor() {
  }

  ngOnInit() {
    // this.canvas = new p5(GameSketch(this.width, this.height, this.scaling));
    this.canvas = new p5(GameSketch);
    // window.onresize = this.resizeCanvas;
  }

  // resizeCanvas() {
  //   // this.canvas.
  // }
}
