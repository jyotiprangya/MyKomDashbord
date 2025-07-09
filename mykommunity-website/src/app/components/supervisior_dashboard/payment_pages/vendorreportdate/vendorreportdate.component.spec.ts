import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorreportdateComponent } from './vendorreportdate.component';

describe('VendorreportdateComponent', () => {
  let component: VendorreportdateComponent;
  let fixture: ComponentFixture<VendorreportdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorreportdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorreportdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
