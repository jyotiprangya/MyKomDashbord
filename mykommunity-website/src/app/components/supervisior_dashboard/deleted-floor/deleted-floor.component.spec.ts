import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedFloorComponent } from './deleted-floor.component';

describe('DeletedFloorComponent', () => {
  let component: DeletedFloorComponent;
  let fixture: ComponentFixture<DeletedFloorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedFloorComponent]
    });
    fixture = TestBed.createComponent(DeletedFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
