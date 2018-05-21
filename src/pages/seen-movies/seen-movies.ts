import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController,
  ModalController,
  Events
} from 'ionic-angular';
import {
  MovieProvider
} from '../../providers/movie/movie';
import {
  Platform
} from 'ionic-angular/platform/platform';
import {
  Content
} from 'ionic-angular';
import {
  SuperTabs
} from 'ionic2-super-tabs';
import {
  FormControl
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
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
 * Generated class for the SeenMoviesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-seen-movies',
  templateUrl: 'seen-movies.html',
})
export class SeenMoviesPage {
  private movies: Movie [];
  private watchedMovies: Movie [];
  private movieDetailPage = MovieDetailPage;
  private recommendPage = RecommendPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    public dbProvider: DbProvider,
    public toastCtrl: ToastController,
    public  modalCtrl: ModalController,
    public events: Events,
    public filterProvider: FilterProvider
  ) {}

  ionViewDidLoad() {
    this.events.subscribe("seen:updated", (searchTerm) => {
      this.movies = this.dbProvider.getMovies("seen");
      this.movies = this.filterProvider.filterBySearchTerm(this.movies, searchTerm);
    })
    this.events.subscribe("seen:empty", () => {
      this.movies = this.dbProvider.getMovies("seen");
    })
  }

  ionViewWillEnter() {
    this.movies = this.dbProvider.getMovies("seen");
    this.watchedMovies = this.dbProvider.getMovies("watch");
  }
  openMovieDetail(i) {
    let movie = this.movies[i];
    this.navCtrl.push(this.movieDetailPage, {
      "movie": movie
    });
  }
  isInWatched(movie: Movie): boolean {
    if (this.watchedMovies !== undefined) {
      return (this.watchedMovies.findIndex(i => i.id === movie.id) > -1)
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

  removeMovie(movie)
  {
    this.dbProvider.removeMovie("seen", movie);
    this.movies = this.dbProvider.getMovies("seen");
  }

  openRecommendMovie(movie): void {
    let recommendModal = this.modalCtrl.create(RecommendPage, {
      "movieToRecommend": movie
    });
    recommendModal.present();
  }

}

