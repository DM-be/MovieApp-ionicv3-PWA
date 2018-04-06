import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';

/**
 * Generated class for the MovieDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-movie-detail',
  templateUrl: 'movie-detail.html',
})
export class MovieDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public movieProvider: MovieProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovieDetailPage');
    let movie = this.navParams.get("movie")
    console.log(movie)
    this.movieProvider.addMovie("seen", movie)
    this.movieProvider.getMovies("seen").then(
      data => console.log(data)
    )
    
  }

}
