import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importamos el componente AdoptPetComponent
import { AdoptPetComponent } from './adopt-pet.component';

// Definimos las rutas para el módulo de adopción de mascotas
const routes: Routes = [
  {
    path: '',
    component: AdoptPetComponent
  }
];

@NgModule({
  // Importamos el RouterModule y le pasamos nuestras rutas
  imports: [RouterModule.forChild(routes)],
  // Exportamos el RouterModule para que esté disponible en el módulo principal
  exports: [RouterModule],
})
export class AdoptPetRoutingModule { }
