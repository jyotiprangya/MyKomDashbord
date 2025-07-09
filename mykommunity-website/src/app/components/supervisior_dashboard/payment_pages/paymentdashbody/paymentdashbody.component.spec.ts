import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdashbodyComponent } from './paymentdashbody.component';

describe('PaymentdashbodyComponent', () => {
  let component: PaymentdashbodyComponent;
  let fixture: ComponentFixture<PaymentdashbodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentdashbodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentdashbodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
