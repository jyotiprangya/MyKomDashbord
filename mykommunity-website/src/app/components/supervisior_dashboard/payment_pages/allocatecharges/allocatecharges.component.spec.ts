import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatechargesComponent } from './allocatecharges.component';

describe('AllocatechargesComponent', () => {
  let component: AllocatechargesComponent;
  let fixture: ComponentFixture<AllocatechargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatechargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatechargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
