import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedHousetypeComponent } from './deleted-housetype.component';

describe('DeletedHousetypeComponent', () => {
  let component: DeletedHousetypeComponent;
  let fixture: ComponentFixture<DeletedHousetypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedHousetypeComponent]
    });
    fixture = TestBed.createComponent(DeletedHousetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
