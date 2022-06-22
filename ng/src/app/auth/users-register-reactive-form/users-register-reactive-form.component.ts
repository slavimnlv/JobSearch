import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../main/users/models/user.model";
import {map, Subject, take} from "rxjs";
import {LoginData} from "../models/loginData.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../main/users/services/users.service";
import {AuthService} from "../services/auth.service";
import {JobAdsService} from "../../main/job-ads/services/job-ads.service";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-users-register-reactive-form',
  templateUrl: './users-register-reactive-form.component.html',
  styleUrls: ['./users-register-reactive-form.component.scss']
})
export class UsersRegisterReactiveFormComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  user!: User;
  destroy$ = new Subject<boolean>();
  loggedUser!: LoginData;

  constructor(private fb: FormBuilder,  private router: Router, private route: ActivatedRoute, private authService: AuthService, private jobAdService: JobAdsService) {
    this.user = {
      id: 0,
      name: '',
      password: '',
      email: '',
      role: '',
      bulgarian: false,

    }
  }

  get nameFormControl(): FormControl {
    return this.formGroup?.get('name') as FormControl;
  }

  get emailFormControl(): FormControl {
    return this.formGroup?.get('email') as FormControl;
  }

  get passFormControl(): FormControl {
    return this.formGroup?.get('password') as FormControl;
  }

  get roleFormControl(): FormControl {
    return this.formGroup?.get('role') as FormControl;
  }

  get bgFormControl(): FormControl {
    return this.formGroup?.get('bulgarian') as FormControl;
  }

  ngOnInit(): void {
    this.initForm()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void{
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      return;
    }
    let citizen = false
    if(this.formGroup.value.bulgarian==="True"){
      citizen = true;
    }
    const user: User = {
      id: this.formGroup.value.id,
      email: this.formGroup.value.email,
      name: this.formGroup.value.name,
      password: this.formGroup.value.password,
      role: this.formGroup.value.role,
      bulgarian:citizen,
    };

    this.authService.registerUser(user).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });

  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      id: 0,
      email: [this.user.email,[Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      name: [this.user.name, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      password: [this.user.password,[Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      role: ['',[Validators.required]],
      bulgarian: ['', [Validators.required]]
    });
  }
}



