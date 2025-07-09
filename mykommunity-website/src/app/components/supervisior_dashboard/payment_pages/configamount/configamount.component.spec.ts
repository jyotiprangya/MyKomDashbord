import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigamountComponent } from './configamount.component';

describe('ConfigamountComponent', () => {
  let component: ConfigamountComponent;
  let fixture: ComponentFixture<ConfigamountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigamountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigamountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
