import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyDetailsComponent } from './society-details.component';

describe('SocietyDetailsComponent', () => {
  let component: SocietyDetailsComponent;
  let fixture: ComponentFixture<SocietyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietyDetailsComponent]
    });
    fixture = TestBed.createComponent(SocietyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
