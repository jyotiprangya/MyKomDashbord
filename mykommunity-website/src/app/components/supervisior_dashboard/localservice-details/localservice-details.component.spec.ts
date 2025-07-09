import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalserviceDetailsComponent } from './localservice-details.component';

describe('LocalserviceDetailsComponent', () => {
  let component: LocalserviceDetailsComponent;
  let fixture: ComponentFixture<LocalserviceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalserviceDetailsComponent]
    });
    fixture = TestBed.createComponent(LocalserviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
