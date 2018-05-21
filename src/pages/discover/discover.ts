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
import {
  DbProvider
} from '../../providers/db/db';
import {
  TabsPage
} from '../tabs/tabs';
import {
  RecommendPage
} from '../recommend/recommend';
import {
  Http,
  Headers
} from '@angular/http';
import {
  Observable
} from 'rxjs/Observable';
import {
  CacheService
} from 'ionic-cache';
import {
  Movie
} from '../../model/movie';

@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {
  private searchTerm: string = '';
  private searchControl: FormControl;
  private movieDetailPage = MovieDetailPage;
  private recommendPage = RecommendPage;
  private movies: Movie[];
  private seenMovies: any;
  private watchedMovies: any;
  private hasNextPage: boolean = false;
  private firstSearch: boolean = true;
  private findingSimilarMovies: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private movieProvider: MovieProvider,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private events: Events,
    private dbProvider: DbProvider,
    private toastCtrl: ToastController,
    private http: Http,
    private cache: CacheService,
  ) {
    this.searchControl = new FormControl();
    this.movies = [];
    this.movieProvider.getMovies(true, false, true).subscribe(movies => {
      movies.forEach(movie => {
        this.movies.push(movie);
      });
    })
    this.refreshMovies();
  }

  ionViewWillEnter() {
    this.refreshMovies();
  }

  setSmallIcons(): boolean {
    return this.platform.width() < 500;
  }

  refreshMovies(): void {
    this.seenMovies = this.dbProvider.getMovies("seen")
    this.watchedMovies = this.dbProvider.getMovies("watch")
  }
  ionViewDidLoad() {
    this.events.subscribe("similarMovies", movieId => {
      let loading = this.loadingCtrl.create({
        cssClass: 'transparent'
      });
      loading.present();
      this.movies = [];
      this.movieProvider.setQuery(movieId);
      this.movieProvider.getMovies(true, true).subscribe(similarMovies => {
        similarMovies.forEach(movie => {
          this.findingSimilarMovies = true;
          this.movies.push(movie);
        });
      })
      loading.dismiss();
    })

    this.events.subscribe("discover:updated", (searchTerm) => {
      this.searchTerm = searchTerm;
      if (this.firstSearch) {
        this.firstSearch = false;
      }
      if (this.movieProvider.getSearchingBy() === 'getKeyword' || this.movieProvider.getSearchingBy() === 'findByKeyword') {
        this.setMoviesByKeyWord(searchTerm);
      } else if (this.movieProvider.getSearchingBy() === 'title') {
        this.setMoviesByTitle(searchTerm);
      }
    })
    this.refreshMovies();
  }

  setMoviesByTitle(searchTerm): void {
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
      this.refreshMovies();
      loading.dismiss();
    } catch (err) {
      console.log("error in setting the movies by title : " + err);
    }
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

  openMovieDetail(movie: Movie): void {
    this.navCtrl.push(this.movieDetailPage, {
      movie: movie
    });
  }
  openRecommendMovie(movie): void {
    let recommendModal = this.modalCtrl.create(RecommendPage, {
      "movie": movie
    });
    recommendModal.present();
  }

  setMoviesByKeyWord(keyword): void {
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
      this.refreshMovies(); 
      loading.dismiss();
    } catch (err) {
      console.log("error in setting the movies by keyword : " + err);
    }
  }

  doInfinite(event): void {
    this.movieProvider.getMovies(false, this.findingSimilarMovies, this.firstSearch).subscribe(movies => {
      movies.forEach(movie => {
        this.movies.push(movie);
      });
      event.complete()
    })
}
}