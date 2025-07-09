import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentheaderComponent } from './paymentheader.component';

describe('PaymentheaderComponent', () => {
  let component: PaymentheaderComponent;
  let fixture: ComponentFixture<PaymentheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
