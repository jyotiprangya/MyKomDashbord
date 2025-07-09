import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmenityBookingComponent } from './edit-amenity-booking.component';

describe('EditAmenityBookingComponent', () => {
  let component: EditAmenityBookingComponent;
  let fixture: ComponentFixture<EditAmenityBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAmenityBookingComponent]
    });
    fixture = TestBed.createComponent(EditAmenityBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
