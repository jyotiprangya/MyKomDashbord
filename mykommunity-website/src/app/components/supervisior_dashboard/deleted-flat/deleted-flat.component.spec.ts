import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedFlatComponent } from './deleted-flat.component';

describe('DeletedFlatComponent', () => {
  let component: DeletedFlatComponent;
  let fixture: ComponentFixture<DeletedFlatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedFlatComponent]
    });
    fixture = TestBed.createComponent(DeletedFlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
