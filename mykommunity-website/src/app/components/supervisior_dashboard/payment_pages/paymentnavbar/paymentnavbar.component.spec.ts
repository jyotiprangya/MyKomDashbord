import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentnavbarComponent } from './paymentnavbar.component';

describe('PaymentnavbarComponent', () => {
  let component: PaymentnavbarComponent;
  let fixture: ComponentFixture<PaymentnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentnavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
