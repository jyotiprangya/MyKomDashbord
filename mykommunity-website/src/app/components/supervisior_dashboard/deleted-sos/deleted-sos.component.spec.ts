import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedSosComponent } from './deleted-sos.component';

describe('DeletedSosComponent', () => {
  let component: DeletedSosComponent;
  let fixture: ComponentFixture<DeletedSosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedSosComponent]
    });
    fixture = TestBed.createComponent(DeletedSosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
