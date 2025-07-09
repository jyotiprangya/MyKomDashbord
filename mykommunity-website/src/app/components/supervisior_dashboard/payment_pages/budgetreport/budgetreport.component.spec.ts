import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetreportComponent } from './budgetreport.component';

describe('BudgetreportComponent', () => {
  let component: BudgetreportComponent;
  let fixture: ComponentFixture<BudgetreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
