import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedBlockComponent } from './deleted-block.component';

describe('DeletedBlockComponent', () => {
  let component: DeletedBlockComponent;
  let fixture: ComponentFixture<DeletedBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedBlockComponent]
    });
    fixture = TestBed.createComponent(DeletedBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
