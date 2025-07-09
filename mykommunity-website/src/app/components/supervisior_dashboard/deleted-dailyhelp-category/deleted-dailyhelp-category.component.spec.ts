import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedDailyhelpCategoryComponent } from './deleted-dailyhelp-category.component';

describe('DeletedDailyhelpCategoryComponent', () => {
  let component: DeletedDailyhelpCategoryComponent;
  let fixture: ComponentFixture<DeletedDailyhelpCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedDailyhelpCategoryComponent]
    });
    fixture = TestBed.createComponent(DeletedDailyhelpCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
