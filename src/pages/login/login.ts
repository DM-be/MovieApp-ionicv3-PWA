import {
  IonicPage,
  NavController,
  NavParams,
  Tabs,
  Events,
  Platform
} from 'ionic-angular';
import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';
import {
  SignupPage
} from '../signup/signup';
import {
  Loading
} from 'ionic-angular';
import {
  LoadingController
} from 'ionic-angular/components/loading/loading-controller';
import {
  MovieProvider
} from '../../providers/movie/movie';
import {
  SeenMoviesPage
} from '../seen-movies/seen-movies';
import {
  TabsPage
} from '../tabs/tabs';
import {
  DbProvider
} from '../../providers/db/db';
import {
  LoggedInTabsPage
} from '../logged-in-tabs/logged-in-tabs';
import {
  App
} from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string;
  private password: string;
  private onBrowser: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingController: LoadingController,
    public movieProvider: MovieProvider,
    public dbProvider: DbProvider,
    public appCtrl: App,
    public events: Events,
    public platform: Platform

  ) {}

  onMobile() {
    return this.platform.is('mobile');
  }

  onCore() {
    return this.platform.is('core');
  }

  login() {
    let loader = this.loadingController.create({
      content: "Signing in..."
    })
    loader.present();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let credentials = {
      username: this.username,
      password: this.password
    }
    this.http.post(
      'https://mighty-ravine-91955.herokuapp.com/auth/login',
      JSON.stringify(credentials), {
        headers: headers
      }).subscribe(async res => {
      this.dbProvider.init(res.json(), false);
      this.events.subscribe("localsync:completed", () => {
        loader.dismiss();
        this.appCtrl.getRootNav().setRoot(LoggedInTabsPage);
      }) // have to wait for the data to be in sync, how else can we check the seen/watch list?
    })
  }
  launchSignup() {
    this.navCtrl.push(SignupPage);
  }

}
