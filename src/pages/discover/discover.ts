import { Component, ViewChild  } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { Platform } from 'ionic-angular/platform/platform';
import { HomePage } from '../home/home';
import { Content } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';



@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

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

      this.searchControl = new FormControl();
    
      let genres = [
        'horror',
        'drama'
      ]

      
      
      
  }


  ionViewDidLoad() {

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
       this.setMoviesByKeyWords(this.searchTerm); 
      

  });
    }

    setMoviesByKeyWords(keyword)
    {

      this.movieProvider.getKeyWords(keyword).then((keywords) => {
        console.log(keywords)
        this.movieProvider.getRelatedMovies(keywords).then((movies) => {
          this.movies = movies;
        //  console.log(this.content.scrollHeight)
        console.log(this.movies)
          

        })
      })
    }

}
