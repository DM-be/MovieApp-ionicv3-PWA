import {
  Injectable, OnInit
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
import { AlertController, Events } from 'ionic-angular';

/*
  Generated class for the SocialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class SocialProvider implements AutoCompleteService, OnInit {

  private friends = [];
  private allUsers;
  labelAttribute = "username";

  constructor(public dbProvider: DbProvider, public http: Http, public alertCtrl: AlertController, public events: Events) {
    this.getAcceptedFriends();
    this.events.subscribe("friend:newInvite", invites => {
      if(invites)
      {
        this.presentPrompt(invites);
      }
      
    });
    console.log('tester');
    let openFriends = this.dbProvider.getRecievedInvitesProperty();
    console.log(openFriends);
    this.createPrompt(openFriends);
    
  }

  ngOnInit() {
    
      // when user is logged out,and logs back in
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

  async presentPrompt(invites) {
    // let openFriends = await this.getOpenInvitedFriends();
    if (invites.length > 0) {
      invites.forEach(friend => {
        this.createPrompt(friend);
      });
    }
  }
  createPrompt(friend) {
    let prompt = this.alertCtrl.create({
      title: 'Friend invite',
      message: friend.username + " invited you as a friend, will you accept or decline?",
      buttons: [{
          text: 'Decline',
          handler: data => {
            this.declineInvite(friend.username);
          }
        },
        {
          text: 'Accept',
          handler: async data => {
            await this.acceptInvite(friend.username);
          }
        }
      ]
    });
    prompt.present();
  }



}
