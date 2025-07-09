import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankreconcilationdetailsComponent } from './bankreconcilationdetails.component';

describe('BankreconcilationdetailsComponent', () => {
  let component: BankreconcilationdetailsComponent;
  let fixture: ComponentFixture<BankreconcilationdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankreconcilationdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankreconcilationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
