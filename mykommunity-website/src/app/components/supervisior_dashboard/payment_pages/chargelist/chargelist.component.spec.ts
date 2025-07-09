import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargelistComponent } from './chargelist.component';

describe('ChargelistComponent', () => {
  let component: ChargelistComponent;
  let fixture: ComponentFixture<ChargelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
