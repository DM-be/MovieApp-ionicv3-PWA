import { ToastProvider } from './../../providers/toast/toast';
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

  public friends: any;
  public allUsers: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public socialProvider: SocialProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public events: Events,
    public filterProvider: FilterProvider,
    public toastCtrl: ToastController,
    public toastProvider: ToastProvider) {
  
  }
  ionViewDidEnter() {
    this.setup();
    this.checkForFriendInvites();
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
        this.toastProvider.addToastToQueue(undefined, undefined, newFriend.username, false, true);
      }
     this.friends = this.socialProvider.getAcceptedFriends();   
    })
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

  async checkForFriendInvites() {
    let openFriends = await this.socialProvider.getOpenInvitedFriends();
    if (openFriends.length > 0) {
      openFriends.forEach(friend => {
        this.createPrompt(friend);
      });
    }
  }
  createPrompt(friend) {
    let prompt = this.alertCtrl.create({
      title: 'Friend invite',
      message: friend.username + " invited you as a friend, will you accept or decline?",
      buttons: [{
          text: 'Decline',
          handler: data => {
            this.socialProvider.declineInvite(friend.username);
          }
        },
        {
          text: 'Accept',
          handler: async data => {
            await this.socialProvider.acceptInvite(friend.username)
            this.setup();
          }
        }
      ]
    });
    prompt.present();
  }
}
