import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DonationsPageRoutingModule } from './donations-routing.module';
import { DonationsPage } from './donations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  // Aseguramos que FormsModule está importado
    IonicModule,
    DonationsPageRoutingModule
  ],
  declarations: [DonationsPage]
})
export class DonationsPageModule {}
