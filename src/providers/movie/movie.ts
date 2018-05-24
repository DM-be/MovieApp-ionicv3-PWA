import {
  Injectable
} from '@angular/core';

import PouchDB from 'pouchdb';

import moment from 'moment';
import {
  Http,
  Headers
} from '@angular/http';


import {
  CacheService
} from 'ionic-cache';
import {
  Observable
} from 'rxjs/Observable';
import {
  Movie
} from '../../model/movie';


@Injectable()
export class MovieProvider {

  private currentPage: number = 1; // holds the number of the search, also used to control the infinite scroll
  private totalPages: number; 
  private hasNextPage: boolean; // binding for ion infinite
  private query: string;
  private movieId: number;
  private searchingBy: string; // binding for popover menu 
  private api_key = "4e60ba1292b6c1d4bbf05e0fe3542a92";
  private headers: Headers;


  constructor(public http: Http, private cache: CacheService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.setHasNextPage(false);
    this.setSearchingBy('title');
  }


  


  setQuery(query: string) {
    this.query = query;
  }

  setSearchingBy(searchOption: string) {
    this.searchingBy = searchOption;
  }

  getSearchingBy(): string {
    return this.searchingBy;
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
  setTotalPages(numberOfPages: number) {
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

  resetSearch() {
    this.resetCurrentPage();
    this.setHasNextPage(false);
  }

  getUrl(movieId ? : boolean, firstSearch ? : boolean): string {
    if (movieId) {
      return `https://api.themoviedb.org/3/movie/${this.query}/similar?api_key=${this.api_key}&page=${this.currentPage}`;
    } else if (firstSearch) {
      let now = moment().format('YYYY-MM-DD');
      let aMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
      return `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&primary_release_date.gte=${aMonthAgo}&primary_release_date.lte=${now}&page=${this.currentPage}`;

    } else {
      switch (this.getSearchingBy()) {
        case 'title':
        return `https://api.themoviedb.org/3/search/movie?api_key=${this.api_key}&query=${this.query}&page=${this.currentPage}`;
        case 'findByKeyword':
        return `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&with_keywords=${this.query}&page=${this.currentPage}`;
      }
    }
  }

  getMovies(reset ? : boolean, movieId ? : boolean, firstSearch ? : boolean): Observable < Movie[] > {
    if (reset) {
      this.resetSearch();
    }
    let url = this.getUrl(movieId, firstSearch);
    return this.makeApiCall(url);
  }

  makeApiCall(url: string): Observable < Movie[] > {
    let req = this.http.get(
      url, {
        headers: this.headers
      }).map(res => {
      this.setTotalPages(res.json().total_pages);
      return res.json().results.map(movie => new Movie(movie.id, movie.title, movie.overview, movie.poster_path))
    })
    this.incrementCurrentPage();
    if (this.getCurrentPage() === this.getTotalPages()) {
      this.setHasNextPage(false);
    } else {
      this.setHasNextPage(true);
    }
    return this.cache.loadFromObservable(url, req)
  }

  getKeyWords() {
    let keyWordURL = `https://api.themoviedb.org/3/search/keyword?api_key=${this.api_key}&query=${this.query}`
    let req = this.http.get(keyWordURL, {
      headers: this.headers
    }).map(res => {
      return res.json().results.map(kw => kw.id).slice(0, 1).join('|')
    });
    return this.cache.loadFromObservable(keyWordURL, req);
  }

  getIMDBId(movieId: number) {
    let url = `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${this.api_key}`;
    let req = this.http.get(
      url, {
        headers: this.headers
      }).map(res => {
        if(res.json().imdb_id)
        {
          return res.json().imdb_id
        }
      
    });
    
      return this.cache.loadFromObservable(url, req)
    
    
  }
}
