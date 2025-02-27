import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vehicle-creation.component.html',
  styleUrls: ['./vehicle-creation.component.scss'],
})
export class VehicleCreationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private dialogRef = inject(MatDialogRef<VehicleCreationComponent>);
  private toastService = inject(ToastService);
  isSubmitting = false;

  fuelTypes: string[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  vehicleForm!: FormGroup;

  ngOnInit() {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      model: ['', Validators.required],
      fuel: ['', Validators.required],
      type: ['', Validators.required],
      vin: [
        '',
        [Validators.required, Validators.minLength(17), Validators.pattern(/^[A-Z0-9]{17}$/)],
      ],
      color: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      mileage: ['', [Validators.min(0)]],
    });
  }

  submit() {
    if (this.vehicleForm.invalid) return;
    this.isSubmitting = true;
    this.vehicleService
      .addVehicle(this.vehicleForm.value)
      .pipe(
        tap((newVehicle) => {
          this.toastService.showToast('Vehicle added successfully!', 'success');
          this.dialogRef.close(newVehicle);
        }),
        catchError((error) => {
          this.toastService.showToast('Failed to add vehicle. Please try again.', 'error');
          return throwError(() => error);
        }),
        finalize(() => (this.isSubmitting = false)),
      )
      .subscribe();
  }

  close() {
    this.dialogRef.close(false);
  }
}
