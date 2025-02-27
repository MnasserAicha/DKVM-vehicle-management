import { TestBed } from '@angular/core/testing';
import { VehicleService } from './vehicle.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Vehicle } from '../models/vehicle.model';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://67b85e2b699a8a7baef3cceb.mockapi.io/vehicles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehicleService],
    });
    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicles', () => {
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

    service.fetchVehicles();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicles);
  });

  it('should add a new vehicle', () => {
    const newVehicle: Partial<Vehicle> = {
      name: 'Audi A4',
      manufacturer: 'Audi',
      model: 'A4',
      fuel: 'Gasoline',
      type: 'Sedan',
      vin: '33333',
      color: 'Gray',
      mileage: 5000,
    };
    const createdVehicle: Vehicle = { id: '3', ...newVehicle } as Vehicle;

    service.addVehicle(newVehicle).subscribe((vehicle) => {
      expect(vehicle).toEqual(createdVehicle);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdVehicle);
  });

  it('should get a vehicle by ID', () => {
    const vehicle: Vehicle = {
      id: '1',
      name: 'Tesla Model 3',
      manufacturer: 'Tesla',
      model: 'Model 3',
      fuel: 'Electric',
      type: 'Sedan',
      vin: '11111',
      color: 'White',
      mileage: 10000,
    };
    service.getVehicleById('1').subscribe((data) => {
      expect(data).toEqual(vehicle);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(vehicle);
  });
});
