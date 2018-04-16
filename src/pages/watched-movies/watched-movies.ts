import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the WatchedMoviesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-watched-movies',
  templateUrl: 'watched-movies.html',
})
export class WatchedMoviesPage {

  movies: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WatchedMoviesPage');
    
  }

  ionViewWillEnter() {
    this.setup();
  }

  async setup() {
    this.movies = await this.dbProvider.getMovies_async("watch")
  }

}
