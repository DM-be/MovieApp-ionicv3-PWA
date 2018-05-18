import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, App } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { DbProvider } from '../../providers/db/db';
import { DiscoverPage } from '../discover/discover';
import { LoggedInTabsPage } from '../logged-in-tabs/logged-in-tabs';

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

  username: any;

  movie: any;
  IMDBId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public movieProvider: MovieProvider, public alertCtrl: AlertController
  , public dbProvider: DbProvider, public events: Events, public appCtrl:App ) {
  this.movie = this.navParams.get("movie")
  }

  ionViewDidLoad() {
    this.movieProvider.getIMDBId(this.movie.id).subscribe(id => {
      this.IMDBId = id;
    })
    
  }
  addToWatch() {
    this.dbProvider.addMovie("watch", this.movie);
  }

  addToSeen() {
    this.dbProvider.addMovie("seen", this.movie);
  }

  findSimilar() {
    this.movieProvider.resetCurrentPage();
    this.movieProvider.getSimilarMovie(this.movie.id).subscribe(similarMovies => {
      this.events.publish("similarMovies", similarMovies);
      this.navCtrl.parent.select(0);
    })
    
  }

}
