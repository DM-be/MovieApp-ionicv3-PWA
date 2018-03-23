import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoginPage } from '../login/login';
import { MovieProvider } from '../../providers/movie/movie';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  foundMovies: any;
  firstLoaded: boolean = true;


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public movieProvider: MovieProvider ) {

  }

  ionViewDidLoad(){
    if(this.firstLoaded)
    {
      this.getMostRecentMovies();
    }
 
  }

  getMostRecentMovies() {
    // find most recent movies and set foundMovies to this --> loop over them and display
  }

  findMovies() {
    // find by title
    // update foundMovies to this
  }

  discoverMovies() 
  {
    // discover, api has discover feature
    // update foundMovies to this
  }
 
  logout(){
    this.movieProvider.logout();
    this.foundMovies = null;
    this.navCtrl.setRoot(LoginPage);
  }
  
 
  showDetails() 
  {
    // show details of a movie

  }

  addToList(type: string, movie: any)
  {
    // add to seen movie list, based on type!
    this.movieProvider.addMovie(type, movie);
  }
 
  

}
