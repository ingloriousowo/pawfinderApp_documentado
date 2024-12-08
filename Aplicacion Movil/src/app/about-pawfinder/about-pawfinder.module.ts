import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutPawfinderPageRoutingModule } from './about-pawfinder-routing.module';
import { AboutPawfinderPage } from './about-pawfinder.page';

@NgModule({
  // Importamos los módulos necesarios para esta página
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPawfinderPageRoutingModule
  ],
  // Declaramos el componente AboutPawfinderPage
  declarations: [AboutPawfinderPage]
})
export class AboutPawfinderPageModule {}
