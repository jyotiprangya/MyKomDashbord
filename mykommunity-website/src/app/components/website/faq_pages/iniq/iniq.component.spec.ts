import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniqComponent } from './iniq.component';

describe('IniqComponent', () => {
  let component: IniqComponent;
  let fixture: ComponentFixture<IniqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IniqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IniqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
