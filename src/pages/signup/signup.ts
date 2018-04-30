import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, Events } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { HomePage } from '../home/home';
import { DbProvider } from '../../providers/db/db';
import { TabsPage } from '../tabs/tabs';
import { LoggedInTabsPage } from '../logged-in-tabs/logged-in-tabs';



/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public dbProvider: DbProvider,
    public appCtrl: App,
    public loadingController: LoadingController,
    public events: Events) {
  }

  register() {
    let headers = new Headers();
      headers.append('Content-Type', 'application/json');
 
      let user = {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      };

      let loader = this.loadingController.create(
        {
          content: "Signing up..."
        }
      )

      loader.present();
      
 
      this.http.post('https://mighty-ravine-91955.herokuapp.com/auth/register', JSON.stringify(user), {headers: headers})
        .subscribe(res => {
         // this.todoService.init(res.json());
          
         // this.navCtrl.setRoot(TabsPage);
          this.dbProvider.init(res.json())
          //console.log(res.json())o
          
            this.events.subscribe("sharedsync:completed", () => {
                this.dbProvider.register(user);
                this.appCtrl.getRootNav().setRoot(LoggedInTabsPage);
                loader.dismiss();
            
          }) // have to wait for the shared DB to be in sync to register new users

        
          

        }, (err) => {
          console.log(err);
        });
 
  }

  

}
