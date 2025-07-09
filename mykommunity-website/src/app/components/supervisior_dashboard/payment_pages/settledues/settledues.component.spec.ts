import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleduesComponent } from './settledues.component';

describe('SettleduesComponent', () => {
  let component: SettleduesComponent;
  let fixture: ComponentFixture<SettleduesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettleduesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleduesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
