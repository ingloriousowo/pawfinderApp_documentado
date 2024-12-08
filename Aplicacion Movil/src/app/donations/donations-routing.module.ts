import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationsPage } from './donations.page';

// Definimos las rutas para el módulo de donaciones
const routes: Routes = [
  {
    path: '',
    component: DonationsPage
  }
];

@NgModule({
  // Importamos el RouterModule y le pasamos nuestras rutas
  imports: [RouterModule.forChild(routes)],
  // Exportamos el RouterModule para que esté disponible en el módulo principal
  exports: [RouterModule],
})
export class DonationsPageRoutingModule {}
