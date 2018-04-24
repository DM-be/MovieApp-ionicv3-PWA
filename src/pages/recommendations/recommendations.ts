import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { MovieDetailPage } from '../movie-detail/movie-detail';

/**
 * Generated class for the RecommendationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recommendations',
  templateUrl: 'recommendations.html',
})
export class RecommendationsPage {

  recommendations = [];
  movieDetailPage = MovieDetailPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, public events: Events) {
    this.setup();
    this.events.subscribe("data:changed", () => {
      this.setup();
    })
    
  }

  ionViewDidLoad() {
  }

  async setup() {
    let user = this.dbProvider.getUser();
    this.recommendations = await this.dbProvider.getRecommendations(user);
  }

  openMovieDetail(i) {
    let movie = this.recommendations[i];
      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );
  }


}
