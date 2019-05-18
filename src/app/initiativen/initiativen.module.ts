import { PdfModalPageModule } from './../pdf-modal/pdf-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InitiativenPage } from './initiativen.page';

const routes: Routes = [
  {
    path: '',
    component: InitiativenPage
  }
];

@NgModule({
  declarations: [InitiativenPage ],
  imports: [
    CommonModule,
    FormsModule,
    PdfModalPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class InitiativenPageModule {}
