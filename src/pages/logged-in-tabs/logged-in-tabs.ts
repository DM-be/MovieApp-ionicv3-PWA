import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, Tab, PopoverController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { SeenMoviesPage } from '../seen-movies/seen-movies';
import { WatchedMoviesPage } from '../watched-movies/watched-movies';
import { SocialPage } from '../social/social';
import { RecommendationsPage } from '../recommendations/recommendations';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';
import { PopoverDiscoverPage } from '../popover-discover/popover-discover';
/**
 * Generated class for the LoggedInTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-logged-in-tabs',
  templateUrl: 'logged-in-tabs.html',
})
export class LoggedInTabsPage {


  tabsPlacement: string;
  tabsLayout: string;
  toggled = false;

  searchBarPlaceholder = "Discover new movies"
  selectedTabPage: string = "DiscoverPage"

  searchTerm: string = '';
  searchControl: FormControl

  discover: any = DiscoverPage;
  seen: any = SeenMoviesPage;
  watch: any = WatchedMoviesPage;
  social: any = SocialPage;
  recommendation: any = RecommendationsPage;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public events: Events, 
  public popoverCtrl: PopoverController) {
    if (!this.platform.is('mobile')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }
    this.searchControl = new FormControl();
  }

  toggleSearch() {
    this.toggled = this.toggled ? false : true;
}

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad LoggedInTabsPage');


    this.searchControl.valueChanges.debounceTime(1000).subscribe(search => {
      if(this.selectedTabPage == "DiscoverPage" && search !== "")
      {
        this.events.publish("discover:updated", search)
      }
      else{

      }


      
      
  });

  }

  onInput(event) {
    console.log(event)
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverDiscoverPage);
    popover.present({
      ev: event
    });
  }

  tabSelected(event) {
    this.selectedTabPage = event.root.name
    this.searchTerm = "";
    this.toggled = false;
    console.log(this.selectedTabPage)
    if(this.selectedTabPage == "SeenMoviesPage"){
      
    }
    switch(this.selectedTabPage) {
      case "SeenMoviesPage": this.searchBarPlaceholder = "Filter your seen movies";
      break;
      case "DiscoverPage": this.searchBarPlaceholder = "Discover new movies";
      break;
      case "RecommendationsPage": this.searchBarPlaceholder = "Filter your recommendations";
      break;
      case "WatchedMoviesPage": this.searchBarPlaceholder = "Filter your watched movies";
      break;
      case "SocialPage": this.searchBarPlaceholder = "Look for a friend";
      break;

    }

    
  }
  
  
}
