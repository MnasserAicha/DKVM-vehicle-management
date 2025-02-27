import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { VehicleCreationComponent } from '../vehicle-creation/vehicle-creation.component';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    VehicleCardComponent,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinner,
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css',
})
export class VehicleListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  private dialog = inject(MatDialog);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  isEmpty = false;

  displayedVehicles: Vehicle[] = [];
  pageSize = 12;
  currentPage = 0;
  totalVehicles = 0;
  vehicles: Vehicle[] = [];
  vehicles$ = this.vehicleService.vehicles$;
  isloading$ = this.vehicleService.loading$;
  ngOnInit() {
    this.vehicles$.pipe(takeUntil(this.destroy$)).subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.updateDisplayedVehicles();
    });

    this.vehicleService.fetchVehicles();
  }

  updateDisplayedVehicles() {
    if (!this.vehicles || this.vehicles.length === 0) {
      this.displayedVehicles = [];
      return;
    }

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.vehicles.length);

    this.displayedVehicles = this.vehicles.slice(startIndex, endIndex);
  }

  ngAfterViewInit() {
    this.paginator?.page.pipe(takeUntil(this.destroy$)).subscribe((event: PageEvent) => {
      this.handlePageEvent(event);
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDisplayedVehicles();
  }

  openAddVehicleModal() {
    const dialogRef = this.dialog.open(VehicleCreationComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((newVehicle: Vehicle | null) => {
      if (newVehicle) {
        this.totalVehicles = this.vehicles.length;
        this.updateDisplayedVehicles();
      }
    });
  }

  openVehicleDetails(vehicle: Vehicle) {
    this.router.navigate(['/vehicles', vehicle.id]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
