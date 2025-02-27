import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCreationComponent } from './vehicle-creation.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';

describe('VehicleCreationComponent', () => {
  let component: VehicleCreationComponent;
  let fixture: ComponentFixture<VehicleCreationComponent>;
  let vehicleServiceMock: any;
  let dialogRefMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {
    vehicleServiceMock = {
      addVehicle: jest.fn(),
    };

    dialogRefMock = {
      close: jest.fn(),
    };

    toastServiceMock = {
      showToast: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        VehicleCreationComponent,
      ],
      providers: [
        FormBuilder,
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation errors when form fields are empty', () => {
    component.vehicleForm.markAllAsTouched();
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should call `addVehicle` and close dialog on successful submission', async () => {
    const mockVehicle = {
      id: '1',
      name: 'Test Car',
      manufacturer: 'Test Manufacturer',
      model: 'Model X',
      fuel: 'Electric',
      type: 'SUV',
      vin: '1HGCM82633A123456',
      color: 'Black',
      mileage: 10000,
    };

    component.vehicleForm.setValue({
      name: 'Test Car',
      manufacturer: 'Test Manufacturer',
      model: 'Model X',
      fuel: 'Electric',
      type: 'SUV',
      vin: '1HGCM82633A123456',
      color: 'Black',
      mileage: 10000,
    });

    vehicleServiceMock.addVehicle.mockReturnValue(of(mockVehicle));

    component.submit();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(vehicleServiceMock.addVehicle).toHaveBeenCalledWith(component.vehicleForm.value);
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockVehicle);
    expect(toastServiceMock.showToast).toHaveBeenCalledWith(
      'Vehicle added successfully!',
      'success',
    );
  });
});
