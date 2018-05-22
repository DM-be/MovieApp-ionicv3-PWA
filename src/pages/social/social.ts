import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  Events,
  ToastController
} from 'ionic-angular';
import {
  SocialProvider
} from '../../providers/social/social';
import {
  AddFriendPage
} from '../add-friend/add-friend';
import { FilterProvider } from '../../providers/filter/filter';

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

  private friends: any;
  private allUsers: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public socialProvider: SocialProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public events: Events,
    public filterProvider: FilterProvider,
    public toastCtrl: ToastController) {
    this.events.subscribe("data:changed", () => {
      this.setup();
     // this.checkForFriendInvites();
    })
  }
  ionViewDidEnter() {
    this.setup();
 //   this.checkForFriendInvites();
  }

  ionViewDidLoad() {
    this.events.subscribe("social:updated", (searchTerm) => {
      this.friends = this.filterProvider.filterBySearchTerm(this.friends, searchTerm);
    })
    this.events.subscribe("social:empty", async () => {
      this.friends = this.socialProvider.getAcceptedFriends();
    })
    this.events.subscribe("friend:accepted", (newFriend, showPopup) => {
      if(showPopup)
      {
        this.presentToast(newFriend.username);
      }
     this.friends = this.socialProvider.getAcceptedFriends();   
    })
  }


  presentToast(friendName: string): void {
    let toast = this.toastCtrl.create({
      message: `${friendName} has accepted your friend request`,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  setup() {
    this.friends =  this.socialProvider.getAcceptedFriends();
  }

  addFriendAction() {
    let modal = this.modalCtrl.create(AddFriendPage);
    modal.onDidDismiss(data => {
      this.setup();
    })
    modal.present();
  }

}
