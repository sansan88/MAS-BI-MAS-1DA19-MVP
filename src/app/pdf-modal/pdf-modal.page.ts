import {
  DomSanitizer
} from '@angular/platform-browser';
import {
  ModalController,
  NavParams
} from '@ionic/angular';
import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.page.html',
  styleUrls: ['./pdf-modal.page.scss'],
})
export class PdfModalPage {
  public url: string;
  public titel: string;
  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private navParams: NavParams

  ) {

  }

  ionViewWillEnter() {

    if (this.navParams.get('url')) {
      this.url = this.navParams.get('url');
      this.titel = this.navParams.get('titel');
    } else {
      this.url = "";
    }
  }
  async myDismiss() {

    await this.modalController.dismiss();
  }
}