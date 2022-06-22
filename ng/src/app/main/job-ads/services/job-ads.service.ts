import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { JobAd } from "../models/job-ad.model";
import {JobAdFilter} from "../models/job-ad-filter.model";

@Injectable({
    providedIn: 'root'
})
export class JobAdsService {

    private url = `${environment.apiUrl}/jobad`;

    constructor(private http: HttpClient){

    }

    getJobAds$(filter: JobAdFilter ,header: HttpHeaders): Observable<JobAd[]> {
      const url = `${this.url}/jobads`;
      return this.http.post<JobAd[]>(url,filter,{headers: header});
    }

    getJobAdsNumber$(filter:JobAdFilter, header: HttpHeaders): Observable<any> {
      const url = `${this.url}/count`;

      return this.http.post(url,filter,{ headers: header});
    }

    getUserName$(id: number, header: HttpHeaders): Observable<string> {
      const url = `${this.url}/name?id=${id}`;

      return this.http.get(url,{responseType: 'text', headers: header});
    }

    getMyJobAds$(userid: number, header: HttpHeaders): Observable<JobAd[]> {
        const url = `${this.url}/userid?userid=${userid}`;
        return this.http.get<JobAd[]>(url,{headers: header});
    }

    getJobAd$(id: number, header: HttpHeaders): Observable<JobAd> {
        const url = `${this.url}/${id}`;

        return this.http.get<JobAd>(url,{headers: header});
    }

    postJobAd$(jobad: JobAd, header: HttpHeaders): Observable<JobAd> {
        return this.http.post<JobAd>(this.url, jobad, {headers: header});
    }

    putJobAd$(jobad: JobAd, header: HttpHeaders): Observable<JobAd> {
        return this.http.put<JobAd>(this.url, jobad, {headers: header});
    }

    deleteJobAd$(id: number, header: HttpHeaders): Observable<void>{
        const url = `${this.url}?id=${id}`;

        return this.http.delete<void>(url);
    }

}
