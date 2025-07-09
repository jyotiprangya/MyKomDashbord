import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipropertyComponent } from './multiproperty.component';

describe('MultipropertyComponent', () => {
  let component: MultipropertyComponent;
  let fixture: ComponentFixture<MultipropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
