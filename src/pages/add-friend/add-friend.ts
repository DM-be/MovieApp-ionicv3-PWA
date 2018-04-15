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

  searchStr: string;
  protected dataService: CompleterData;
  searchData;
  constructor(public navCtrl: NavController, public navParams: NavParams, public socialProvider: SocialProvider, private completerService: CompleterService,
  public dbProvider: DbProvider) {
  this.searchData = this.socialProvider.getAllUsers();
  this.dataService = completerService.local(this.searchData, 'username', 'username').imageField("avatar").descriptionField("username");
  }

  ionViewDidLoad() {
  }

  setSelected(event)
  {
    let username = event.originalObject.username;
    this.dbProvider.addFriend(username);
    this.navCtrl.pop();
    
  }

}
