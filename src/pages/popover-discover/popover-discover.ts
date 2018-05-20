import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';

/**
 * Generated class for the PopoverDiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popover-discover',
  templateUrl: 'popover-discover.html',
})
export class PopoverDiscoverPage {

  // private searchByKeyword: boolean;
  // private searchByTitle: boolean;
  public searchingBy: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public movieProvider: MovieProvider) {
    this.searchingBy = this.movieProvider.getSearchingBy();
    console.log(this.searchingBy);
  }

  ionViewDidLoad() {
    
    // this.searchByKeyword = this.movieProvider.getSearchByKeyword();
    // this.searchByTitle = this.movieProvider.getSearchByTitle();


  }

  toggleKeyword() {
    this.searchingBy = 'getKeyword';
    this.movieProvider.setSearchingBy('getKeyword');
    // this.searchByKeyword = true;
    // this.searchByTitle = false;
    // this.movieProvider.setSearchByTitle(this.searchByTitle)
    // this.movieProvider.setSearchByKeyword(this.searchByKeyword);
  }

  toggleTitle() {
    this.searchingBy = 'title';
    this.movieProvider.setSearchingBy('title');

    // this.searchByTitle = true;
    // this.searchByKeyword = false;
    // this.movieProvider.setSearchByTitle(this.searchByTitle);
    // this.movieProvider.setSearchByKeyword(this.searchByKeyword);
  }

  

}
