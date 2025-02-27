import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { VehicleDetailsPageComponent } from './vehicle-details-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { jest } from '@jest/globals';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VehicleService } from '../../core/services/vehicle.service';

describe('VehicleDetailsPageComponent (Jest)', () => {
  let component: VehicleDetailsPageComponent;
  let fixture: ComponentFixture<VehicleDetailsPageComponent>;
  let mockVehicleService: jest.Mocked<VehicleService>;
  let mockRouter: Partial<jest.Mocked<Router>>;
  let paramMapSubject = new BehaviorSubject({ get: () => '123' });

  const mockVehicle = {
    id: '123',
    name: 'Tesla Model S',
    manufacturer: 'Tesla',
    model: 'Plaid',
    fuel: 'Electric',
    type: 'Sedan',
    vin: '5YJSA1E26MF1XXXXX',
    color: 'Red',
    mileage: 12000,
  };

  beforeEach(async () => {
    mockVehicleService = {
      getVehicleById: jest.fn(),
    } as unknown as jest.Mocked<VehicleService>;

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [VehicleDetailsPageComponent, MatIconModule, MatProgressSpinnerModule],
      providers: [
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMapSubject.asObservable() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner while fetching data', () => {
    mockVehicleService.getVehicleById.mockReturnValue(of(mockVehicle));

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});
