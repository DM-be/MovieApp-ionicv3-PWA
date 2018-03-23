
import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';


/*
  Generated class for the MovieProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MovieProvider {

  
  movies = {};
  db: any;
  remote: any;


  constructor() {
    
  }

  init(details)  {

    this.db = new PouchDB('cloudo');
    this.remote = details.userDBs.supertest;
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.sync(this.remote, options);
  }

  logout() {
    this.movies = null;
    this.db.destroy().then(() => {
      console.log("db removed")
    });
  }

  addMovie(type: string, movie: any)
  {
    
    
  }

  getMovies(type: string) {
  
    if (this.movies[type]) {
      return Promise.resolve(this.movies[type]);
    }
    return new Promise(resolve => {
 
      this.db.allDocs({
 
        include_docs: true,
        startkey: type,
        endkey: type + '\ufff0'
 
      }).then((result) => {
 
        this.movies[type] = [];
        result.rows.map((row) => {
          this.movies[type].push(row.doc);
        });

        console.log(this.getMovies[type])

        resolve(this.movies[type]);
      }).catch((error) => {
        console.log(error);
      });
 
    });
 




}
}
