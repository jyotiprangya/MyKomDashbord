import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedSecurityComponent } from './deleted-security.component';

describe('DeletedSecurityComponent', () => {
  let component: DeletedSecurityComponent;
  let fixture: ComponentFixture<DeletedSecurityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedSecurityComponent]
    });
    fixture = TestBed.createComponent(DeletedSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
