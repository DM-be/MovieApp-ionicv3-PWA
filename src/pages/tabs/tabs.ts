import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { SeenMoviesPage } from '../seen-movies/seen-movies';
import { SuperTabs } from 'ionic2-super-tabs';
import { DiscoverPage } from '../discover/discover';
import { SocialPage } from '../social/social';


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
  page1: any = SeenMoviesPage;
  social: any = SocialPage;


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
   
    

    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }
  }

  ionViewDidLoad() {
    
    
  }

}
