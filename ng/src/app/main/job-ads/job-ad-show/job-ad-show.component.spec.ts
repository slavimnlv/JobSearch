import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdShowComponent } from './job-ad-show.component';

describe('JobAdShowComponent', () => {
  let component: JobAdShowComponent;
  let fixture: ComponentFixture<JobAdShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAdShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
