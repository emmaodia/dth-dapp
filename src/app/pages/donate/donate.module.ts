import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DonatePage } from './donate.page';

const routes: Routes = [
  {
    path: '',
    component: DonatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DonatePage]
})
export class DonatePageModule {}
