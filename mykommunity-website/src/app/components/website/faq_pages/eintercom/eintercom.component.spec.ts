import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EintercomComponent } from './eintercom.component';

describe('EintercomComponent', () => {
  let component: EintercomComponent;
  let fixture: ComponentFixture<EintercomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EintercomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EintercomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
