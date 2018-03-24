import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http, Headers } from '@angular/http';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { Loading } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { MovieProvider } from '../../providers/movie/movie';
import { SeenMoviesPage } from '../seen-movies/seen-movies';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;

  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingController: LoadingController,
    public movieProvider: MovieProvider
    
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    
  }

  login() {

    let loader = this.loadingController.create(
      {
        content: "aan het laden efkes geduld"
      }
    )
    loader.present();


    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    let credentials = {
      username: this.username,
      password: this.password
    }

    this.http.post(
      'http://localhost:3000/auth/login',
      JSON.stringify(credentials),
      {headers: headers}).subscribe(res => {
        

       // this.todoService.init(res.json());
        this.movieProvider.init(res.json());
        
        loader.dismiss();
        this.navCtrl.setRoot(SeenMoviesPage);

      }, err => console.log(err));

  }

  launchSignup() {
    this.navCtrl.push(SignupPage);
  }

}
