import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdoptionReportsComponent } from './adoption-reports.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdoptionReportsComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdoptionReportsComponent
      }
    ])
  ]
})
export class AdoptionReportsModule { }
