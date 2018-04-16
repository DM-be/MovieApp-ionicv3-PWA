import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SocialProvider } from '../../providers/social/social';
import { CompleterService, CompleterData } from 'ng2-completer';
import { DbProvider } from '../../providers/db/db';
/**
 * Generated class for the AddFriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public socialProvider: SocialProvider, private completerService: CompleterService,
  public dbProvider: DbProvider) {
  }

  ionViewDidLoad() {
  }

  itemSelected(event)
  {
    console.log(event)
    let username = event.username;
    //this.dbProvider.addFriend(username);
    this.dbProvider.inviteFriend(username);
    this.navCtrl.pop();
  }

}
