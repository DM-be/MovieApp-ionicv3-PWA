import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';

/**
 * Generated class for the SeenMoviesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-seen-movies',
  templateUrl: 'seen-movies.html',
})
export class SeenMoviesPage {

  movies: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider) {
    
  }

  ionViewDidLoad() {

    // this.movieProvider.getMovies('seen').then((data) => {
    //   console.log(data);
    //   console.log("this is a log")
    //   this.movies = data;
    // });

   
    //  this.movieProvider.getMoviesInTheater().then((data) => {
    //     this.movies = data;

    //  })

    // this.movieProvider.getKeyWords().then((keywords) => {
    //   this.movieProvider.getRelatedMovies(keywords).then(
    //     (data) => {
    //       this.movies = data;
    //       console.log(data)
    //     }
    //   )
    // })
    // this.movieProvider.getRelatedMovies('188|930').then((data) => {
    //   this.movies = data;
    // })

    this.movieProvider.getKeyWords().then((keywords) => {
      console.log(keywords)
      this.movieProvider.getRelatedMovies(keywords).then((movies) => {
        this.movies = movies;
      })
    })
     
      
    
    

    }

}
