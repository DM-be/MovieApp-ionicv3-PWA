import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the RecommendationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recommendations',
  templateUrl: 'recommendations.html',
})
export class RecommendationsPage {

  recommendations = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DbProvider) {
    this.setup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecommendationsPage');
  }

  async setup() {
    let user = this.dbProvider.getUser();
    this.recommendations = await this.dbProvider.getRecommendations("dennistest");
  }


}
