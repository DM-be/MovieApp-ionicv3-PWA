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
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CacheService } from 'ionic-cache';
import { Movie } from '../../model/movie';

@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {
  keyw;
  offset = 100;
  defaultImage = "./assets/imgs/preloader.gif"
  searchTerm: string = '';
  searchControl: FormControl;
  movieDetailPage = MovieDetailPage;
  recommendPage = RecommendPage;
  loginPage = LoginPage
  movies: Movie[];
  tabsPage = TabsPage
  seenMovies: any;
  watchedMovies: any;
  films: Observable<any>;
  hasNextPage: boolean =  false;
  firstSearch: boolean = true;
  findingSimilarMovies: boolean = false;

  @ViewChild(Content) content: Content;

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
    private http: Http,
    private cache: CacheService,


  ) 
  {



    this.searchControl = new FormControl();
    this.movies = [];
    this.movieProvider.getMovies(true, false, true).subscribe(movies => {
      movies.forEach(movie => {
        this.movies.push(movie);
      });
    })
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

    this.events.subscribe("similarMovies", movieId => {
      this.movies = [];
      this.movieProvider.setQuery(movieId);
      this.movieProvider.getMovies(true, true).subscribe(similarMovies => {
        similarMovies.forEach(element => {
          this.findingSimilarMovies = true;
          this.movies.push(element);
        });
        
      })
    })

    this.events.subscribe("discover:updated", (searchTerm) => {
      this.searchTerm = searchTerm;
      if(this.firstSearch)
      {
        this.firstSearch = false;
      }
      if(this.movieProvider.getSearchingBy() === 'getKeyword' || this.movieProvider.getSearchingBy() === 'findByKeyword' )
      {
        this.setMoviesByKeyWords_async(searchTerm);
      }
      else if(this.movieProvider.getSearchingBy() === 'title')
      {
        this.setMoviesByTitle(searchTerm);
      }
      
    })
    this.refreshMovies();
  }

  ionViewDidEnter() {
 //   this.content.scrollToTop();
  }

  setMoviesByTitle(searchTerm) {
    try {
      let loading = this.loadingCtrl.create({
        cssClass: 'transparent'
      });
      loading.present();
      this.movies = [];
      this.findingSimilarMovies = false;
      searchTerm.split(" ").join('%20')
      this.movieProvider.setQuery(searchTerm);
      this.movieProvider.getMovies(true).subscribe(movies => {
        movies.forEach(movie => {
            this.movies.push(movie);
        });
      })
      this.refreshMovies();  // update to disable buttons
      loading.dismiss();
    } catch (err) {
      console.log("error in setting the movies by title : " + err);
    }
  }


  ionViewWillEnter() {
    this.refreshMovies();
  }
  logOut() {
   // this.dbProvider.logOut();
  //  this.appCtrl.getRootNav().setRoot(TabsPage);

  }
  isInWatched(movie: Movie): boolean {
    if(this.watchedMovies !== undefined) // new users do not have watched movies
    {
       return (this.watchedMovies.findIndex(i => i.title === movie.title) > -1)
    }
  }

  isInSeen(movie: Movie): boolean
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

  openMovieDetail(movie: Movie) {
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
      this.movies = [];
      this.findingSimilarMovies = false;
      this.movieProvider.setQuery(keyword);
      this.movieProvider.getKeyWords().subscribe(keywordAsANumber => {
        this.movieProvider.setQuery(keywordAsANumber);
        this.movieProvider.setSearchingBy('findByKeyword');
         this.movieProvider.getMovies(true).subscribe(movies => {
          movies.forEach(movie => {
            this.movies.push(movie);
          });
        })
      })
      this.refreshMovies();  // update to disable buttons  
      loading.dismiss();  
    } catch (err) {
      console.log("error in setting the movies by keyword : " + err);
    }
  }

  doInfinite(event) {
    this.movieProvider.getMovies(false, this.findingSimilarMovies, this.firstSearch).subscribe(movies => {
      movies.forEach(movie => {
        this.movies.push(movie);
      });
      event.complete()
      })

    }

   
    
    

  

  }


