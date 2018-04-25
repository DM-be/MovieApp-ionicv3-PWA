
import { Injectable } from '@angular/core';
import { DbProvider } from '../db/db';
import {AutoCompleteService} from 'ionic2-auto-complete';


import { Http } from '@angular/http';

import 'rxjs/add/operator/map'

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



  constructor(public dbProvider: DbProvider, public http: Http) {
    this.getAcceptedFriends();
  }

  getAllUsers() {
    return [{"username": "dennistest", "avatar": "https://ionicframework.com/dist/preview-app/www/assets/img/marty-avatar.png"},{"username": "rianne", "avatar": "bla"} ]
  }

  getAllUsers2() {
    return this.dbProvider.getAllUsers();
  }

  

  async getAcceptedFriends() {
    let acceptedFriends = await this.dbProvider.getAcceptedFriends();
    return acceptedFriends;
  }

  async getOpenInvitedFriends() {
    let openFriends = await this.dbProvider.getOpenFriendInvites();
    return openFriends;
  }

  async acceptInvite(username) {
   await this.dbProvider.acceptFriendInvite(username);
  }

  async declineInvite(username) {
   await this.dbProvider.declineFriendInvite(username);
  }

  getResults(keyword:string) {
    return this.getAllUsers()
      .filter(
        result => {return result.username.toLowerCase().startsWith(keyword.toLowerCase())
  })


}



}
