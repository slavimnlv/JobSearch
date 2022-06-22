import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { JobAd } from '../../job-ads/models/job-ad.model';
import { JobAdsService } from '../../job-ads/services/job-ads.service';
import { UsersService } from '../../users/services/users.service';
import { UserApplication } from '../models/user-application.model';
import { ApplicationsService } from '../services/applications.service';
import {Application} from "../models/application.model";
import {User} from "../../users/models/user.model";

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {

  jobad!: JobAd;
  users: UserApplication[] = [];
  approvedUsers: UserApplication[] = [];
  rejectedUsers: UserApplication[] = [];

  constructor(private jobAdsService: JobAdsService, private authService: AuthService, private route: ActivatedRoute, private usersService: UsersService,private applicationsService: ApplicationsService ,private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        if(params['id']) {
          const loggedUser = this.authService.getUserDataFromStorage()!;
          const header = new HttpHeaders({
            'Authorization': `Bearer ${loggedUser.token}`});
          return  this.jobAdsService.getJobAd$(params['id'], header);
        }
        return of(null);
      })
    ).subscribe({
        next: (response) => {
          if(response){
            this.jobad = response;
            const loggedUser = this.authService.getUserDataFromStorage()!;
            const header = new HttpHeaders({
              'Authorization': `Bearer ${loggedUser.token}`});
              this.applicationsService.getApplicationsByJobId$(this.jobad.id, header).pipe(
                map((response: UserApplication[]) => {
                  return response;
                }),
                take(1)
              ).subscribe({
                next: (response: UserApplication[]) => {
                  if(response){
                    response.forEach(element => {
                      if(element.approved)
                        this.approvedUsers.push(element);
                      else if(element.rejected)
                        this.rejectedUsers.push(element);
                      else
                        this.users.push(element);
                    })
                  }

              }})
          }
        }
      });

  }

  onCandidateAccept(userApplication: UserApplication):void {
    const loggedUser = this.authService.getUserDataFromStorage()!;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser.token}`});
    console.log(userApplication);
    this.applicationsService.getApplication$(userApplication.applicationId, header).subscribe({
      next: (response: Application) => {
        if(response){
          const application = response;
          application.approved = true;
          userApplication.approved = true;
          this.applicationsService.putApplication$(application, header).subscribe({
            next:()=>{
              const index = this.users.indexOf(userApplication,0);
              this.users.splice(index,1);
              this.approvedUsers.push(userApplication);
          }
          })
        }
      }
    });

  }
  onCandidateDecline(userApplication: UserApplication): void {
    const loggedUser = this.authService.getUserDataFromStorage()!;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser.token}`});
    this.applicationsService.getApplication$(userApplication.applicationId, header).subscribe({
      next: (response: Application) => {
        if(response){
          const application = response;
          application.rejected = true;
          userApplication.rejected = true;
          this.applicationsService.putApplication$(application, header).subscribe({
            next:()=>{
              const index = this.users.indexOf(userApplication,0);
              this.users.splice(index,1);
              this.rejectedUsers.push(userApplication);
            }
          })
        }
      }
    });
  }

  onCandidateDeclineFromApproved(userApplication: UserApplication): void{
    const loggedUser = this.authService.getUserDataFromStorage()!;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser.token}`});
    this.applicationsService.getApplication$(userApplication.applicationId, header).subscribe({
      next: (response: Application) => {
        if(response){
          const application = response;
          application.rejected = true;
          application.approved = false;
          this.applicationsService.putApplication$(application, header).subscribe({
            next:()=>{
              const index = this.approvedUsers.indexOf(userApplication,0);
              this.approvedUsers.splice(index,1);
              this.rejectedUsers.push(userApplication);
            }
          })
        }
      }
    });
  }

  onCandidateAcceptFromRejected(userApplication: UserApplication): void{
    const loggedUser = this.authService.getUserDataFromStorage()!;
    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser.token}`});
    this.applicationsService.getApplication$(userApplication.applicationId, header).subscribe({
      next: (response: Application) => {
        if(response){
          const application = response;
          application.rejected = false;
          application.approved = true;
          this.applicationsService.putApplication$(application, header).subscribe({
            next:()=>{
              const index = this.rejectedUsers.indexOf(userApplication,0);
              this.rejectedUsers.splice(index,1);
              this.approvedUsers.push(userApplication);
            }
          })
        }
      }
    });
  }

}
