import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoggedInTabsPage } from './logged-in-tabs';

@NgModule({
  declarations: [
    LoggedInTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoggedInTabsPage),
  ],
})
export class LoggedInTabsPageModule {}
