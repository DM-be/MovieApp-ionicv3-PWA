import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeenMoviesPage } from './seen-movies';

@NgModule({
  declarations: [
    SeenMoviesPage,
  ],
  imports: [
    IonicPageModule.forChild(SeenMoviesPage),
  ],
})
export class SeenMoviesPageModule {}
