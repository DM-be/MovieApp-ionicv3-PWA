import {
  Component,
  ApplicationRef,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Events
} from 'ionic-angular';
import {
  DbProvider
} from '../../providers/db/db';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the RecommendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recommend',
  templateUrl: 'recommend.html',
})
export class RecommendPage {

  public movie: any;
  public friends;
  public selectedFriends = [];
  public recommendText: string;
  public reset = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, params: NavParams,
    private toastCtrl: ToastController, public events: Events, public toastProvider: ToastProvider) {
    this.movie = this.navParams.get("movieToRecommend");
    this.setupFriends();
    this.recommendText = "";
  }

  recommendEmpty(){
    return this.recommendText == "" || undefined;
  }
  
  updateSelectedFriends(friend) {
    if (this.selectedFriends.findIndex(f => f.username === friend.username) === -1) {
      this.selectedFriends.push(friend);
    } else {
      this.selectedFriends = this.selectedFriends.filter(f => friend.username !== f.username);
    }
  }

  inSelectedFriends(friend): boolean {
    return (this.selectedFriends.findIndex(f => f.username === friend.username) >= 0)
  }

  async setupFriends() {
    this.friends = await this.dbProvider.getAcceptedFriends();
  }

  recommendMovie() {
    let friendsString = "";
    if (this.recommendText !== "" && this.selectedFriends.length > 0) {
      this.selectedFriends.forEach((friend, i) => {
        
        this.dbProvider.addRecommendation(this.movie, friend, this.recommendText);
        if (i === this.selectedFriends.length - 1 && this.selectedFriends.length > 1) {
          friendsString += ` and ${friend.username}`
        } else {
          friendsString += ` ${friend.username}`
        }
      });
      this.toastProvider.addToastToQueue(this.movie.title, undefined, friendsString, false, false, true);
      this.selectedFriends = [];
      this.recommendText = "";
    }
  }

  closeModal() {
    this.navCtrl.pop();
  }

}
