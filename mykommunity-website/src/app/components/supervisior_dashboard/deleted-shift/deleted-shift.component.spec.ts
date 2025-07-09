import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedShiftComponent } from './deleted-shift.component';

describe('DeletedShiftComponent', () => {
  let component: DeletedShiftComponent;
  let fixture: ComponentFixture<DeletedShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedShiftComponent]
    });
    fixture = TestBed.createComponent(DeletedShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
