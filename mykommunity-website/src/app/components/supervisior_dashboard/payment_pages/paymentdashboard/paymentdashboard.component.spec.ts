import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdashboardComponent } from './paymentdashboard.component';

describe('PaymentdashboardComponent', () => {
  let component: PaymentdashboardComponent;
  let fixture: ComponentFixture<PaymentdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
