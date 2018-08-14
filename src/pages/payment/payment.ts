import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ModalOptions, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public items : Array<any> = [];
  private url = "http://appdemo.hakwonjigi.com/";

  private searchYear = 2018;
  private searchType = "edu"; // 기본 교육비 검색

  constructor(
    public navCtrl: NavController, 
    private http : HttpClient,
    private modalCtrl: ModalController,
    private alertCtrl : AlertController,
    public loadingCtrl : LoadingController
  ) {

  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      duration : 3000
    });
    
    loader.present();
  }

  ionViewWillEnter(){
    this.load();
  }

  load() : void{ 
    this.searchYear = this.getDateYear();
    
    this.search();
  }

  search() {
    this.items = [];

    let paymentUrl = "payment-retrieve.php?search_type=" + this.searchType + "&year=" + this.searchYear;

    this.http
    .get(this.url+paymentUrl)
    .subscribe((data : any) => {
      console.dir(data);
      this.items = data;
    },(error : any) => {
      console.dir(error);
    });
  }

  clickSeachPay(type, eduBtn, etcBtn) { 
    if (type == "edu") { 
      eduBtn.color = ""; 
      etcBtn.color = "light";
    } else {
      eduBtn.color = "light"; 
      etcBtn.color = "";
    }

    this.searchType = type;

    this.search();

     let alert = this.alertCtrl.create({
       title: type,
       subTitle: '교육비를 클릭하셨습니다.',
       buttons: ['확인', '취소']
     });

     alert.present();
  }
  
  openModal() {
    const payModalOptions : ModalOptions = {
      enableBackdropDismiss: false,
      showBackdrop: true
    };

    this.modalCtrl.create("ModalPage", {}, payModalOptions)
                  .present();
  }

  parseDate(str) {
    var y = str.substr(0,4),
    m = str.substr(4,2),
    d = str.substr(6,2);
    return y + "." + m + "." + d  ;
  }

  parseTitle(str) {
    // 기타 수납의 경우는 문자열로 구성되어있음
    if (isNaN(str))
      return str;

    var y = str.substr(0,4),
    m = str.substr(4,2);

    return y + "/" + m + "월분";
  }

  comma(num){
    var len, point, str; 
       
    num = num + ""; 
    point = num.length % 3 ;
    len = num.length; 
   
    str = num.substring(0, point); 
    while (point < len) { 
        if (str != "") str += ","; 
        str += num.substring(point, point + 3); 
        point += 3; 
    } 
     
    return str;
  }

  getDateYear() {
    return new Date().getFullYear();
  }

  bfYearSearch(year) {
    this.searchYear = parseInt(year) - 1;

    this.search();
  }
 
  afYearSearch(year) {
    this.searchYear = parseInt(year) + 1;

    this.search();
  }

}