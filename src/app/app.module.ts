import { AutoCompleteModule } from 'ionic2-auto-complete';
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule } from "@angular/forms";
import { IonicImageLoader } from 'ionic-image-loader';
import { LazyLoadImageModule } from 'ng-lazyload-image';

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
import { SocialPage } from '../pages/social/social';
import { SocialProvider } from '../providers/social/social';
import { DbProvider } from '../providers/db/db';
import { AddFriendPage } from '../pages/add-friend/add-friend';
import { RecommendationsPage } from '../pages/recommendations/recommendations';
import { WatchedMoviesPage } from '../pages/watched-movies/watched-movies';
import { LoggedInTabsPage } from '../pages/logged-in-tabs/logged-in-tabs';
import { FilterProvider } from '../providers/filter/filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
    ImagePreload,
    SocialPage,
    AddFriendPage,
    RecommendationsPage,
    WatchedMoviesPage,
    LoggedInTabsPage
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AutoCompleteModule,
    Ng2CompleterModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    IonicImageLoader.forRoot(),
    IonicImageLoader,
    LazyLoadImageModule,
    BrowserAnimationsModule
    
    
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
    MovieDetailPage,
    SocialPage,
    AddFriendPage,
    RecommendationsPage,
    WatchedMoviesPage,
    LoggedInTabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MovieProvider,
    SocialProvider,
    DbProvider,
    FilterProvider, 
    

  ]
})
export class AppModule {}
