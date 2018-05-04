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
  private selectedFriends =  [];
  private recommendationText: string; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, params: NavParams) {
  this.movie = this.navParams.get("movie");
  console.log(this.movie)
  this.setupFriends();
  }



  ionViewDidLoad() {
   
  }

  IonViewWillEnter() {
    
  }

  updateSelectedFriends(friend) {
    if(this.selectedFriends.findIndex(f => f.username === friend.username) === -1)
    {
      this.selectedFriends.push(friend);
    }
    else {
      this.selectedFriends = this.selectedFriends.filter(f => friend.username !== f.username )
    }
  }


 async setupFriends() {
    this.friends = await this.dbProvider.getAcceptedFriends();
    console.log(this.friends)
  }

  recommendMovie() {
    if(this.recommendationText !== "" && this.selectedFriends.length > 0)
    {
      this.selectedFriends.forEach(friend => {
        this.dbProvider.addRecommendation(this.movie, friend, this.recommendationText);
      });
   
      // uncheck everything and empty text
      // maybe give  apop up
    }
    
  }



}
