import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedAmenityComponent } from './deleted-amenity.component';

describe('DeletedAmenityComponent', () => {
  let component: DeletedAmenityComponent;
  let fixture: ComponentFixture<DeletedAmenityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedAmenityComponent]
    });
    fixture = TestBed.createComponent(DeletedAmenityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
