import {
  Injectable
} from '@angular/core';
import {
  DbProvider
} from '../db/db';
import {
  AutoCompleteService
} from 'ionic2-auto-complete';


import {
  Http
} from '@angular/http';

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

  getAcceptedFriends() {
    // let acceptedFriends = await this.dbProvider.getAcceptedFriends();
    return this.dbProvider.getAcceptedFriendsProperty();
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

  async getResults(keyword: string) {
    let users = await this.dbProvider.getAllUsers()
    return users
      .filter(
        result => {
          return result.username.toLowerCase().startsWith(keyword.toLowerCase())
        })
  }



}
