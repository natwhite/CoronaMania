import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GameCanvasComponent} from './game-canvas/game-canvas.component';
import {FlickityModule} from 'ngx-flickity';

@NgModule({
  declarations: [
    AppComponent,
    GameCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlickityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
