import {
  PdfModalPage
} from '../pdf-modal/pdf-modal.page';
import {
  Router
} from '@angular/router';

import {
  ModalController,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular';
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
const {
  Browser,
  Storage
} = Plugins;



@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage {
  documents: any[];
  constructor(
    private api: ApiService,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router,
    public alertController: AlertController) {

    this.documents = [];

    Storage.get({
      key: 'eIDUser'
    }).then(data => {

      if (!JSON.parse(data.value)) {
        //      this.presentEIDAlert();
      } else {


        this.loadingController.create({
          spinner: "bubbles",
          duration: 5000,
          message: 'Lade Dokumente...',
          translucent: true,
          //  cssClass: 'custom-class custom-loading'
        }).then(loading => {
          loading.present();


          this.loadDocuments(JSON.parse(data.value)).subscribe((data: any) => {
            JSON.parse(data).documents.forEach(document => {
              document[0].nameShort = document[0].name.split('/')[1].split('.')[0];
              this.documents.push(document[0]);
            })

            loading.dismiss();

          }, (error) => {
            loading.dismiss();
            console.error(error);
          });

        });

      }
    }, error => {
      this.presentEIDAlert();
    });
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
  loadInitiativen() {
    return this.api.getInitiativen();
  }

  loadDocuments(user) {
    return this.api.getDocuments(user);
  }

  downloadDocument(document) {
    console.log(document);
    this.api.getSignedUrl(document.name).subscribe((signedUrl: any) => {
      this.openBrowser(JSON.parse(signedUrl).url);
    });
  }

  openDocument(document) {

    this.loadingController.create({
      spinner: "bubbles",
      duration: 5000,
      message: 'Lade Dokument...',
      translucent: true,
      //  cssClass: 'custom-class custom-loading'
    }).then(loading => {
      loading.present();


      console.log(document);
      this.api.getSignedUrl(document.name).subscribe((signedUrl: any) => {
        loading.dismiss();
        this.presentModal(JSON.parse(signedUrl).url, document.nameShort);
      }, error => {
        loading.dismiss();
      });
    });
  }

  upload(event) {

    /*console.log("upload file" + event.srcElement.value);
    console.log("" + event.srcElement.files[0]);*/

    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var contents = event.target["result"];        
      }
      reader.onloadend = function(event){
        var contents2 = event.target["result"];        
      }
      reader.readAsDataURL(file);

    } else {
      alert("Failed to load file");
    }

  }


  async openBrowser(url) {
    await Browser.open({
      url: url,
      presentationStyle: "popover",
      windowName: "_blank"
    });
  }

  async presentModal(url,titel) {
    const modal = await this.modalController.create({
      component: PdfModalPage,
      componentProps: {
        url: url,
        titel: titel
      }
    });
    return await modal.present();
  }

  delete(document) {

    this.api.deletePDF(document).subscribe(() => {

      this.toastController.create({
        message: "Dokument gelöscht",
        color: 'danger',
        position: 'bottom',
        duration: 3000
      }).then(toast => {
        toast.present();

        this.doRefresh({});
      });

    });
  }

  doRefresh(event) {
    this.documents = [];

    Storage.get({
      key: 'eIDUser'
    }).then(data => {

      if (!JSON.parse(data.value)) {
        this.presentEIDAlert();
      } else {


        this.loadingController.create({
          spinner: "bubbles",
          duration: 5000,
          message: 'Lade Dokumente...',
          translucent: true,
          //  cssClass: 'custom-class custom-loading'
        }).then(loading => {
          loading.present();

          this.loadDocuments(JSON.parse(data.value)).subscribe((data: any) => {
            JSON.parse(data).documents.forEach(document => {
              document[0].nameShort = document[0].name.split('/')[1].split('.')[0];
              this.documents.push(document[0]);
            })
            loading.dismiss();
            if (event && event.target){
              event.target.complete()
            }
          }, (error) => {
            if (event && event.target){
              event.target.complete()
            }
            loading.dismiss();

            console.error(error);
          });
        });
      }
    }, error => {
      this.presentEIDAlert();
    });
  }
}



/*
async presentLoadingWithOptions() {
  const loading = await this.loadingController.create({
    spinner: "bubbles",
    duration: 5000,
    message: 'Please wait...',
    translucent: true,
    //  cssClass: 'custom-class custom-loading'
  });
  return await loading.present();
}*/