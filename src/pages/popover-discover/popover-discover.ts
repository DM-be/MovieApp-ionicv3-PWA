import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';


@Component({
  selector: 'page-popover-discover',
  templateUrl: 'popover-discover.html',
})
export class PopoverDiscoverPage {

  public searchingBy: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public movieProvider: MovieProvider) {
    this.searchingBy = this.movieProvider.getSearchingBy();
  }

  toggleKeyword() {
    this.searchingBy = 'getKeyword';
    this.movieProvider.setSearchingBy('getKeyword');
  }

  toggleTitle() {
    this.searchingBy = 'title';
    this.movieProvider.setSearchingBy('title');
  }

}
