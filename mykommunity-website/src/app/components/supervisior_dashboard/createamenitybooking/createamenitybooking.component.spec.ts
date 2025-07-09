import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateamenitybookingComponent } from './createamenitybooking.component';

describe('CreateamenitybookingComponent', () => {
  let component: CreateamenitybookingComponent;
  let fixture: ComponentFixture<CreateamenitybookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateamenitybookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateamenitybookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
