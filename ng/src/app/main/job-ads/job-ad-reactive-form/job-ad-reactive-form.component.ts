import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JobAd } from '../models/job-ad.model';
import { JobAdsService } from '../services/job-ads.service';

@Component({
  selector: 'app-job-ad-reactive-form',
  templateUrl: './job-ad-reactive-form.component.html',
  styleUrls: ['./job-ad-reactive-form.component.scss']
})
export class JobAdReactiveFormComponent implements OnInit {

  formGroup!: FormGroup;
  jobad!: JobAd;
  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private jobadService: JobAdsService, private authService: AuthService) {
    this.jobad = {
      id: 0,
      title: '',
      description: '',
      type: '',
      category: '',
      employerId: 0,
      salary: 0,
    }
   }

  get titleFormControl(): FormControl {
     return this.formGroup?.get('title') as FormControl;
  }
  get descriptionFormControl(): FormControl {
    return this.formGroup?.get('description') as FormControl;
  }
  get typeFormControl(): FormControl {
    return this.formGroup?.get('type') as FormControl;
  }
  get categoryFormControl(): FormControl {
    return this.formGroup?.get('category') as FormControl;
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: { [x: string]: any; }) => {
        if(params['id']) {
          const loggedUser = this.authService.getUserDataFromStorage();
          const header = new HttpHeaders({
            'Authorization': `Bearer ${loggedUser?.token}`});

          return this.jobadService.getJobAd$(params['id'], header);
        }
        this.initForm();
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
        next: (response) => {
          if(response){
            this.jobad = response;
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

    const jobad: JobAd = {
      id: this.formGroup.value.id,
      title: this.formGroup.value.title,
      description: this.formGroup.value.description,
      type: this.formGroup.value.type,
      category: this.formGroup.value.category,
      employerId: this.formGroup.value.employerId,
      salary: this.formGroup.value.salary
    };

    let request$;

    const loggedUser = this.authService.getUserDataFromStorage()!;

    jobad.employerId = loggedUser.id;

    const header = new HttpHeaders({
    'Authorization': `Bearer ${loggedUser.token}`});

    if(jobad.id) {
      request$ = this.jobadService.putJobAd$(jobad, header);
    }else {

      request$ = this.jobadService.postJobAd$(jobad, header);
    }

    request$.subscribe({
      next: () => {
        this.router.navigate(['/my-job-ads']);
      }
    });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      id: this.jobad.id,
      title: [this.jobad.title, [Validators.required, Validators.maxLength(100), Validators.minLength(10)]],
      description: [this.jobad.description, [Validators.required, Validators.maxLength(500), Validators.minLength(50)]],
      type: [this.jobad.type, [Validators.required]],
      category: [this.jobad.category, [Validators.required]],
      salary:this.jobad.salary,
      employerId:this.jobad.employerId
    });
  }
}
