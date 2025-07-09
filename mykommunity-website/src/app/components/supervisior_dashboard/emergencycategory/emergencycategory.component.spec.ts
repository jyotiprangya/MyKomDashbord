import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencycategoryComponent } from './emergencycategory.component';

describe('EmergencycategoryComponent', () => {
  let component: EmergencycategoryComponent;
  let fixture: ComponentFixture<EmergencycategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencycategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencycategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
