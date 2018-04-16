import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { SeenMoviesPage } from '../seen-movies/seen-movies';
import { SuperTabs } from 'ionic2-super-tabs';
import { DiscoverPage } from '../discover/discover';
import { SocialPage } from '../social/social';
import { RecommendationsPage } from '../recommendations/recommendations';
import { WatchedMoviesPage } from '../watched-movies/watched-movies';
import { DbProvider } from '../../providers/db/db';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';


/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  
  tabsPlacement: string;
  tabsLayout: string;

  discover: any = DiscoverPage;
  seen: any = SeenMoviesPage;
  watch: any = WatchedMoviesPage;
  social: any = SocialPage;
  recommendation: any = RecommendationsPage;
  loggedIn: boolean;

  signup: any = SignupPage;
  login: any = LoginPage;

  tabBarElement;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public dbProvider: DbProvider) {
   
    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }

    this.loggedIn = this.dbProvider.isloggedIn();
    this.tabBarElement = document.querySelector('#notLoggedIntabs');
  }

  ionViewDidLoad() {
    this.loggedIn = this.dbProvider.isloggedIn();
  }

  ionViewWillEnter() {
    this.loggedIn = this.dbProvider.isloggedIn();
    console.log(this.loggedIn)
    if(this.loggedIn)
    {
     // this.tabBarElement.style.display = 'none';
    }
  }

  ionViewDidEnter()
  {
    this.loggedIn = this.dbProvider.isloggedIn();
  }

}
