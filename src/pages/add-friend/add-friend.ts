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
    public dbProvider: DbProvider, public toastCtrl: ToastController) {
    this.possibleFriends = [];
  }

  itemSelected(possibleFriend) {
    if (this.possibleFriends.findIndex(u => u.username === possibleFriend.username) === -1) {
      this.possibleFriends.push(possibleFriend)
    }
    this.searchbar.clearValue();
  }

  delete(i) {
    this.possibleFriends.slice(i, 1);
  }

  async invite(friend) {
    await this.dbProvider.inviteFriend(friend.username);
  }

  inviteFriends() {
    let friendsString = "";
    console.log(this.possibleFriends)
    this.possibleFriends.forEach((friend, i) => {
      
      this.invite(friend);
      // yield is reserved in foreach
      if (i === this.possibleFriends.length - 1 && this.possibleFriends.length > 1) {
        friendsString += ` and ${friend.username}`
      } else {
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
