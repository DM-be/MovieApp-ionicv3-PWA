import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { CacheService } from 'ionic-cache';
import { ImgCacheService } from '../../global';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, cache: CacheService, imgCacheService: ImgCacheService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
       // Set TTL to 12h
       cache.setDefaultTTL(60 * 60 * 12);
 
       // Keep our cached results when device is offline!
       cache.setOfflineInvalidate(false);

       imgCacheService.initImgCache()
       .subscribe((v) => console.log('init'), () => console.log('fail init'));
      
    });
  }
}

