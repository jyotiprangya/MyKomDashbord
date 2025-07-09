import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentfaqComponent } from './paymentfaq.component';

describe('PaymentfaqComponent', () => {
  let component: PaymentfaqComponent;
  let fixture: ComponentFixture<PaymentfaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentfaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
