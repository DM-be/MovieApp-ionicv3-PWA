import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import {
  DbProvider
} from '../../providers/db/db';
import {
  MovieDetailPage
} from '../movie-detail/movie-detail';
import { Movie } from '../../model/movie';

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

  private movieDetailPage = MovieDetailPage
  private movies: Movie [];
  private seenMovies: any;
  private watchedMovies: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider) {}
  ionViewWillEnter() {
    this.movies = this.dbProvider.getMovies("watch")
  }

  async setup() {
    // this.movies = await this.dbProvider.getMovies_async("watch")
    let users = await this.dbProvider.getAllUsers();
    console.log(users)
  }

  openMovieDetail(i) {
    let movie = this.movies[i];
    this.navCtrl.push(this.movieDetailPage, {
      movie: movie
    });
  }

  
}
