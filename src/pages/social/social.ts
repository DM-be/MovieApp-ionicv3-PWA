import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  Events
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
    public filterProvider: FilterProvider) {
    this.events.subscribe("data:changed", () => {
      this.setup();
      this.checkForFriendInvites();
    })
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
      this.friends = await this.socialProvider.getAcceptedFriends();
    })
  }
  async setup() {
    this.friends = await this.socialProvider.getAcceptedFriends();
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
            console.log("who is this guy???")
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
