import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportLostComponent } from './report-lost.component';

const routes: Routes = [
  {
    path: '',
    component: ReportLostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportLostRoutingModule {}
