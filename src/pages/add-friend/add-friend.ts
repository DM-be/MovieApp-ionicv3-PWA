import { ToastProvider } from './../../providers/toast/toast';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Searchbar,
  ToastController
} from 'ionic-angular';
import {
  SocialProvider
} from '../../providers/social/social';
import {
  CompleterService,
  CompleterData
} from 'ng2-completer';
import {
  DbProvider
} from '../../providers/db/db';
import {
  AutoCompleteComponent
} from 'ionic2-auto-complete';


@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {

  @ViewChild('searchbar') searchbar: AutoCompleteComponent;
  public possibleFriends: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public socialProvider: SocialProvider, private completerService: CompleterService,
    public dbProvider: DbProvider, public toastCtrl: ToastController, public toastProvider: ToastProvider) {
    this.possibleFriends = [];
  }

  friendEmpty(){
    return this.possibleFriends.length == 0 || undefined;
  }

  itemSelected(possibleFriend) {
    if (this.possibleFriends.findIndex(u => u.username === possibleFriend.username) === -1) {
      this.possibleFriends.push(possibleFriend)
    }
    this.searchbar.clearValue();
  }

  delete(i) {
    console.log(i);
  this.possibleFriends.splice(i, 1);
  }

  async invite(friend) {
    await this.dbProvider.inviteFriend(friend.username);
  }

  inviteFriends() {
    let friendsString = "";
    this.possibleFriends.forEach(async (friend, i) => {
    
     this.dbProvider.inviteFriend(friend.username);
      // yield is reserved in foreach
      if (i === this.possibleFriends.length - 1 && this.possibleFriends.length > 1) {
        friendsString += ` and ${friend.username}`
      } else {
        friendsString += ` ${friend.username}`
      }
    });
    this.toastProvider.addToastToQueue(undefined, undefined, friendsString, undefined, undefined, undefined, true);
    this.navCtrl.pop();
  }
  closeModal() {
    this.navCtrl.pop();
  }
}
