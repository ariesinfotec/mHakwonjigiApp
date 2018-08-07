import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public items : Array<any> = [];
  private url = "http://appdemo.hakwonjigi.com/"

  constructor(
    public navCtrl: NavController, 
    private http : HttpClient
  ) {

  }

  ionViewWillEnter(){
    this.load();
  }

  load() : void{
    this.http
    .get(this.url+'payment-retrieve.php')
    .subscribe((data : any) => {
      console.dir(data);
      this.items = data;
    },(error : any) => {
      console.dir(error);
    });
  }

}