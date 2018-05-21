import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FilterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilterProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FilterProvider Provider');
  }

  filterBySearchTerm(arr, searchTerm)
  {
    return arr.filter(function(o) {
      return Object.keys(o).some(function(k) {
    
        if(o[k] != null)
        {
          return o[k].toString().toLowerCase().indexOf(searchTerm) != -1;
        }
        
      })
    })
  }

}
