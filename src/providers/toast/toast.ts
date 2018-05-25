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

  addToastToQueue(movieTitle: string, typeOfList: string): void {
    let toast = this.toastCtrl.create({
      message: `${movieTitle} was added to your ${typeOfList}list`,
      duration: 2500,
      position: 'top'
    });
    this.add(toast);
  }

  async presentToast() {

    if (this.size() > 0) {
      await this.last().present();
      this.last().onDidDismiss(() => {
        this.remove();
        this.presentToast();
      })
    }


  }

  notifyToasts() {

  }









}
