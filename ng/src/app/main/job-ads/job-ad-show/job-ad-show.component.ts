import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, windowWhen } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { User } from 'src/app/main/users/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { JobAd } from '../models/job-ad.model';
import { JobAdsService } from '../services/job-ads.service';
import {ApplicationsService} from "../../applications/services/applications.service";
import {JobAdFilter} from "../models/job-ad-filter.model";

@Component({
  selector: 'app-job-ad-show',
  templateUrl: './job-ad-show.component.html',
  styleUrls: ['./job-ad-show.component.scss']
})

export class JobAdShowComponent implements OnInit {

  jobads!: JobAd[];

  user!: User;

  selectedType!: string;
  selectedCategory!: string;
  pages: number[] = [];
  pageNumber:number = 1;

  errorMessage!: string;

  isMy!: boolean;


  constructor(private jobadsService: JobAdsService, private router: Router, private authService: AuthService, private usersServices: UsersService,private applicationsService: ApplicationsService) { }

  ngOnInit(): void {
    if(this.router.url === "/my-job-ads"){
      this.isMy = true;
    }

    this.updatePager();

    this.getContent();
  }

  onJobAdWithdraw(jobadId: number): void{
    const loggedUser = this.authService.getUserDataFromStorage();

    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser?.token}`});

    this.applicationsService.getApplicationByJobIdAndUserId$(jobadId,loggedUser!.id,header).subscribe({
      next:(response) => {
        if(response){
          this.applicationsService.deleteApplication$(response.id, header).subscribe({
            next:() => {
              if(this.isMy){
                const jobad = this.jobads.find(x=> x.id === jobadId);
                const index = this.jobads.indexOf(jobad!,0);
                this.jobads.splice(index,1);
              }
              else{

              }
            }
          })
        }
      }
    })
  }

  onJobAdDelete(jobadId: number){
    const loggedUser = this.authService.getUserDataFromStorage();

    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser?.token}`});

    this.jobadsService.deleteJobAd$(jobadId, header).subscribe({
      next:() => {
        const jobad = this.jobads.find(x=> x.id === jobadId);
        const index = this.jobads.indexOf(jobad!,0)
        this.jobads.splice(index,1);
      }
    })

  }

  checkEmployer(): boolean{
    const loggedUser = this.authService.getUserDataFromStorage();
    if(loggedUser?.role ==='Employer')
      return true;
    else
      return false;
  }

  private getContent(): void {
    const loggedUser = this.authService.getUserDataFromStorage();

    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser?.token}`});

    if(this.isMy){
      this.jobadsService.getMyJobAds$(loggedUser!.id,header).pipe(
        map((response: JobAd[]) => {
        return response;
      })).subscribe({
        next:(response: JobAd[]) => {
          this.jobads = response;
        }
      })

    }
    else{

      const filter: JobAdFilter = {
        type: this.selectedType,
        category: this.selectedCategory,
        page: this.pageNumber
      }
      this.jobadsService.getJobAds$(filter, header).pipe(
        map((response: JobAd[]) => {
        return response;
      })).subscribe({
        next:(response: JobAd[]) => {
          this.jobads = response;
        }
      })

    }
  }

  filter(): void{
    this.updatePager();
    this.pageNumber = 1;
    this.getContent();
  }

  clear(): void {
    window.location.reload();
  }

  changePage(page: number):void{
    this.pageNumber = page;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getContent();

  }

  updatePager(){
    const loggedUser = this.authService.getUserDataFromStorage();

    const header = new HttpHeaders({
      'Authorization': `Bearer ${loggedUser?.token}`});

    const filter: JobAdFilter = {
      type: this.selectedType,
      category: this.selectedCategory,
      page: this.pageNumber
    }

    this.jobadsService.getJobAdsNumber$(filter,header).subscribe({
      next:(response) => {
        console.log(response)
        let number = response/3;
        number = Math.ceil(number);

        this.pages = [];
        for(let i = 1; i <=number; i++){
          this.pages.push(i);
        }

      }
    })
  }



}



