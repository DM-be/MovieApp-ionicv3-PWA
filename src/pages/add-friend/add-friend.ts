import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Searchbar, ToastController } from 'ionic-angular';
import { SocialProvider } from '../../providers/social/social';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DbProvider } from '../../providers/db/db';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
/**
 * Generated class for the AddFriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {

  @ViewChild('searchbar') searchbar: AutoCompleteComponent;
  possibleFriends = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public socialProvider: SocialProvider, private completerService: CompleterService,
  public dbProvider: DbProvider, public toastCtrl: ToastController) {
    this.possibleFriends = [];
  }

  ionViewDidLoad() {
  }

  itemSelected(possibleFriend)
  {
    if(this.possibleFriends.findIndex(u => u.username === possibleFriend.username) === -1)
    {
       this.possibleFriends.push(possibleFriend)
    }
    this.searchbar.clearValue();
    //this.dbProvider.addFriend(username);
    

  }

  delete(i) 
  {
    this.possibleFriends.slice(i, 1);
  }

  inviteFriends() {

    let friendsString = "";
    this.possibleFriends.forEach((friend,i)=> {
    this.dbProvider.inviteFriend(friend.username);
    if(i === this.possibleFriends.length - 1 && this.possibleFriends.length > 1)
        {
          friendsString +=  ` and ${friend.username}`
        }
        else {
          friendsString += ` ${friend.username}`
        }
    });

    let toast = this.toastCtrl.create({
          message: `Sent a friend invite to ${friendsString}`,
          duration: 3000,
          position: 'top'
        });
        toast.present();

    this.navCtrl.pop();
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
