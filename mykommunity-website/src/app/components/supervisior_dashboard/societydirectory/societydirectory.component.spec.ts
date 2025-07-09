import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietydirectoryComponent } from './societydirectory.component';

describe('SocietydirectoryComponent', () => {
  let component: SocietydirectoryComponent;
  let fixture: ComponentFixture<SocietydirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietydirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietydirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
