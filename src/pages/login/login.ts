
import { IonicPage, NavController, NavParams, Tabs, Events } from 'ionic-angular';
import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { Http, Headers } from '@angular/http';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { Loading } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { MovieProvider } from '../../providers/movie/movie';
import { SeenMoviesPage } from '../seen-movies/seen-movies';
import { TabsPage } from '../tabs/tabs';
import { DbProvider } from '../../providers/db/db';
import { LoggedInTabsPage } from '../logged-in-tabs/logged-in-tabs';
import { App } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {

  username: string;
  password: string;

  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingController: LoadingController,
    public movieProvider: MovieProvider,
    public dbProvider: DbProvider,
    public appCtrl: App,
    public events: Events
    
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    
  }

  login() {

    let loader = this.loadingController.create(
      {
        content: "Signing in..."
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
      'https://mighty-ravine-91955.herokuapp.com/auth/login',
      JSON.stringify(credentials),
      {headers: headers}).subscribe(async res => {
        

       
        this.dbProvider.init(res.json());
        this.events.subscribe("localsync:completed", () => {
          loader.dismiss();
          console.log("localsync should be complete")
          this.appCtrl.getRootNav().setRoot(LoggedInTabsPage);
        }) // have to wait for the data to be in sync, how else can we check the seen/watch list?
        
      
        })
       
  

  }

  launchSignup() {
    this.navCtrl.push(SignupPage);
  }

}
