import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousetypeComponent } from './housetype.component';

describe('HousetypeComponent', () => {
  let component: HousetypeComponent;
  let fixture: ComponentFixture<HousetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HousetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
