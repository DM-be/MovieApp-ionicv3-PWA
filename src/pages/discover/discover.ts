import {
  Component,
  ViewChild
} from '@angular/core';
import {
  ImageLoaderConfig
} from 'ionic-image-loader';
import {
  NavController,
  NavParams,
  LoadingController,
  ModalController,
  Events,
  App,
  ToastController
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
  LoginPage
} from '../login/login';
import { DbProvider } from '../../providers/db/db';
import { TabsPage } from '../tabs/tabs';
import { RecommendPage } from '../recommend/recommend';


@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  offset = 100;
  defaultImage = "./assets/imgs/preloader.gif"
  searchTerm: string = '';
  searchControl: FormControl;
  movieDetailPage = MovieDetailPage;
  recommendPage = RecommendPage;
  loginPage = LoginPage
  movies: any;
  tabsPage = TabsPage
  seenMovies: any;
  watchedMovies: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public events: Events,
    public dbProvider: DbProvider,
    public appCtrl: App,
    private toastCtrl: ToastController,

  ) 
  {
    this.searchControl = new FormControl();
    this.getMoviesInTheatre();
    this.refreshMovies();

  //   if (navigator.storage && navigator.storage.persist)
  // navigator.storage.persist().then(function(persistent) {
  //   if (persistent)
  //     console.log("Storage will not be cleared except by explicit user action");
  //   else
  //     console.log("Storage may be cleared by the UA under storage pressure.");
  // });
  }

  setSmallIcons() {
    return this.platform.width() < 500;
  }

  presentToast(movieTitle: string, typeOfList: string) {
    let toast = this.toastCtrl.create({
      message: `${movieTitle} was added to your ${typeOfList}list`,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
  refreshMovies() {
    this.seenMovies = this.dbProvider.getMovies("seen")
    this.watchedMovies = this.dbProvider.getMovies("watch")
  }
  ionViewDidLoad() {
    this.events.subscribe("discover:updated", (searchTerm) => {
      this.setMoviesByKeyWords_async(searchTerm);
    })
    this.refreshMovies();
  }
  ionViewWillEnter() {
    this.refreshMovies();
  }
  logOut() {
    this.dbProvider.logOut();
    this.appCtrl.getRootNav().setRoot(TabsPage);
  }
  isInWatched(movie) {
    if(this.watchedMovies !== undefined) // new users do not have watched movies
    {
       return (this.watchedMovies.findIndex(i => i.title === movie.title) > -1)
    }
  }

  isInSeen(movie)
  
  {
    if(this.seenMovies !== undefined)
    {
      return (this.seenMovies.findIndex(i => i.title === movie.title) > -1)
    }
    
  }


  async addToWatch(event,movie) {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    await this.dbProvider.addMovie("watch", movie);
    this.presentToast(movie.title, "watch");
  }

  async addToSeen(event,movie) {
    event.preventDefault();
    event.target.offsetParent.setAttribute("disabled", "disabled");
    await this.dbProvider.addMovie("seen", movie);
    this.presentToast(movie.title, "seen");
  }



  async getMoviesInTheatre() {
    this.movies = await this.movieProvider.getMoviesInTheater();
  }

   ionViewDidLeave() {
  //  this.refreshMovies();
  }


  openMovieDetail(movie) {
    this.navCtrl.push(this.movieDetailPage, {
      movie: movie
    });
  }

  openRecommendMovie(movie) {
   let recommendModal = this.modalCtrl.create(RecommendPage, {"movie": movie});
   recommendModal.present();
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
      this.refreshMovies();  // update to disable buttons
      loading.dismiss();
     
    } catch (err) {
      console.log("error in setting the movies by keyword : " + err);
    }


  }

}
