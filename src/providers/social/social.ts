
import { Injectable } from '@angular/core';
import { DbProvider } from '../db/db';

/*
  Generated class for the SocialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocialProvider {

  private friends = [];



  constructor(public dbProvider: DbProvider) {
    this.getFriends();
  }

  

  async getFriends() {
    this.friends = await this.dbProvider.getFriends(this.dbProvider.getUser());
    return this.friends;
  }

}
