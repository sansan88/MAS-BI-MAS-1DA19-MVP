import { PdfModalPageModule } from './../pdf-modal/pdf-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SignaturePage } from './signature.page';

const routes: Routes = [
  {
    path: '',
    component: SignaturePage
  }
];

@NgModule({
  declarations: [SignaturePage],
  imports: [
    CommonModule,
    FormsModule,
    

    PdfModalPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class SignaturePageModule {}
