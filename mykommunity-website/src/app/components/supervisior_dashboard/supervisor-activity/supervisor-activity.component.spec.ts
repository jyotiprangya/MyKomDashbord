import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorActivityComponent } from './supervisor-activity.component';

describe('SupervisorActivityComponent', () => {
  let component: SupervisorActivityComponent;
  let fixture: ComponentFixture<SupervisorActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorActivityComponent]
    });
    fixture = TestBed.createComponent(SupervisorActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
