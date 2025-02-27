import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleCardComponent } from './vehicle-card.component';
import { Vehicle } from '../../../core/models/vehicle.model';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('VehicleCardComponent', () => {
  let component: VehicleCardComponent;
  let fixture: ComponentFixture<VehicleCardComponent>;

  const mockVehicle: Vehicle = {
    id: '1',
    name: 'Tesla Model S',
    manufacturer: 'Tesla',
    model: 'Model S',
    fuel: 'Electric',
    type: 'Sedan',
    vin: '5YJSA1E26MF1XXXXX',
    color: 'White',
    mileage: 10000,
  };

  const activatedRouteMock = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCardComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleCardComponent);
    component = fixture.componentInstance;
    component.vehicle = mockVehicle;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display vehicle name', () => {
    const nameElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(nameElement.textContent).toContain(mockVehicle.name);
  });
});
