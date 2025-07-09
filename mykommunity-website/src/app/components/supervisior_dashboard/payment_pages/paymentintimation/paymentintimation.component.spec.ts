import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentintimationComponent } from './paymentintimation.component';

describe('PaymentintimationComponent', () => {
  let component: PaymentintimationComponent;
  let fixture: ComponentFixture<PaymentintimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentintimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentintimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
