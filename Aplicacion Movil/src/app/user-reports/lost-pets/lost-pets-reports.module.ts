import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LostPetsReportsComponent } from './lost-pets-reports.component';

@NgModule({
  declarations: [LostPetsReportsComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LostPetsReportsComponent
      }
    ])
  ]
})
export class LostPetReportsModule { }
