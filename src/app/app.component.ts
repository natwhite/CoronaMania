import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appWidth;
  appHeight;

  constructor() {
    this.appWidth = window.innerWidth;
    this.appHeight = window.innerHeight;
  }
}
