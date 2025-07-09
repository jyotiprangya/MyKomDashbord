import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalunitsetupComponent } from './rentalunitsetup.component';

describe('RentalunitsetupComponent', () => {
  let component: RentalunitsetupComponent;
  let fixture: ComponentFixture<RentalunitsetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalunitsetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalunitsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
