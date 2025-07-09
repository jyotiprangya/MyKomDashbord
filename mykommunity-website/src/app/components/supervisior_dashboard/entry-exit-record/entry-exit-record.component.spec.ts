import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryExitRecordComponent } from './entry-exit-record.component';

describe('EntryExitRecordComponent', () => {
  let component: EntryExitRecordComponent;
  let fixture: ComponentFixture<EntryExitRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryExitRecordComponent]
    });
    fixture = TestBed.createComponent(EntryExitRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
