import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargetypeComponent } from './chargetype.component';

describe('ChargetypeComponent', () => {
  let component: ChargetypeComponent;
  let fixture: ComponentFixture<ChargetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
