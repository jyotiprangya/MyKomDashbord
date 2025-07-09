import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SosDetailsComponent } from './sos-details.component';

describe('SosDetailsComponent', () => {
  let component: SosDetailsComponent;
  let fixture: ComponentFixture<SosDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SosDetailsComponent]
    });
    fixture = TestBed.createComponent(SosDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
