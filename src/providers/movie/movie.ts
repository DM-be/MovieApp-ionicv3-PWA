import {
  Injectable
} from '@angular/core';

import PouchDB from 'pouchdb';

import moment from 'moment';
import {
  Http,
  Headers
} from '@angular/http';


import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../../model/movie';


/*
  Generated class for the MovieProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MovieProvider {

  keywords: Observable<any>;
  moviesIntheaters: Observable<any>;
  relatedMovies:  Observable<any>



  user: string;

  api_key = "4e60ba1292b6c1d4bbf05e0fe3542a92";
  headers = new Headers();
  file_size = "w200"
  image_url = "https://image.tmdb.org/t/p/"

  constructor(public http: Http,  private cache: CacheService) {
    this.headers.append('Content-Type', 'application/json');

  }

  // api functions
 

  getKeyWords(keyword) {
    // return new Promise(resolve => {
      let keyWordURL = `https://api.themoviedb.org/3/search/keyword?api_key=${this.api_key}&query=${keyword}`

      let req = this.http.get(keyWordURL, {
        headers: this.headers
      } ).map(res => {return res.json().results.map(kw => kw.id).slice(0,1).join('|')});
      this.keywords = this.cache.loadFromObservable(keyWordURL, req);
      return this.keywords;


    //  this.http.get(
    //     keyWordURL, {
    //       headers: this.headers
    //     }).subscribe(res => {
    //     keyWordIDS = res.json().results.map(id => id.id);
    //     keyWordIDS = keyWordIDS.slice(0, 1).join('|');
    //     resolve(keyWordIDS);
    //   }, err => console.log(err));

    // })
  }


  getRelatedMovies(keywords) {

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&with_keywords=${keywords}`;
    let req = this.http.get(
      url, {
        headers: this.headers
      }).map(res => {
        return res.json().results.map(movie => new Movie(movie.id, movie.title, movie.overview, movie.poster_path))
      })
    this.relatedMovies = this.cache.loadFromObservable(url, req)
    return this.relatedMovies;



    


    
    // return new Promise(resolve => {
    //   let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&with_keywords=${keywords}`;
    //   let relatedMovies = [];
    //   this.http.get(
    //     url, {
    //       headers: this.headers
    //     }).subscribe(res => {

    //     res.json().results.forEach(movie => {
    //       relatedMovies.push({
    //         "id": movie.id,
    //         "title": movie.title,
    //         "poster": this.image_url + this.file_size + movie.poster_path,
    //         "overview": movie.overview
    //       })
    //     });
    //   }, err => console.log(err));

    //   resolve(relatedMovies);

    // })
  }
   getMoviesInTheater() {

 
      let now = moment().format('YYYY-MM-DD');
      let aMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&primary_release_date.gte=${aMonthAgo}&primary_release_date.lte=${now}`;
      let req = this.http.get(
        url, {
          headers: this.headers
        }).map(res => {
          return res.json().results.map(movie => new Movie(movie.id, movie.title, movie.overview, movie.poster_path));
        })
      this.moviesIntheaters = this.cache.loadFromObservable(url, req)
      return this.moviesIntheaters;

  }

}

