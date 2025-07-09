import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorDetailsPopupComponent } from './visitor-details-popup.component';

describe('VisitorDetailsPopupComponent', () => {
  let component: VisitorDetailsPopupComponent;
  let fixture: ComponentFixture<VisitorDetailsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorDetailsPopupComponent]
    });
    fixture = TestBed.createComponent(VisitorDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
