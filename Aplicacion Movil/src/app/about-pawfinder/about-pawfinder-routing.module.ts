import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPawfinderPage } from './about-pawfinder.page';

// Definimos las rutas para el módulo "Más sobre PawFinder"
const routes: Routes = [
  {
    path: '',
    component: AboutPawfinderPage
  }
];

@NgModule({
  // Importamos el RouterModule y le pasamos nuestras rutas
  imports: [RouterModule.forChild(routes)],
  // Exportamos el RouterModule para que esté disponible en el módulo principal
  exports: [RouterModule],
})
export class AboutPawfinderPageRoutingModule {}
