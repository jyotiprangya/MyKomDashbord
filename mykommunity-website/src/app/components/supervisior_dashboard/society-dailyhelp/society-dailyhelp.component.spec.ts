import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyDailyhelpComponent } from './society-dailyhelp.component';

describe('SocietyDailyhelpComponent', () => {
  let component: SocietyDailyhelpComponent;
  let fixture: ComponentFixture<SocietyDailyhelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietyDailyhelpComponent]
    });
    fixture = TestBed.createComponent(SocietyDailyhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
