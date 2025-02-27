import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListComponent } from './vehicle-list.component';
import { of, BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-vehicle-card',
  template: '<div (click)="selectVehicle()">{{ vehicle?.name }}</div>',
  standalone: true,
})
class MockVehicleCardComponent {
  vehicle!: Vehicle;
  selectVehicle() {}
}

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let vehicleServiceMock: Partial<VehicleService>;
  let dialogMock: Partial<MatDialog>;
  let dialogRefMock: Partial<MatDialogRef<any>>;
  let vehiclesSubject: BehaviorSubject<Vehicle[]>;

  const activatedRouteMock = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Tesla Model 3',
      manufacturer: 'Tesla',
      model: 'Model 3',
      fuel: 'Electric',
      type: 'Sedan',
      vin: '11111',
      color: 'White',
      mileage: 10000,
    },
    {
      id: '2',
      name: 'BMW X5',
      manufacturer: 'BMW',
      model: 'X5',
      fuel: 'Diesel',
      type: 'SUV',
      vin: '22222',
      color: 'Black',
      mileage: 20000,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    vehiclesSubject = new BehaviorSubject<Vehicle[]>(mockVehicles);

    vehicleServiceMock = {
      vehicles$: vehiclesSubject.asObservable(),
      fetchVehicles: jest.fn(() => {
        vehiclesSubject.next(mockVehicles);
      }),
      getVehicleById: jest.fn().mockReturnValue(of(mockVehicles[0])),
      addVehicle: jest.fn().mockReturnValue(of(mockVehicles[0])),
    };

    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };

    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        NoopAnimationsModule,
        VehicleListComponent,
        MockVehicleCardComponent,
        MatPaginatorModule,
      ],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the displayed vehicles when a new page is selected', () => {
    const event: PageEvent = { pageSize: 1, pageIndex: 1, length: 2 } as any;
    component.handlePageEvent(event);
    expect(component.displayedVehicles.length).toBe(1);
  });

  it('should display the correct number of vehicle cards', () => {
    fixture.detectChanges();
    const vehicleCards = fixture.debugElement.queryAll(By.css('app-vehicle-card'));
    expect(vehicleCards.length).toBe(mockVehicles.length);
  });

  it('should show loading message when isloading$ is true', async () => {
    component.isloading$ = of(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const loadingMessage = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(loadingMessage).toBeTruthy();
  });

  it('should sort vehicles alphabetically by name', () => {
    const unsortedVehicles: Vehicle[] = [
      {
        id: '3',
        name: 'Audi A4',
        manufacturer: 'Audi',
        model: 'A4',
        fuel: 'Gasoline',
        type: 'Sedan',
        vin: '33333',
        color: 'Gray',
        mileage: 5000,
      },
      {
        id: '2',
        name: 'BMW X5',
        manufacturer: 'BMW',
        model: 'X5',
        fuel: 'Diesel',
        type: 'SUV',
        vin: '22222',
        color: 'Black',
        mileage: 20000,
      },
      {
        id: '1',
        name: 'Tesla Model 3',
        manufacturer: 'Tesla',
        model: 'Model 3',
        fuel: 'Electric',
        type: 'Sedan',
        vin: '11111',
        color: 'White',
        mileage: 10000,
      },
    ];

    if (!jest.isMockFunction(vehicleServiceMock.fetchVehicles)) {
      vehicleServiceMock.fetchVehicles = jest.fn();
    }

    (vehicleServiceMock.fetchVehicles as jest.Mock).mockImplementation(() => {
      const sortedVehicles = [...unsortedVehicles].sort((a, b) => a.name.localeCompare(b.name));
      vehiclesSubject.next(sortedVehicles);
    });

    vehicleServiceMock.fetchVehicles();

    expect(component.vehicles[0].name).toBe('Audi A4');
    expect(component.vehicles[1].name).toBe('BMW X5');
    expect(component.vehicles[2].name).toBe('Tesla Model 3');
  });
  it('should display "No vehicles found" message when there are no vehicles', async () => {
    component.isloading$ = of(false);
    vehiclesSubject.next([]);
    fixture.detectChanges();
    await fixture.whenStable();

    // Check if the "No vehicles" message is displayed
    const messageElement = fixture.debugElement.query(By.css('.no-vehicles'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain('Oops! No vehicles found');

    // Check if the image is present
    const imageElement = fixture.debugElement.query(By.css('.no-vehicles-image'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.nativeElement.getAttribute('src')).toBe('assets/images/no-vehicules.webp');

    // Ensure no vehicle cards are displayed
    const vehicleCards = fixture.debugElement.queryAll(By.css('app-vehicle-card'));
    expect(vehicleCards.length).toBe(0);
  });
});
