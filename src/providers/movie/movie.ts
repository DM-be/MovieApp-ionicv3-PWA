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
  currentPage: number; // holds the number of the search, also used to control the infinite scroll
  totalPages: number; // gets returned by the json call
  hasNextPage: boolean; // check for the infinite scroller, also the binding for it

  api_key = "4e60ba1292b6c1d4bbf05e0fe3542a92";
  headers = new Headers();
  constructor(public http: Http,  private cache: CacheService) {
    this.headers.append('Content-Type', 'application/json');
    this.currentPage = 1;
    this.totalPages = 4;
    this.hasNextPage = false;
  }

  resetCurrentPage() {
    this.currentPage = 1;
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  incrementCurrentPage() {
    this.currentPage++;
  }
  setTotalPages(numberOfPages: number)
  {
    this.totalPages = numberOfPages;
  }

  getTotalPages(): number {
    return this.totalPages;
  }
  getCurrentPage(): number {
    return this.currentPage;
  }

  setHasNextPage(bool: boolean) {
    this.hasNextPage = bool;
  }

  getHasNextPage(): boolean {
    return this.hasNextPage;
  }

  // api functions
 

  getKeyWords(keyword) {
      this.resetCurrentPage() // searching by a new keyword always resets the page number
      let keyWordURL = `https://api.themoviedb.org/3/search/keyword?api_key=${this.api_key}&query=${keyword}`
      let req = this.http.get(keyWordURL, {
        headers: this.headers
      } ).map(res => {return res.json().results.map(kw => kw.id).slice(0,1).join('|')});
      this.keywords = this.cache.loadFromObservable(keyWordURL, req);
      return this.keywords;
        // only one keyword is returned
  }


  getRelatedMovies(keywords) {

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&with_keywords=${keywords}&page=${this.currentPage}`;

      let req = this.http.get(
      url, {
        headers: this.headers
      }).map(res => {
        this.setTotalPages(res.json().total_pages);
        return res.json().results.map(movie => new Movie(movie.id, movie.title, movie.overview, movie.poster_path))
      }) 
      this.incrementCurrentPage();// increment pages AFTER we made the call
      if(this.getCurrentPage() === this.getTotalPages())
      {
        this.setHasNextPage(false);
      }
      else {
        this.setHasNextPage(true);
      }
      this.relatedMovies = this.cache.loadFromObservable(url, req)
      return this.relatedMovies;
    }

    
  


    


    
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

