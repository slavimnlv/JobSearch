import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdReactiveFormComponent } from './job-ad-reactive-form.component';

describe('JobAdReactiveFormComponent', () => {
  let component: JobAdReactiveFormComponent;
  let fixture: ComponentFixture<JobAdReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAdReactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
