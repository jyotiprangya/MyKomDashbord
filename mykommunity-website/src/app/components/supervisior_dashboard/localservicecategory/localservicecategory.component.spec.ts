import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalservicecategoryComponent } from './localservicecategory.component';

describe('LocalservicecategoryComponent', () => {
  let component: LocalservicecategoryComponent;
  let fixture: ComponentFixture<LocalservicecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalservicecategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalservicecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
