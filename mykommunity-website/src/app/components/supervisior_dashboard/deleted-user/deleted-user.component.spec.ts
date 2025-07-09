import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedUserComponent } from './deleted-user.component';

describe('DeletedUserComponent', () => {
  let component: DeletedUserComponent;
  let fixture: ComponentFixture<DeletedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedUserComponent]
    });
    fixture = TestBed.createComponent(DeletedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
