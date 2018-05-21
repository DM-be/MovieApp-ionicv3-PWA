import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  LoadingController,
  Events
} from 'ionic-angular';
import {
  Http,
  Headers
} from '@angular/http';

import {
  DbProvider
} from '../../providers/db/db';
import {
  TabsPage
} from '../tabs/tabs';
import {
  LoggedInTabsPage
} from '../logged-in-tabs/logged-in-tabs';



/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private name: string;
  private username: string;
  private email: string;
  private password: string;
  private confirmPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public dbProvider: DbProvider,
    public appCtrl: App,
    public loadingController: LoadingController,
    public events: Events) {}

  register() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };
    let loader = this.loadingController.create({
      content: "Signing up..."
    })
    loader.present();
    this.http.post('https://mighty-ravine-91955.herokuapp.com/auth/register', JSON.stringify(user), {
        headers: headers
      })
      .subscribe(res => {
        this.dbProvider.init(res.json(), true)
        this.events.subscribe("sharedsync:completed", () => {
          loader.dismiss();
          this.dbProvider.register(user);
          this.appCtrl.getRootNav().setRoot(LoggedInTabsPage);
        }) // have to wait for the shared DB to be in sync to register new users
      }, (err) => {
        console.log(err);
      });
  }



}
