import { DbProvider } from './../../providers/db/db';
import { MovieProvider } from './../../providers/movie/movie';
import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Events,
  Tab,
  PopoverController
} from 'ionic-angular';
import {
  DiscoverPage
} from '../discover/discover';
import {
  SeenMoviesPage
} from '../seen-movies/seen-movies';
import {
  WatchedMoviesPage
} from '../watched-movies/watched-movies';
import {
  SocialPage
} from '../social/social';
import {
  RecommendationsPage
} from '../recommendations/recommendations';
import {
  FormControl
} from '@angular/forms';
import 'rxjs/add/operator/map';
import {
  PopoverDiscoverPage
} from '../popover-discover/popover-discover';
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


  public tabsPlacement: string;
  public tabsLayout: string;
  public toggled = false;

  public searchBarPlaceholder = "Discover new movies"
  public selectedTabPage: string = "DiscoverPage"

  public searchTerm: string = '';
  public searchControl: FormControl

  public discover: any = DiscoverPage;
  public seen: any = SeenMoviesPage;
  public watch: any = WatchedMoviesPage;
  public social: any = SocialPage;
  public recommendation: any = RecommendationsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public events: Events,
    public popoverCtrl: PopoverController, public dbProvider: DbProvider) {
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

    this.searchControl.valueChanges.debounceTime(1200).subscribe(search => {
      if (this.selectedTabPage == "DiscoverPage" && search !== "") {
        this.events.publish("discover:updated", search)
      } else if (this.selectedTabPage == "SeenMoviesPage") {
        if (search == "") {
          this.events.publish("seen:empty");
        } else {
          this.events.publish("seen:updated", search);
        }
      } else if (this.selectedTabPage == "WatchedMoviesPage") {
        if (search == "") {
          this.events.publish("watch:empty");
        } else {
          this.events.publish("watch:updated", search);
        }
      } else if (this.selectedTabPage == "RecommendationsPage") {
        if (search == "") {
          this.events.publish("recommendations:empty");
        } else {
          this.events.publish("recommendations:updated", search);
        }
      } else if (this.selectedTabPage == "SocialPage") {
        if (search == "") {
          this.events.publish("social:empty");
        } else {
          this.events.publish("social:updated", search);
        }
      }


    });

  }

  seenSelected() {
    // seen tab has been selected, reset the seen movies to prevent loading alot of movies
    console.log("seen selected");
   this.dbProvider.setCounter("seen", 20);
   this.dbProvider.setMoviesInView("seen");
   this.events.publish("selected:clicked");
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
    switch (this.selectedTabPage) {
      case "SeenMoviesPage":
        this.searchBarPlaceholder = "Filter seen movies";
        break;
      case "DiscoverPage":
        this.searchBarPlaceholder = "Discover new movies";
        break;
      case "RecommendationsPage":
        this.searchBarPlaceholder = "Filter recommendations";
        break;
      case "WatchedMoviesPage":
        this.searchBarPlaceholder = "Filter movies to watch";
        break;
      case "SocialPage":
        this.searchBarPlaceholder = "Find a friend";
        break;

    }


  }


}
