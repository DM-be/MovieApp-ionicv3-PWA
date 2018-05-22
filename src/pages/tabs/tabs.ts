import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import {
  Platform
} from 'ionic-angular/platform/platform';
import {
  SeenMoviesPage
} from '../seen-movies/seen-movies';
import {
  SuperTabs
} from 'ionic2-super-tabs';
import {
  DiscoverPage
} from '../discover/discover';
import {
  SocialPage
} from '../social/social';
import {
  RecommendationsPage
} from '../recommendations/recommendations';
import {
  WatchedMoviesPage
} from '../watched-movies/watched-movies';
import {
  DbProvider
} from '../../providers/db/db';
import {
  SignupPage
} from '../signup/signup';
import {
  LoginPage
} from '../login/login';



@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  public tabsPlacement: string;
  public tabsLayout: string;
  public signup: any = SignupPage;
  public login: any = LoginPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }
  }

}
