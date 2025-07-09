import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorentryexitrecordComponent } from './visitorentryexitrecord.component';

describe('VisitorentryexitrecordComponent', () => {
  let component: VisitorentryexitrecordComponent;
  let fixture: ComponentFixture<VisitorentryexitrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorentryexitrecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorentryexitrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
