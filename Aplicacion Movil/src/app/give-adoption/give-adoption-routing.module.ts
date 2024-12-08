import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GiveAdoptionComponent } from './give-adoption.component';

const routes: Routes = [
  {
    path: '',
    component: GiveAdoptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiveAdoptionRoutingModule {}
