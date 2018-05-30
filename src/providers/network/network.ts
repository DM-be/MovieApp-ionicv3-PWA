import { Network } from '@ionic-native/network';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {
  previousStatus;

  constructor(public network: Network, public events: Events) {
    
    this.previousStatus = ConnectionStatusEnum.Online;
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        if (this.previousStatus === ConnectionStatusEnum.Online) {
            this.events.publish('network:offline');
        }
        this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
        if (this.previousStatus === ConnectionStatusEnum.Offline) {
            this.events.publish('network:online');
        }
        this.previousStatus = ConnectionStatusEnum.Online;
    });
}



}
