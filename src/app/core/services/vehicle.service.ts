import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = 'https://67b85e2b699a8a7baef3cceb.mockapi.io/vehicles';
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  loading$ = this.loadingSubject.asObservable();
  vehicles$ = this.vehiclesSubject.asObservable();

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  fetchVehicles(): void {
    this.loadingSubject.next(true);

    this.http.get<Vehicle[]>(this.apiUrl).subscribe({
      next: (vehicles) =>
        this.vehiclesSubject.next(vehicles.sort((a, b) => a.name.localeCompare(b.name))),
      error: (error) => console.error('Error fetching vehicles:', error),
      complete: () => this.loadingSubject.next(false),
    });
  }

  addVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle).pipe(
      tap((newVehicle) => this.addVehicleToState(newVehicle)),
      catchError((error) => {
        console.error('Failed to add vehicle:', error);
        return throwError(() => error);
      }),
    );
  }
  private addVehicleToState(newVehicle: Vehicle) {
    const updatedVehicles = [...this.vehiclesSubject.value, newVehicle].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    this.vehiclesSubject.next(updatedVehicles);
  }
}
