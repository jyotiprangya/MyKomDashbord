import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeStatusComponent } from './qrcode-status.component';

describe('QrcodeStatusComponent', () => {
  let component: QrcodeStatusComponent;
  let fixture: ComponentFixture<QrcodeStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrcodeStatusComponent]
    });
    fixture = TestBed.createComponent(QrcodeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
