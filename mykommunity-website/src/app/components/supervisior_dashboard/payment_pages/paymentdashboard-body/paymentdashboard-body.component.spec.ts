import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdashboardBodyComponent } from './paymentdashboard-body.component';

describe('PaymentdashboardBodyComponent', () => {
  let component: PaymentdashboardBodyComponent;
  let fixture: ComponentFixture<PaymentdashboardBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentdashboardBodyComponent]
    });
    fixture = TestBed.createComponent(PaymentdashboardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
