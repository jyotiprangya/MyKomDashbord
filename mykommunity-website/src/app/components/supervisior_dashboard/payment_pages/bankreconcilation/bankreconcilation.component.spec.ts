import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankreconcilationComponent } from './bankreconcilation.component';

describe('BankreconcilationComponent', () => {
  let component: BankreconcilationComponent;
  let fixture: ComponentFixture<BankreconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankreconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankreconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
