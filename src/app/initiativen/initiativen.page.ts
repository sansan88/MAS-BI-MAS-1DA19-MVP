import {
  DomSanitizer
} from '@angular/platform-browser';
import {
  PdfModalPage
} from './../pdf-modal/pdf-modal.page';
import {
  Router
} from '@angular/router';
import {
  ApiService
} from './../api.service';
import {
  Component,
  OnInit
} from '@angular/core';

import {
  Plugins
} from '@capacitor/core';
import {
  AlertController,
  ToastController,
  ModalController
} from '@ionic/angular';


const {
  Browser,
  Storage
} = Plugins;


@Component({
  selector: 'app-initiativen',
  templateUrl: './initiativen.page.html',
  styleUrls: ['./initiativen.page.scss'],
})
export class InitiativenPage implements OnInit {
  initiativen: any[];
  constructor(private api: ApiService,
    public router: Router,
    public toastController: ToastController,
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    public alertController: AlertController) {

    this.initiativen = [];
    this.loadInitiativen().subscribe((data) => {
      this.initiativen = data["initiativen"];
    }, (error) => {
      console.error(error);
    });
  }

  ngOnInit() {
    
  }
  doRefresh(event) {
    this.initiativen = [];
    this.loadInitiativen().subscribe((data) => {
      this.initiativen = data["initiativen"];

      event.target.complete();

    }, (error) => {
      console.error(error);

      event.target.complete();
    });
  }

  async openBrowser(url) {
    await Browser.open({
      url: url, //<string>this.sanitizer.bypassSecurityTrustUrl(url)
      presentationStyle: "popover",
      windowName: "_blank"
    });
  }
  loadInitiativen() {
    return this.api.getInitiativen();
  }

  support(initiative) {

    this.presentAlertConfirm(initiative);

  }

  async presentEIDAlert() {
    const alert = await this.alertController.create({
      header: 'Unterschrift',
      subHeader: 'eID+ nicht vorhanden',
      message: 'Bitte zuerst die eID+ verknüpfen.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/app/profile');
        }
      }]
    });

    await alert.present();
  }

  async presentAlertConfirm(initiative) {

    Storage.get({
      key: 'eIDUser'
    }).then(data => {

      if (!JSON.parse(data.value)) {

        this.presentEIDAlert();

      } else {
        this.alertController.create({
          header: initiative.titel,
          message: 'Möchtest du die Initiative wirklich unterstützen?',
          buttons: [{
            text: 'nein',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Ja, unterstützen',
            handler: () => {
              console.log('Confirm Okay');
              this.presentToast('vielen Dank!');

              this.api.supportInitiative(initiative,
                JSON.parse(data.value)
              ).subscribe((pdf: any) => {

                var url = JSON.parse(pdf).url;

                //console.log(url);
                //console.log(this.sanitizer.bypassSecurityTrustUrl(url));

                //this.presentModal(url);
                //this.openBrowser(url);

                /*
                         var binary = '';
                         var bytes = new Uint8Array(pdf);
                         var len = bytes.byteLength;
                         for (var i = 0; i < len; i++) {
                           binary += String.fromCharCode(bytes[i]);
                         }
                         //var blob = new Blob([pdf], {
                         //  type: 'application/pdf'
                         //});
                         //var url = URL.createObjectURL(blob);
                         
                         console.log("data:application/pdf;base64," + window.btoa(binary));
                         var url = "data:application/pdf;base64," + window.btoa(binary);
                         */

              }, (error) => {
                console.error(error);
              });

            }
          }]
        }).then(alert => {

          alert.present();
        });

      }
    }, error => {
      this.presentEIDAlert();

    });

  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'primary',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async presentModal(url) {
    const modal = await this.modalController.create({
      component: PdfModalPage,
      componentProps: {
        url: url
      }
    });
    return await modal.present();
  }

}