import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GiveAdoptionComponent } from './give-adoption.component';
import { GiveAdoptionRoutingModule } from './give-adoption-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GiveAdoptionRoutingModule
  ],
  declarations: [GiveAdoptionComponent]
})
export class GiveAdoptionModule { }
