import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { MovieDetailPage } from '../movie-detail/movie-detail';

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

  movieDetailPage = MovieDetailPage
  movies: any;
  seenMovies: any;
  watchedMovies: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider) {
  this.setup(); // its in here so that we get the movies propertie in the provider populated
  // we need this to disable buttons already in seen / watch lists 
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WatchedMoviesPage');
    
  }

  // ionViewWillEnter() {
  //   this.setup();
  // }

  async setup() {
    this.movies = await this.dbProvider.getMovies_async("watch")
    console.log(this.movies)
  }

  openMovieDetail(i) {
    let movie = this.movies[i];
      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );

  }

}
