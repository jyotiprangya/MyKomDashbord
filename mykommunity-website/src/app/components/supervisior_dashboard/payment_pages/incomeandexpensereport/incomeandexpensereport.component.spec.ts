import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeandexpensereportComponent } from './incomeandexpensereport.component';

describe('IncomeandexpensereportComponent', () => {
  let component: IncomeandexpensereportComponent;
  let fixture: ComponentFixture<IncomeandexpensereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeandexpensereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeandexpensereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
