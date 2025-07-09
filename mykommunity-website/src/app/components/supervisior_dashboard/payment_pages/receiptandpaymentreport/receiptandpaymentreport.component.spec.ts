import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptandpaymentreportComponent } from './receiptandpaymentreport.component';

describe('ReceiptandpaymentreportComponent', () => {
  let component: ReceiptandpaymentreportComponent;
  let fixture: ComponentFixture<ReceiptandpaymentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptandpaymentreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptandpaymentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
