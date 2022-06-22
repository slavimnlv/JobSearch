import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRegisterReactiveFormComponent } from './users-register-reactive-form.component';

describe('UsersRegisterReactiveFormComponent', () => {
  let component: UsersRegisterReactiveFormComponent;
  let fixture: ComponentFixture<UsersRegisterReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersRegisterReactiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRegisterReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
