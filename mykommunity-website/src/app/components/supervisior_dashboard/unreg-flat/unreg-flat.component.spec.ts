import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregFlatComponent } from './unreg-flat.component';

describe('UnregFlatComponent', () => {
  let component: UnregFlatComponent;
  let fixture: ComponentFixture<UnregFlatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnregFlatComponent]
    });
    fixture = TestBed.createComponent(UnregFlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
