import { Component, ApplicationRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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

  public movie: any;
  private friends;
  private selectedFriends =  [];
  private recommendationText: string; 
  private reset = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider, params: NavParams,
    private toastCtrl: ToastController) {
  this.movie =( this.navParams.get("movie"));
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

  inSelectedFriends(friend): boolean {
    return (this.selectedFriends.findIndex(f => f.username === friend.username) >= 0)
  } 


 async setupFriends() {
    this.friends = await this.dbProvider.getAcceptedFriends();
  }

  recommendMovie() {
    let friendsString = "";

    if(this.recommendationText !== "" && this.selectedFriends.length > 0)
    {
      this.selectedFriends.forEach((friend, i)=> {
        this.dbProvider.addRecommendation(this.movie, friend, this.recommendationText);
        if(i === this.selectedFriends.length - 1 && this.selectedFriends.length > 1)
        {
          friendsString +=  ` and ${friend.username}`
        }
        else {
          friendsString += ` ${friend.username}`
        }
        
      });

    

      let toast = this.toastCtrl.create({
        message: `${this.movie.title} was recommended to ${friendsString}`,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.selectedFriends = [];
      this.recommendationText = "";
    }
    
  }

  closeModal() {
    this.navCtrl.pop();
  }



}
