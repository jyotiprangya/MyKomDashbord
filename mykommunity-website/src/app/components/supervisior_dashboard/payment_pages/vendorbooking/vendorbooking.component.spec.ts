import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorbookingComponent } from './vendorbooking.component';

describe('VendorbookingComponent', () => {
  let component: VendorbookingComponent;
  let fixture: ComponentFixture<VendorbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorbookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
