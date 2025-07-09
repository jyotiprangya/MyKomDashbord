import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvendorbookingComponent } from './addvendorbooking.component';

describe('AddvendorbookingComponent', () => {
  let component: AddvendorbookingComponent;
  let fixture: ComponentFixture<AddvendorbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddvendorbookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddvendorbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
