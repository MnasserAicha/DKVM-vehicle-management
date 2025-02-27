import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicle-list/vehicle-list.component';
import { VehicleDetailsPageComponent } from './features/vehicle-details-page/vehicle-details-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/:id', component: VehicleDetailsPageComponent },
  { path: '**', redirectTo: 'vehicles' },
];
