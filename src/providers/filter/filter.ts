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
  }

  filterBySearchTerm(arr, searchTerm)
  {
    return arr.filter(function(o) {
      return Object.keys(o).some(function(k) {
    
       if(typeof o[k] === 'object')
       {
          return Object.keys(o[k]).some(k2 => o[k][k2].toString().toLowerCase().indexOf(searchTerm) != -1)
       }
       else {
         return o[k].toString().toLowerCase().indexOf(searchTerm) != -1;
       }
          
        
        
      })
    })
  }

}
