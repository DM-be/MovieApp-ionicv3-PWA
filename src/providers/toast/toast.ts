import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Toast,
  ToastController
} from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {

  private queue: Toast[];


  constructor(public toastCtrl: ToastController) {
    this.queue = [];
  }

  private add(toast: Toast): void {
    this.queue.unshift(toast);
  }

  private remove(): void {
    this.queue.pop();
  }

  private first(): Toast {
    return this.queue[0];
  }

  private last(): Toast {
    return this.queue[this.queue.length - 1];
  }

  private size(): number {
    return this.queue.length;
  }

  addToastToQueue(movieTitle?: string, typeOfList?: string, friendName?: string, recommended?: boolean, friendInvite?: boolean): void {

    let message  = `${movieTitle} was added to your ${typeOfList}list`;
    if(recommended) {
      message = `${movieTitle} was recommended to you by ${friendName}`;
    }
    if(friendInvite) {
      message = `${friendName} has accepted your friend request`;
    }

    let toast = this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top'
    });
    this.add(toast);
    if(this.size() == 1) 
    {
      this.presentToast();
    }
  }

  async presentToast() {

    if (this.last()) {
      await this.last().present();
      this.last().onDidDismiss(async () => {
        this.remove();
        if(this.size() > 0)
        {
          this.presentToast();
        }
      })
    }


  }

  notifyToasts() {

  }









}
