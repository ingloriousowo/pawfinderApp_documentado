import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportLostComponent } from './report-lost.component';
import { ReportLostRoutingModule } from './report-lost-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ReportLostRoutingModule
  ],
  declarations: [ReportLostComponent]
})
export class ReportLostModule { }
