import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdItemComponent } from './job-ad-item.component';

describe('JobAdItemComponent', () => {
  let component: JobAdItemComponent;
  let fixture: ComponentFixture<JobAdItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAdItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
