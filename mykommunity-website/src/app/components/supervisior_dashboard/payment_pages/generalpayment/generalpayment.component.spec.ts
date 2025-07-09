import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralpaymentComponent } from './generalpayment.component';

describe('GeneralpaymentComponent', () => {
  let component: GeneralpaymentComponent;
  let fixture: ComponentFixture<GeneralpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
