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
  relatedMovies:  Observable<any>;
  moviesByTitle: Observable<any>;
  similarMovies: Observable<any>;
  IMDBId: Observable<any>;

  currentPage: number; // holds the number of the search, also used to control the infinite scroll
  totalPages: number; // gets returned by the json call
  hasNextPage: boolean; // check for the infinite scroller, also the binding for it

  query: string;
  movieId: number;

  searchByTitle: boolean = true;
  searchByKeyword: boolean = false;

  searchingBy: string;


  api_key = "4e60ba1292b6c1d4bbf05e0fe3542a92";
  headers = new Headers();
  constructor(public http: Http,  private cache: CacheService) {
    this.headers.append('Content-Type', 'application/json');
    this.currentPage = 1;
    this.totalPages = 1;
    this.hasNextPage = false;
    this.searchingBy = "title"; // default search by title
    this.query = '';
  }

  setQuery(query: string) {
    this.query = query;
  }

  setSearchingBy(searchOption: string)
  {
    this.searchingBy = searchOption;
  }
  
  getSearchingBy(): string
  {
    return this.searchingBy;
  }

  setSearchByTitle(bool: boolean)
  {
    this.searchByTitle = bool;
  }

  getSearchByTitle(): boolean {
    return this.searchByTitle;
  }

  getSearchByKeyword(): boolean {
    return this.searchByKeyword;
  }

  setSearchByKeyword(bool: boolean) {
    this.searchByKeyword = bool;
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

  resetSearch() {
    this.resetCurrentPage();
  }

  getUrl(): string {
    let url = '';
    switch(this.getSearchingBy())
    {
      case 'title': 
      url = `https://api.themoviedb.org/3/search/movie?api_key=${this.api_key}&query=${this.query}&page=${this.currentPage}`;
      return url;
      case 'getKeyword':
      url = `https://api.themoviedb.org/3/search/keyword?api_key=${this.api_key}&query=${this.query}`;
      return url;
      case 'findByKeyword':
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&with_keywords=${this.query}&page=${this.currentPage}`;
      return url;
      case 'similar':
      url = `https://api.themoviedb.org/3/movie/${this.movieId}/similar?api_key=${this.api_key}&page=${this.currentPage}`;
      default: 
      let now = moment().format('YYYY-MM-DD');
      let aMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&primary_release_date.gte=${aMonthAgo}&primary_release_date.lte=${now}`;
      return url;
    }
      
  }



  getMovies(reset?: boolean) {
    if(reset) {
      this.resetSearch(); 
    }
    let url = this.getUrl();
    if(this.getSearchingBy() === 'getKeyword')
    {
      return this.getKeyWords();
    }
    return this.makeApiCall();
  }

  makeApiCall(): Observable<any> {
    let req = this.http.get(
      this.getUrl(), {
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
      return this.cache.loadFromObservable(this.getUrl(), req)
  }


  getMovieByTitle(searchString: string)
  {
    let query = searchString.split(" ").join('%20')// todo: split multiple and seperate with +;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${this.api_key}&query=${query}&page=${this.currentPage}`
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
      return this.cache.loadFromObservable(url, req)

    }


  
 

  getKeyWords() {
      this.resetCurrentPage() // searching by a new keyword always resets the page number
      let keyWordURL = `https://api.themoviedb.org/3/search/keyword?api_key=${this.api_key}&query=${this.query}`
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

  getSimilarMovie(movieId: number)
  {
    let url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${this.api_key}&page=${this.currentPage}`;

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
      this.similarMovies = this.cache.loadFromObservable(url, req)
      return this.similarMovies;
    }
    getIMDBId(movieId: string)
    {
      let url = `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${this.api_key}`;

      let req = this.http.get(
      url, {
        headers: this.headers
      }).map(res => {
        return res.json().imdb_id
      });
      this.IMDBId = this.cache.loadFromObservable(url, req)
      return this.IMDBId;
    }
    }
  



