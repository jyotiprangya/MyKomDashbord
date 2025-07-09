import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicegrpComponent } from './invoicegrp.component';

describe('InvoicegrpComponent', () => {
  let component: InvoicegrpComponent;
  let fixture: ComponentFixture<InvoicegrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicegrpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicegrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
