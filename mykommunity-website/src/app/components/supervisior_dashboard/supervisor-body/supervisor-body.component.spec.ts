import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorBodyComponent } from './supervisor-body.component';

describe('SupervisorBodyComponent', () => {
  let component: SupervisorBodyComponent;
  let fixture: ComponentFixture<SupervisorBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorBodyComponent]
    });
    fixture = TestBed.createComponent(SupervisorBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
