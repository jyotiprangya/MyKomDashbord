import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffdashComponent } from './staffdash.component';

describe('StaffdashComponent', () => {
  let component: StaffdashComponent;
  let fixture: ComponentFixture<StaffdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffdashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
