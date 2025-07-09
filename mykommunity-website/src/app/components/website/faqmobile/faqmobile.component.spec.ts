import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqmobileComponent } from './faqmobile.component';

describe('FaqmobileComponent', () => {
  let component: FaqmobileComponent;
  let fixture: ComponentFixture<FaqmobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqmobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
