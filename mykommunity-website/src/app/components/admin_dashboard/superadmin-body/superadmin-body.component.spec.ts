import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminBodyComponent } from './superadmin-body.component';

describe('SuperadminBodyComponent', () => {
  let component: SuperadminBodyComponent;
  let fixture: ComponentFixture<SuperadminBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminBodyComponent]
    });
    fixture = TestBed.createComponent(SuperadminBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
