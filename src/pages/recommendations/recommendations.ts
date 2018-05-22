import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, ModalController, Platform } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { MovieDetailPage } from '../movie-detail/movie-detail';
import { Movie } from '../../model/movie';
import { RecommendPage } from '../recommend/recommend';
import { FilterProvider } from '../../providers/filter/filter';

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


  private recommendations: Movie [];
  private movieDetailPage = MovieDetailPage;
  private seenMovies: Movie [];
  private watchedMovies: Movie [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider,
  public toastCtrl: ToastController, public modalCtrl: ModalController, public platform: Platform, public events: Events, public filterProvider: FilterProvider) {
    
  }

  setSmallIcons(): boolean {
    return this.platform.width() < 500;
  }

  ionViewDidLoad() {
    this.events.subscribe("recommendations:updated", async (searchTerm) => {
      this.recommendations = this.dbProvider.getMovies("recommendations");
      this.recommendations = this.filterProvider.filterBySearchTerm(this.recommendations, searchTerm);
    })
    this.events.subscribe("recommendations:empty", async () => {
      this.recommendations = this.dbProvider.getMovies("recommendations");
    })
    this.events.subscribe("movie:recievedRecommendation", async movie => {
      let toast = this.toastCtrl.create({
        message: `${movie.title} was recommended to you by ${movie.recommendedBy.username}`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.recommendations = await this.dbProvider.getRecommendations();
    })
  }

  async ionViewWillEnter() {
    this.watchedMovies = this.dbProvider.getMovies("watch");
    this.seenMovies = this.dbProvider.getMovies("seen");
    this.recommendations = this.dbProvider.getMovies("recommendations");
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
