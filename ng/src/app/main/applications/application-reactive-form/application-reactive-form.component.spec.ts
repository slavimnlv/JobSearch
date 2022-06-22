import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReactiveFormComponent } from './application-reactive-form.component';

describe('ApplicationReactiveFormComponent', () => {
  let component: ApplicationReactiveFormComponent;
  let fixture: ComponentFixture<ApplicationReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationReactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
