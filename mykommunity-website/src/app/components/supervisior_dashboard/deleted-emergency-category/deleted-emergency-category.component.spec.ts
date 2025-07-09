import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedEmergencyCategoryComponent } from './deleted-emergency-category.component';

describe('DeletedEmergencyCategoryComponent', () => {
  let component: DeletedEmergencyCategoryComponent;
  let fixture: ComponentFixture<DeletedEmergencyCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedEmergencyCategoryComponent]
    });
    fixture = TestBed.createComponent(DeletedEmergencyCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
