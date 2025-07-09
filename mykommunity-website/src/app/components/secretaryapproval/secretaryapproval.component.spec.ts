import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryapprovalComponent } from './secretaryapproval.component';

describe('SecretaryapprovalComponent', () => {
  let component: SecretaryapprovalComponent;
  let fixture: ComponentFixture<SecretaryapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretaryapprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
