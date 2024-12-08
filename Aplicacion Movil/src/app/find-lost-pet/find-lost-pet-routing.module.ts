import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FindLostPetComponent } from './find-lost-pet.component';

const routes: Routes = [
  {
    path: '',
    component: FindLostPetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindLostPetRoutingModule {}
