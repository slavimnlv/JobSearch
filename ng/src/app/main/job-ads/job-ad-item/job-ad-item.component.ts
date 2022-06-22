import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { JobAd } from '../models/job-ad.model';
import { JobAdsService } from '../services/job-ads.service';
import {ApplicationsService} from "../../applications/services/applications.service";
import {Application} from "../../applications/models/application.model";

@Component({
  selector: 'app-job-ad-item',
  templateUrl: './job-ad-item.component.html',
  styleUrls: ['./job-ad-item.component.scss']
})
export class JobAdItemComponent implements OnInit {

  constructor(private authService: AuthService, private jobAdsService: JobAdsService, private usersService: UsersService, private  applicationsService: ApplicationsService) { }

  ngOnInit(): void {

    const loggedUser = this.authService.getUserDataFromStorage();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser?.token}`});

    this.usersService.getUserName$(this.jobad.employerId,headers).subscribe({
      next: (response) => {
        this.organizationName = response;
      }
    })

    if(loggedUser?.role==='Candidate'){
      this.applicationsService.getApplicationByJobIdAndUserId$(this.jobad.id, loggedUser!.id,headers).subscribe({
        next:(response) => {
          if(response){
            this.application = response
          }
        }

      })
    }
  }

  @Input() jobad!: JobAd;
  application!: Application;
  organizationName!: string;

  @Output() JobAdWithdraw: EventEmitter<number> = new EventEmitter<number>();
  @Output() JobAdDeleted: EventEmitter<number> = new EventEmitter<number>();

  onWithdraw(): void {
    this.JobAdWithdraw.emit(this.jobad.id);
  }

  onDelete(): void {
    this.JobAdDeleted.emit(this.jobad.id);
  }


  checkApplied(): boolean{
    if(this.application)
      return true;
    return false;
  }

  checkUser(): boolean{
    const loggedUser = this.authService.getUserDataFromStorage();
    if(loggedUser?.role === 'Candidate')
      return true;
    return false;
  }

  checkEmployer(): boolean{
    const loggedUser = this.authService.getUserDataFromStorage();
    if(loggedUser?.role === 'Employer' && this.jobad.employerId === loggedUser.id)
      return true;
    return false;
  }

  checkApproved(): boolean{
    if(this.application && this.application.approved)
      return true;
    return false
  }

  checkRejected(): boolean{
    if(this.application && this.application.rejected)
      return true;
    return false;
  }

}
