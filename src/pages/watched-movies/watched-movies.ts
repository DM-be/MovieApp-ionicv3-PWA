import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  ToastController,
  ModalController
} from 'ionic-angular';
import {
  DbProvider
} from '../../providers/db/db';
import {
  MovieDetailPage
} from '../movie-detail/movie-detail';
import { Movie } from '../../model/movie';
import { RecommendPage } from '../recommend/recommend';
import { FilterProvider } from '../../providers/filter/filter';

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

  public movieDetailPage = MovieDetailPage;
  public recommendPage = RecommendPage;
  public movies: Movie [];
  public seenMovies: Movie [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, public toastCtrl: ToastController,
  public modalCtrl: ModalController, public filterProvider: FilterProvider, public events: Events) {}
  ionViewWillEnter() {
    this.movies = this.dbProvider.getMovies("watch");
    this.seenMovies = this.dbProvider.getMovies("seen");
  }

  ionViewDidLoad() {
    this.events.subscribe("watch:updated", (searchTerm) => {
      this.movies = this.dbProvider.getMovies("watch");
      this.movies = this.filterProvider.filterBySearchTerm(this.movies, searchTerm);
    })
    this.events.subscribe("watch:empty", () => {
      this.movies = this.dbProvider.getMovies("watch");
    })
  }

  openMovieDetail(i: number): void {
    let movie = this.movies[i];
    this.navCtrl.push(this.movieDetailPage, {
      movie: movie
    });
  }

  presentToast(movieTitle: string, typeOfList: string): void {
    let toast = this.toastCtrl.create({
      message: `${movieTitle} was added to your ${typeOfList}list`,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  addToSeen(event: any, movie: Movie): void {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    this.dbProvider.addMovie("seen", movie);
    this.presentToast(movie.title, "seen");
  }

  isInSeen(movie: Movie): boolean {
    if (this.seenMovies !== undefined) {
      return (this.seenMovies.findIndex(i => i.id === movie.id) > -1)
    }
  }

  openRecommendMovie(movie: Movie): void {
    let recommendModal = this.modalCtrl.create(RecommendPage, {
      "movieToRecommend": movie
    });
    recommendModal.present();
  }

  removeMovie(movie: Movie): void
  {
    this.dbProvider.removeMovie("watch", movie);
    this.movies = this.dbProvider.getMovies("watch");
  }

}
