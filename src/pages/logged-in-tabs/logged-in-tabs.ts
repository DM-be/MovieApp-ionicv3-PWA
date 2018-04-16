import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { SeenMoviesPage } from '../seen-movies/seen-movies';
import { WatchedMoviesPage } from '../watched-movies/watched-movies';
import { SocialPage } from '../social/social';
import { RecommendationsPage } from '../recommendations/recommendations';

/**
 * Generated class for the LoggedInTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logged-in-tabs',
  templateUrl: 'logged-in-tabs.html',
})
export class LoggedInTabsPage {


  tabsPlacement: string;
  tabsLayout: string;

  discover: any = DiscoverPage;
  seen: any = SeenMoviesPage;
  watch: any = WatchedMoviesPage;
  social: any = SocialPage;
  recommendation: any = RecommendationsPage;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoggedInTabsPage');
  }

}
