import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
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
  HomePage
} from '../home/home';
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
  MovieDetailPage
} from '../movie-detail/movie-detail';
import {
  ImageLoaderConfig
} from 'ionic-image-loader';
import {
  LoginPage
} from '../login/login';
import { DbProvider } from '../../providers/db/db';


@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  @ViewChild(Content) content: Content;

  offset = 100;

  defaultImage = "../assets/imgs/preloader.gif"

  searchTerm: string = '';
  searchControl: FormControl;

  movieDetailPage = MovieDetailPage;
  loginPage = LoginPage
  movies: any;

  seenMovies: any;
  watchedMovies: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private imageLoaderConfig: ImageLoaderConfig,
    public modalCtrl: ModalController,
    public events: Events,
    public dbProvider: DbProvider
  ) 
  {
    this.searchControl = new FormControl();
    this.getMoviesInTheatre();
    //this.refreshMovies()
    
  }

  async refreshMovies() {
    this.seenMovies = await this.dbProvider.getMovies_async("seen");
    this.watchedMovies = await this.dbProvider.getMovies_async("watch")
    console.log(this.watchedMovies);
  }

  login() {
    let loginModal = this.modalCtrl.create(this.loginPage);
    loginModal.present();
  }
  ionViewDidLoad() {
    this.events.subscribe("discover:updated", (searchTerm) => {
      this.setMoviesByKeyWords_async(searchTerm);
    })
  }

  isInWatched(movie) {
    return (this.watchedMovies.findIndex(i => i.title === movie.title) > -1);
     // stops after returning a match
  }

  isInSeen(movie)
  {
    return (this.seenMovies.findIndex(i => i.title === movie.title) > -1);
  }

  async getMoviesInTheatre() {
    this.movies = await this.movieProvider.getMoviesInTheater();
  }

  ionViewWillEnter() {
    this.refreshMovies();
    console.log(this.seenMovies)
    console.log(this.watchedMovies);
  }

  openMovieDetail(i) {
    let movie = this.movies[i];
    this.navCtrl.push(this.movieDetailPage, {
      movie: movie
    });
  }

  async setMoviesByKeyWords_async(keyword) {
    try {
      let loading = this.loadingCtrl.create({
        cssClass: 'transparent'
      });
      loading.present();
      const keywords = await this.movieProvider.getKeyWords(keyword);
      const movies = await this.movieProvider.getRelatedMovies(keywords)
      this.movies = movies;
      loading.dismiss();
    } catch (err) {
      console.log("error in setting the movies by keyword : " + err);
    }


  }

}
