import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { DbProvider } from '../../providers/db/db';

/**
 * Generated class for the MovieDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-movie-detail',
  templateUrl: 'movie-detail.html',
})
export class MovieDetailPage {

  username: any;

  movie: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public movieProvider: MovieProvider, public alertCtrl: AlertController
  , public dbProvider: DbProvider) {
  this.movie = this.navParams.get("movie")
  this.username = this.dbProvider.getUser();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovieDetailPage');
    //let movie = this.navParams.get("movie")
 //   console.log(movie)
   // this.movieProvider.addMovie("seen", movie)
   // this.movieProvider.getMovies("seen").then(
  //    data => console.log(data)
   // )
    
  }

  async recommendMovie() {
    let alert = this.alertCtrl.create();

    let friends = await this.dbProvider.getFriends(this.username);
    friends.forEach(friend => {
      alert.addInput({
        type: 'checkbox',
        label: friend,
        value: friend,
    });
      
    });

    alert.setTitle('which friends would like this movie?');

    
    alert.addButton('Cancel');
    alert.addButton({
      text: 'RECOMMEND',
      handler: (data: any) => {
          console.log('Checkbox data:', data);
          // handle the recommending to the db

          data.forEach(friend => {
            this.dbProvider.addRecommendation(this.movie, friend);
          });
          

         // this.testCheckboxOpen = false;
        //  this.testCheckboxResult = data;
      }
    });

    alert.present();
  }

}
