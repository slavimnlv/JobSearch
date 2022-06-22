import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable, of, pipe, Subject, switchMap, take, takeUntil } from 'rxjs';
import { LoginData } from 'src/app/auth/models/loginData.model';
import { User } from 'src/app/main/users/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JobAdsService } from '../../job-ads/services/job-ads.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-reactive-form',
  templateUrl: './user-reactive-form.component.html',
  styleUrls: ['./user-reactive-form.component.scss']
})
export class UserReactiveFormComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  user!: User;
  destroy$ = new Subject<boolean>();
  loggedUser!: LoginData;

  constructor(private fb: FormBuilder,  private router: Router, private route: ActivatedRoute, private usersService: UsersService, private authService: AuthService, private jobAdService: JobAdsService) {
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

 ngOnInit(): void {
  this.loggedUser = this.authService.getUserDataFromStorage()!;

  const header = new HttpHeaders({
    'Authorization': `Bearer ${this.loggedUser.token}`});

    this.usersService.getUser$(this.loggedUser.id, header).pipe(
      map((response: User) => {
        return response;
      }),
      take(1)
    ).subscribe({
      next: (response: User) => {
        if(response){
          this.user = response;
          this.initForm();
        }
      }
    });


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

    const user: User = {
      id: this.formGroup.value.id,
      email: this.formGroup.value.email,
      name: this.formGroup.value.name,
      password: this.formGroup.value.password,
      role: this.formGroup.value.role,
      bulgarian:this.formGroup.value.bulgarian
     };

     const header = new HttpHeaders({
      'Authorization': `Bearer ${this.loggedUser.token}`});

    this.usersService.putUser$(user,header).subscribe({
      next: () => {
        this.router.navigate(['/job-ads']);
      }
    });

  }

  onDelete(): void {
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.loggedUser.token}`});

      this.usersService.deleteUser$(this.user.id, header).subscribe({
        next: () => {
          this.authService.logout();
        }
      });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      id: this.user.id,
      email: [this.user.email,[Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
      name: [this.user.name, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      password: [this.user.password,[Validators.required, Validators.maxLength(50), Validators.minLength(5)]],
      role: this.user.role,
      bulgarian: this.user.bulgarian
    });
  }
}



