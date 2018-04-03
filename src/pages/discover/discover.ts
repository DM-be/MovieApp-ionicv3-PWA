import { Component, ViewChild  } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { Platform } from 'ionic-angular/platform/platform';
import { HomePage } from '../home/home';
import { Content } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { MovieDetailPage } from '../movie-detail/movie-detail';



@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  @ViewChild(Content) content: Content;

  searchTerm: string = '';
  searchControl: FormControl;
  
  movieDetailPage = MovieDetailPage;

  movies: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController
    ) {

      this.searchControl = new FormControl();
    
      let genres = [
        'horror',
        'drama'
      ]

      
      
      
  }


  ionViewDidLoad() {

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
       this.setMoviesByKeyWords_async(this.searchTerm); 
      

  });
    }

    openMovieDetail(i) {
      let movie = this.movies[i];

      this.navCtrl.push(this.movieDetailPage, {movie: movie}
      );
    }


    async setMoviesByKeyWords_async(keyword)
    {
      const keywords = await this.movieProvider.getKeyWords(keyword);
      const movies = await this.movieProvider.getRelatedMovies(keywords)

      this.movies = movies;
    }



    setMoviesByKeyWords(keyword)
    {
      let loading = this.loadingCtrl.create({
        content:`please wait while im loading`
      });
    
      loading.present();

      this.movieProvider.getKeyWords(keyword).then((keywords) => {
        console.log(keywords)
        this.movieProvider.getRelatedMovies(keywords).then((movies) => {
          this.movies = movies;
          loading.dismiss();
        //  console.log(this.content.scrollHeight)
        console.log(this.movies)
          

        })
      })
    }

}
