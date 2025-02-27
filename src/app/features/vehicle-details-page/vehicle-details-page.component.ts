import { Component, inject, OnInit } from '@angular/core';
import { Vehicle } from '../../core/models/vehicle.model';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { catchError, of, switchMap, take } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vehicle-details-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner, MatIconModule],
  templateUrl: './vehicle-details-page.component.html',
  styleUrl: './vehicle-details-page.component.css',
})
export class VehicleDetailsPageComponent {
  vehicle: Vehicle | null = null;
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  loading: boolean = true;

  constructor() {
    this.loadVehicle();
  }

  public loadVehicle(): void {
    this.loading = true;

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const vehicleId = params.get('id');
          if (!vehicleId) return of(null);
          return this.vehicleService.getVehicleById(vehicleId).pipe(
            take(1),
            catchError((error) => {
              console.error('Error fetching vehicle:', error);
              return of(null);
            }),
          );
        }),
      )
      .subscribe((vehicle) => {
        this.vehicle = vehicle;
        this.loading = false;
      });
  }
}
