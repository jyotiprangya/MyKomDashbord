import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowduesComponent } from './showdues.component';

describe('ShowduesComponent', () => {
  let component: ShowduesComponent;
  let fixture: ComponentFixture<ShowduesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowduesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowduesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
