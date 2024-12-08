import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

// Importamos el módulo de enrutamiento que acabamos de crear
import { AdoptPetRoutingModule } from './adopt-pet-routing.module';

// Importamos el componente AdoptPetComponent
import { AdoptPetComponent } from './adopt-pet.component';

@NgModule({
  // Importamos los módulos necesarios
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptPetRoutingModule
  ],
  // Declaramos el componente AdoptPetComponent
  declarations: [AdoptPetComponent]
})
export class AdoptPetModule { }
