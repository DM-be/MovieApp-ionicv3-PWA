import { ToastProvider } from './../../providers/toast/toast';
import {
  Component, ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  ToastController,
  ModalController,
  Content
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

@Component({
  selector: 'page-watched-movies',
  templateUrl: 'watched-movies.html',
})
export class WatchedMoviesPage {

  public movieDetailPage = MovieDetailPage;
  public recommendPage = RecommendPage;
  public movies: Movie [];
  public seenMovies: Movie [];
  private movieCounter: number;
  public moviesInView: Movie [];
  public filtered: boolean = false;
  public filteredMovies: any;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, public toastCtrl: ToastController,
  public modalCtrl: ModalController, public filterProvider: FilterProvider, public events: Events, public toastProvider: ToastProvider) {}
  ionViewWillEnter() {
    this.movies = this.dbProvider.getMovies("watch");
    this.movieCounter = 20;
    this.filteredMovies = [];
    this.seenMovies = this.dbProvider.getMovies("seen");
  }

  ionViewDidLoad() {
    this.moviesInView = this.dbProvider.getMoviesInView("watch");

    this.events.subscribe("watch:updated", (searchTerm) => {
      this.movies = this.dbProvider.getMovies("watch");
      this.filteredMovies = this.filterProvider.filterBySearchTerm(this.movies, searchTerm);
      this.resetMoviesInView(this.filteredMovies);
      this.content.scrollToTop(0);
      this.filtered = true;
    })
    this.events.subscribe("watch:empty", () => {
      this.movies = this.dbProvider.getMovies("watch");
      this.resetMoviesInView();
      this.content.scrollToTop(0);
      this.filtered = false;
    })
    this.events.subscribe("watch:clicked", () => {
      this.content.scrollToTop(0);
      this.moviesInView =  this.dbProvider.getMoviesInView("watch");
      this.filtered = false;
    })
  }
  
  resetMoviesInView(movies?: Movie []) {
    
    this.dbProvider.setCounter("watch", 20);
    if(movies)
    {
      this.dbProvider.setMoviesInView("watch", movies);
    }
    else {
      this.dbProvider.setMoviesInView("watch");
    }
    
    this.moviesInView = this.dbProvider.getMoviesInView("watch");
  }

  ionViewDidEnter(){
    this.movies = this.dbProvider.getMovies("watch");
    this.seenMovies = this.dbProvider.getMovies("seen");
   }

  openMovieDetail(movie: Movie): void {
    this.navCtrl.push(this.movieDetailPage, {
      "movie": movie
    });
  }

  addToSeen(event: any, movie: Movie): void {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    this.dbProvider.addMovie("seen", movie);
    this.toastProvider.addToastToQueue(movie.title, "seen");
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

  async removeMovie(movie: Movie)
  {
    await this.dbProvider.removeMovie("watch", movie);
    this.dbProvider.setMoviesInView("watch");
    this.moviesInView = this.dbProvider.getMoviesInView("watch");
  }

  showNextMoviePage() {
    let currentCounter = this.dbProvider.getCounter("watch");
    currentCounter += 20;
    this.dbProvider.setCounter("watch", currentCounter);
    if(this.filtered)
    {
      this.dbProvider.setMoviesInView("watch", this.filteredMovies);
    }
    else{
      this.dbProvider.setMoviesInView("watch");
    }
    this.moviesInView = this.dbProvider.getMoviesInView("watch");
  }

  showNextMovies(event): void {
    this.showNextMoviePage();
    event.complete();
  }

}
