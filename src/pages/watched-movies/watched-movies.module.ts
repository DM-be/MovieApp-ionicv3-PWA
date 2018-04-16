import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WatchedMoviesPage } from './watched-movies';

@NgModule({
  declarations: [
    WatchedMoviesPage,
  ],
  imports: [
    IonicPageModule.forChild(WatchedMoviesPage),
  ],
})
export class WatchedMoviesPageModule {}
