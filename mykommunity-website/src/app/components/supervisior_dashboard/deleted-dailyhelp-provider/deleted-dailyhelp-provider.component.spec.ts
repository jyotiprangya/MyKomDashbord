import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedDailyhelpProviderComponent } from './deleted-dailyhelp-provider.component';

describe('DeletedDailyhelpProviderComponent', () => {
  let component: DeletedDailyhelpProviderComponent;
  let fixture: ComponentFixture<DeletedDailyhelpProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedDailyhelpProviderComponent]
    });
    fixture = TestBed.createComponent(DeletedDailyhelpProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
