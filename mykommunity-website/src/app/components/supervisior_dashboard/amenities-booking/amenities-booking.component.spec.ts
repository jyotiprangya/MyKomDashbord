import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenitiesBookingComponent } from './amenities-booking.component';

describe('AmenitiesBookingComponent', () => {
  let component: AmenitiesBookingComponent;
  let fixture: ComponentFixture<AmenitiesBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmenitiesBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmenitiesBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
