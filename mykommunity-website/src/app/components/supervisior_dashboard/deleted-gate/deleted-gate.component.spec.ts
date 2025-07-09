import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedGateComponent } from './deleted-gate.component';

describe('DeletedGateComponent', () => {
  let component: DeletedGateComponent;
  let fixture: ComponentFixture<DeletedGateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedGateComponent]
    });
    fixture = TestBed.createComponent(DeletedGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
