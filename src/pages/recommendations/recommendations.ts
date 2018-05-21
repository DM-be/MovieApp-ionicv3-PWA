import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, ModalController, Platform } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { MovieDetailPage } from '../movie-detail/movie-detail';
import { Movie } from '../../model/movie';
import { RecommendPage } from '../recommend/recommend';

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

  private recommendPage = RecommendPage;
  private recommendations: Movie [];
  private movieDetailPage = MovieDetailPage;
  private seenMovies: Movie [];
  private watchedMovies: Movie [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, public events: Events,
  public toastCtrl: ToastController, public modalCtrl: ModalController, public platform: Platform) {
    this.setup();
    this.events.subscribe("movie:recommended", () => {
      this.setup();
    }) 
  }

  async setup() {
    let user = this.dbProvider.getUser();
    this.recommendations = await this.dbProvider.getRecommendations();
    
  }

  setSmallIcons(): boolean {
    return this.platform.width() < 500;
  }

  ionViewWillEnter() {
    this.watchedMovies = this.dbProvider.getMovies("watch");
    this.seenMovies = this.dbProvider.getMovies("seen");
    this.setup();
    
  }

  openMovieDetail(i) {
    let movie = this.recommendations[i];
      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );
  }

  isInWatched(movie: Movie): boolean {
    if (this.watchedMovies !== undefined) {
      return (this.watchedMovies.findIndex(i => i.title === movie.title) > -1)
    }
  }
  isInSeen(movie: Movie): boolean {
    if (this.seenMovies !== undefined) {
      return (this.seenMovies.findIndex(i => i.title === movie.title) > -1)
    }
  }

  presentToast(movieTitle: string, typeOfList: string): void {
    let toast = this.toastCtrl.create({
      message: `${movieTitle} was added to your ${typeOfList}list`,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

   addToWatch(event, movie): void {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    this.dbProvider.addMovie("watch", movie);
    this.presentToast(movie.title, "watch");
  }

  addToSeen(event, movie): void {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    this.dbProvider.addMovie("seen", movie);
    this.presentToast(movie.title, "seen");
  }

  openRecommendMovie(movie): void {
    let recommendModal = this.modalCtrl.create(RecommendPage, {
      "movieToRecommend": movie
    });
    recommendModal.present();
  }

}
