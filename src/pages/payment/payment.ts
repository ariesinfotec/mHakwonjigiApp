import { Component } from '@angular/core';
import { Modal, NavController, AlertController, ModalController, ModalOptions, LoadingController } from 'ionic-angular';
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

  /*
    로딩 테스트.
  */
  presentLoading() {
    const loader = this.loadingCtrl.create({
      duration : 3000
    });
    
    loader.present();
  }

  ionViewWillEnter(){
    this.load();
  }

  /*
    페이지 로드 시 검색 년월 현재 년으로 변경 후 조회
  */
  load() : void{ 
    this.searchYear = new Date().getFullYear();
    
    this.search();
  }

  /*
    조회
    TODO : POST 방식으로 변경 예정
           데이터가 없을 시 데이터 없음 처리 추가 예정
  */
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

  /*
    교육비, 기타 버튼 클릭 시
    버튼 클릭 색상 변경 및 조회

    type : edu, etc (교육비, 기타)
    eduBtn : 교육비버튼 선언
    etcBtn : 기타 버튼 선언
  */
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

    /*
      alert 테스트중.
    */
     let alert = this.alertCtrl.create({
       title: type,
       subTitle: '교육비를 클릭하셨습니다.',
       buttons: ['확인', '취소']
     });

     alert.present();
  }
  
  /*
    모달 테스트중..
  */
  openModal() {
    const payModalOptions : ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: "select-modal" 
    };

    const myModal: Modal = this.modalCtrl.create("ModalPage", {}, payModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
        console.log(data);
    })

  }

  /*
    20180101 형식을 2018.01.01 형식 변경
    str : 년월일 (20180101)
  */
  parseDate(str) {
    var y = str.substr(0,4),
    m = str.substr(4,2),
    d = str.substr(6,2);
    return y + "." + m + "." + d  ;
  }

  /*
    수납 전용
    교육비수납, 기타수납으로
    교육비수납은 201801 -> 2018/01월분
    기타수납은 수련복금액 -> 수련복금액

    str : Title 문자
  */
  parseTitle(str) {
    // 기타 수납의 경우는 문자열로 구성되어있음
    if (isNaN(str))
      return str;

    var y = str.substr(0,4),
    m = str.substr(4,2);

    return y + "/" + m + "월분";
  }

  /*
    숫자포맷 콤마 찍기
    num : 금액 
    {{ comma(data.amount) }}
  */
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


  /*
    이전, 다음월 조회 (화살표 버튼 클릭)
    year : 년도 (화면표시년도)
    type : B - 이전월 / A - 다음월
  */
  yearSearch(year, type) {
    if (type == 'B') {
      this.searchYear = parseInt(year) - 1;
    } else if (type == 'A') {
      this.searchYear = parseInt(year) + 1;
    }

    this.search();
  }
 
}