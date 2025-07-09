import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashtransferComponent } from './cashtransfer.component';

describe('CashtransferComponent', () => {
  let component: CashtransferComponent;
  let fixture: ComponentFixture<CashtransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashtransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashtransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
