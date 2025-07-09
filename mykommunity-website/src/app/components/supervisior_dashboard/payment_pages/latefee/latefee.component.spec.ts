import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatefeeComponent } from './latefee.component';

describe('LatefeeComponent', () => {
  let component: LatefeeComponent;
  let fixture: ComponentFixture<LatefeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatefeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatefeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
