import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../users/models/user.model";
import {map, of, Subject, switchMap, take, takeUntil} from "rxjs";
import {LoginData} from "../../../auth/models/loginData.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../users/services/users.service";
import {AuthService} from "../../../auth/services/auth.service";
import {JobAdsService} from "../../job-ads/services/job-ads.service";
import {HttpHeaders} from "@angular/common/http";
import {Application} from "../models/application.model";
import {ApplicationsService} from "../services/applications.service";
import {JobAd} from "../../job-ads/models/job-ad.model";

@Component({
  selector: 'app-application-reactive-form',
  templateUrl: './application-reactive-form.component.html',
  styleUrls: ['./application-reactive-form.component.scss']
})
export class ApplicationReactiveFormComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  application!: Application;
  destroy$ = new Subject<boolean>();
  loggedUser!: LoginData;
  jobad!: JobAd;

  constructor(private fb: FormBuilder,  private router: Router, private route: ActivatedRoute, private applicationsService: ApplicationsService, private authService: AuthService, private jobAdService: JobAdsService) {
    this.application = {
      id: 0,
      coverLetter: '',
      approved: false,
      rejected: false,
      userId: 0,
      jobAdId: 0
    }
  }

  get letterFormControl(): FormControl {
    return this.formGroup?.get('coverLetter') as FormControl;
  }


  ngOnInit(): void {
    this.loggedUser = this.authService.getUserDataFromStorage()!;

    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.loggedUser.token}`});

    this.route.params.pipe(
      switchMap((params: { [x: string]: any; }) => {
        this.jobAdService.getJobAd$(params['id'], header).subscribe({
          next:(response) => {
            if(response){
              this.jobad = response;
            }
          }
        })
          return this.applicationsService.getApplicationByJobIdAndUserId$(params['id'],this.loggedUser!.id, header);
       // this.initForm();
        //return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if(response){
          if(response.approved || response.rejected){
            this.initForm()
          }
          else{
            this.application = response;
            this.initForm();
          }
        }
        else{
          this.initForm();
        }
      }
    });

    this.initForm();

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

    const application: Application = {
      id: this.formGroup.value.id,
      coverLetter: this.formGroup.value.coverLetter,
      rejected: this.formGroup.value.rejected,
      approved: this.formGroup.value.approved,
      userId: this.formGroup.value.userId,
      jobAdId:this.formGroup.value.jobAdId
    };

    let request$;

    const loggedUser = this.authService.getUserDataFromStorage()!;

    application.userId = loggedUser.id;

    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser.token}`});

    if(application.id > 0) {
      request$ = this.applicationsService.putApplication$(application, header);
    }else {
      application.jobAdId = this.jobad.id;
      request$ = this.applicationsService.postApplication$(application, header);
    }

    request$.subscribe({
      next: () => {
        this.router.navigate(['/my-job-ads']);
      }
    });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      id: this.application.id,
      coverLetter: [this.application.coverLetter,[Validators.required, , Validators.maxLength(500), Validators.minLength(50)]],
      rejected: this.application.rejected,
      approved: this.application.approved,
      userId: this.application.userId,
      jobId: this.application.jobAdId
    });
  }
}



