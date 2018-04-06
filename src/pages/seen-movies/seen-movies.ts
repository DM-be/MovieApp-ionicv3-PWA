import { Component, ViewChild  } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { Platform } from 'ionic-angular/platform/platform';
import { HomePage } from '../home/home';
import { Content } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

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

  @ViewChild(Content) content: Content;

  searchTerm: string = '';
  searchControl: FormControl;

  movies: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public movieProvider: MovieProvider,
    public platform: Platform,
    ) {

     
      
      
  }


  ionViewDidLoad() {
    this.movieProvider.getMovies("seen").then(data => console.log(data))

 
      
      

  }
  

    


    

    
    
    

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

    
     
      
    
    

    }

   

