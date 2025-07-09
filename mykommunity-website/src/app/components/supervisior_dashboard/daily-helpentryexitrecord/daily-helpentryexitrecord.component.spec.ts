import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHelpentryexitrecordComponent } from './daily-helpentryexitrecord.component';

describe('DailyHelpentryexitrecordComponent', () => {
  let component: DailyHelpentryexitrecordComponent;
  let fixture: ComponentFixture<DailyHelpentryexitrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyHelpentryexitrecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyHelpentryexitrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
