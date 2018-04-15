
import { Injectable } from '@angular/core';
import { DbProvider } from '../db/db';
import {AutoCompleteService} from 'ionic2-auto-complete';

/*
  Generated class for the SocialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocialProvider implements AutoCompleteService {

  private friends = [];
  private allUsers;
  labelAttribute = "username";



  constructor(public dbProvider: DbProvider) {
    this.getFriends();
  }

  getAllUsers() {
    return [{"username": "dennis", "avatar": "https://ionicframework.com/dist/preview-app/www/assets/img/marty-avatar.png"},{"username": "rianne", "avatar": "bla"} ]
  }

  

  async getFriends() {
    this.friends = await this.dbProvider.getFriends(this.dbProvider.getUser());
    return this.friends;
  }

  async getResults(keyword:string) {
    
    return this.allUsers
      .map(
        result =>
        {
          return result
            .filter(item => item.username.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }

}
