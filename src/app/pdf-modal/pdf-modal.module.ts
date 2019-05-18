import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { PdfModalPage } from './pdf-modal.page';


@NgModule({
  declarations: [PdfModalPage],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents:[
    PdfModalPage
  ]
})
export class PdfModalPageModule {}
