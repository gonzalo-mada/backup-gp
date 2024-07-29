import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ErrorComponent } from '../pages/error/error.component';
import { SessionComponent } from '../pages/session/session.component';
import { MaintenanceComponent } from '../pages/maintenance/maintenance.component';
import { DevelopComponent } from '../pages/develop/develop.component';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  { path: 'session', component: SessionComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'develop', component: DevelopComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled' })],
  exports: [RouterModule],
})
export class BaseRoutingModule {}
