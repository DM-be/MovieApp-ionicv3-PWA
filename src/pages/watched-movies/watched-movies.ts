import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, public events: Events) {
 // this.setup(); // its in here so that we get the movies propertie in the provider populated
  // we need this to disable buttons already in seen / watch lists 
  
 // this.setup();
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WatchedMoviesPage');
    
    
  }

   ionViewWillEnter() {
  //  this.setup();
  this.movies = this.dbProvider.getMovies("watch")
  console.log(this.movies)
   }

  async setup() {
   // this.movies = await this.dbProvider.getMovies_async("watch")
    let users = await this.dbProvider.getAllUsers();
    console.log(users)
  }

  openMovieDetail(i) {
    let movie = this.movies[i];
      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );

  }

}
