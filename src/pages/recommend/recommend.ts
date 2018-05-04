import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

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

  private movie: any;
  private friends;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, params: NavParams) {
 
  this.setupFriends();
  }



  ionViewDidLoad() {
   
  }

  IonViewWillEnter() {
    
  }
 async setupFriends() {
    this.friends = await this.dbProvider.getAcceptedFriends();
    console.log(this.friends)
  }



}
