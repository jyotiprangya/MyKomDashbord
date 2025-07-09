import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyDailyhelpEntryExitComponent } from './society-dailyhelp-entry-exit.component';

describe('SocietyDailyhelpEntryExitComponent', () => {
  let component: SocietyDailyhelpEntryExitComponent;
  let fixture: ComponentFixture<SocietyDailyhelpEntryExitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietyDailyhelpEntryExitComponent]
    });
    fixture = TestBed.createComponent(SocietyDailyhelpEntryExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
