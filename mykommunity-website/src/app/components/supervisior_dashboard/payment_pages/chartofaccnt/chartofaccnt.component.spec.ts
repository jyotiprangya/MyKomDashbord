import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartofaccntComponent } from './chartofaccnt.component';

describe('ChartofaccntComponent', () => {
  let component: ChartofaccntComponent;
  let fixture: ComponentFixture<ChartofaccntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartofaccntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartofaccntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
