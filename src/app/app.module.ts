import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

import { MovieProvider } from '../providers/movie/movie';
import { SeenMoviesPage } from '../pages/seen-movies/seen-movies';
import { TabsPage } from '../pages/tabs/tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Content } from 'ionic-angular/components/content/content';
import { DiscoverPage } from '../pages/discover/discover';
import { MovieDetailPage } from '../pages/movie-detail/movie-detail';
import { ImagePreload } from '../directives/imgpreload/imgpreload';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    SeenMoviesPage,
    TabsPage,
    DiscoverPage,
    MovieDetailPage,
    ImagePreload  
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    SeenMoviesPage,
    TabsPage,
    DiscoverPage,
    MovieDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MovieProvider, 
    

  ]
})
export class AppModule {}
