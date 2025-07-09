import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedStaffComponent } from './deleted-staff.component';

describe('DeletedStaffComponent', () => {
  let component: DeletedStaffComponent;
  let fixture: ComponentFixture<DeletedStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedStaffComponent]
    });
    fixture = TestBed.createComponent(DeletedStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
