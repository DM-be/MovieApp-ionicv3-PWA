import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialProvider } from '../../providers/social/social';

/**
 * Generated class for the SocialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-social',
  templateUrl: 'social.html',
})
export class SocialPage {

  friends: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public socialProvider: SocialProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialPage');
    this.setup();
  }

  async setup(){
    this.friends = await this.socialProvider.getFriends();
  }

}
