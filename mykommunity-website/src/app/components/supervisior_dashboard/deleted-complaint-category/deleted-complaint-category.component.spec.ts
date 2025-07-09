import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedComplaintCategoryComponent } from './deleted-complaint-category.component';

describe('DeletedComplaintCategoryComponent', () => {
  let component: DeletedComplaintCategoryComponent;
  let fixture: ComponentFixture<DeletedComplaintCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedComplaintCategoryComponent]
    });
    fixture = TestBed.createComponent(DeletedComplaintCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
