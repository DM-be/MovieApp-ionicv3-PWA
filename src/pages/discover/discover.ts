import { Component, ViewChild  } from '@angular/core';
import {  NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { Platform } from 'ionic-angular/platform/platform';
import { HomePage } from '../home/home';
import { Content } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { MovieDetailPage } from '../movie-detail/movie-detail';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { LoginPage } from '../login/login';
import { DbProvider } from '../../providers/db/db';


@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  // TODO: because of async waiting we have to wait a while before we can enable/disable search results...
  
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
    ) {

      this.searchControl = new FormControl();
     // this.setup();
    
  }

  async setup() {
    // this.watchedMovies = await this.dbProvider.getMovies_async("watch")
    // this.seenMovies =  await this.dbProvider.getMovies_async("seen")
    this.watchedMovies = this.dbProvider.getWatchedMovies()
    this.seenMovies = this.dbProvider.getSeenMovies();
    console.log(this.seenMovies)
  }

  // todo refactor
  isInWatched(i) {
    let movieToCheck = this.movies[i]
    let bool = false;
    this.watchedMovies.forEach(movie => {
      if(movieToCheck.title == movie.title)
      {
        bool = true;
      }
    });
    return bool;
  }

  isInSeen(i)
  {
    let movieToCheck = this.movies[i]
    let bool = false;
    this.seenMovies.forEach(movie => {
      if(movieToCheck.title == movie.title)
      {
        bool = true;
      }
    });
    return bool;
  }
  


  logIt() {
    console.log("button is working")
  }


  ionViewWillEnter(){


    
 this.events.subscribe("discover:updated", (searchTerm) => {
     this.setMoviesByKeyWords_async(searchTerm);
   })}
    

  ionViewDidEnter() {
    this.setup();
    }

    openMovieDetail(i) {
      let movie = this.movies[i];
      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );
    }

    async setMoviesByKeyWords_async(keyword)
    {
      try {
        let loading = this.loadingCtrl.create({cssClass: 'transparent'});
      loading.present();
      const keywords = await this.movieProvider.getKeyWords(keyword);
      const movies = await this.movieProvider.getRelatedMovies(keywords)
      this.movies = movies;
      loading.dismiss();
      }
      catch(err) {
        console.log("error in setting the movies by keyword : " + err);
      }

      
    }

}
