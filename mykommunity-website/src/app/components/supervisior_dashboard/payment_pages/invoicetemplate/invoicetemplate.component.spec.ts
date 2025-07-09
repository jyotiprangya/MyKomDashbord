import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicetemplateComponent } from './invoicetemplate.component';

describe('InvoicetemplateComponent', () => {
  let component: InvoicetemplateComponent;
  let fixture: ComponentFixture<InvoicetemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicetemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
