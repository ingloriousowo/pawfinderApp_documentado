import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FindLostPetComponent } from './find-lost-pet.component';
import { FindLostPetRoutingModule } from './find-lost-pet-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindLostPetRoutingModule
  ],
  declarations: [FindLostPetComponent]
})
export class FindLostPetModule { }
