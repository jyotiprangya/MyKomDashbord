import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateinvoiceComponent } from './generateinvoice.component';

describe('GenerateinvoiceComponent', () => {
  let component: GenerateinvoiceComponent;
  let fixture: ComponentFixture<GenerateinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateinvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
