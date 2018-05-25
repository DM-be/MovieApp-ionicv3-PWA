import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController,
  ModalController,
  Events,
  Content
} from 'ionic-angular';
import {
  MovieProvider
} from '../../providers/movie/movie';
import {
  Platform
} from 'ionic-angular/platform/platform';

import {
  DbProvider
} from '../../providers/db/db';
import {
  MovieDetailPage
} from '../movie-detail/movie-detail';
import {
  Movie
} from '../../model/movie';
import {
  RecommendPage
} from '../recommend/recommend';
import {
  FilterProvider
} from '../../providers/filter/filter';
import {
  ToastProvider
} from '../../providers/toast/toast';



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
  public movies: Movie[];
  public watchedMovies: Movie[];
  public movieDetailPage = MovieDetailPage;
  public recommendPage = RecommendPage;
  private movieCounter: number;
  public moviesInView: Movie[];
  public filtered: boolean = false;
  public filteredMovies: any;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    public dbProvider: DbProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public events: Events,
    public filterProvider: FilterProvider,
    public toastProvider: ToastProvider,
  ) {
    this.movieCounter = 20;
    this.movies = this.dbProvider.getMovies("seen");
    this.filteredMovies = [];

  }

  ionViewDidLoad() {
    this.moviesInView = this.dbProvider.getMoviesInView("seen");
    this.events.subscribe("seen:updated", (searchTerm) => {
      this.movies = this.dbProvider.getMovies("seen");
      this.filteredMovies = this.filterProvider.filterBySearchTerm(this.movies, searchTerm);
      this.resetMoviesInView(this.filteredMovies);
      this.content.scrollToTop(0);
      this.filtered = true;
    })
    this.events.subscribe("seen:empty", () => {
      this.movies = this.dbProvider.getMovies("seen");
      this.resetMoviesInView();
      this.content.scrollToTop(0);
      this.filtered = false;
    })
    this.events.subscribe("selected:clicked", () => {
      this.content.scrollToTop(0);
      this.moviesInView = this.dbProvider.getMoviesInView("seen");
      this.filtered = false;
    })
  }
  setSmallIcons(): boolean {
    return this.platform.width() < 500;
  }
  
  resetMoviesInView(movies ? : Movie[]) {

    this.dbProvider.setCounter("seen", 20);
    if (movies) {
      this.dbProvider.setMoviesInView("seen", movies);
    } else {
      this.dbProvider.setMoviesInView("seen");
    }

    this.moviesInView = this.dbProvider.getMoviesInView("seen");
  }
  ionViewDidEnter() {
    this.movies = this.dbProvider.getMovies("seen");
    this.watchedMovies = this.dbProvider.getMovies("watch");
  }

  openMovieDetail(movie: Movie): void {
    this.navCtrl.push(this.movieDetailPage, {
      "movie": movie
    });
  }
  isInWatched(movie: Movie): boolean {
    if (this.watchedMovies !== undefined) {
      return (this.watchedMovies.findIndex(i => i.id === movie.id) > -1)
    }
  }

  addToWatch(event, movie): void {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    this.dbProvider.addMovie("watch", movie);
    this.toastProvider.addToastToQueue(movie.title, "watch");
  }

  async removeMovie(movie: Movie) {
    await this.dbProvider.removeMovie("seen", movie);
    this.dbProvider.setMoviesInView("seen");
    this.moviesInView = this.dbProvider.getMoviesInView("seen");

  }

  openRecommendMovie(movie): void {
    let recommendModal = this.modalCtrl.create(RecommendPage, {
      "movieToRecommend": movie
    });
    recommendModal.present();
  }
  showNextMoviePage() {
    let currentCounter = this.dbProvider.getCounter("seen");
    currentCounter += 20;
    this.dbProvider.setCounter("seen", currentCounter);
    if (this.filtered) {
      this.dbProvider.setMoviesInView("seen", this.filteredMovies);
    } else {
      this.dbProvider.setMoviesInView("seen");
    }
    this.moviesInView = this.dbProvider.getMoviesInView("seen");
  }

  showNextMovies(event): void {
    this.showNextMoviePage();
    event.complete();
  }


}
