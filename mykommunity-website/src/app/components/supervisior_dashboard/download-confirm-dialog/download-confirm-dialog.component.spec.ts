import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadConfirmDialogComponent } from './download-confirm-dialog.component';

describe('DownloadConfirmDialogComponent', () => {
  let component: DownloadConfirmDialogComponent;
  let fixture: ComponentFixture<DownloadConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(DownloadConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
