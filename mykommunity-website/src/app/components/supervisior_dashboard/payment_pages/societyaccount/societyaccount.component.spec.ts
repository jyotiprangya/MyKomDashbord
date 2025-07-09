import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyaccountComponent } from './societyaccount.component';

describe('SocietyaccountComponent', () => {
  let component: SocietyaccountComponent;
  let fixture: ComponentFixture<SocietyaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietyaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
