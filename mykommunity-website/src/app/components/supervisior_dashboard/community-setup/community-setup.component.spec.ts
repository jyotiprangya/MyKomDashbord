import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySetupComponent } from './community-setup.component';

describe('CommunitySetupComponent', () => {
  let component: CommunitySetupComponent;
  let fixture: ComponentFixture<CommunitySetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunitySetupComponent]
    });
    fixture = TestBed.createComponent(CommunitySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
