import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Application } from "../models/application.model";
import {UserApplication} from "../models/user-application.model";

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {

    private url = `${environment.apiUrl}/application`;

    constructor(private http: HttpClient){
    }

    getApplicationByJobIdAndUserId$(jobid:number, userid:number, header: HttpHeaders): Observable<Application> {
      const url = `${this.url}/jobid&userid?jobid=${jobid}&&userid=${userid}`
      return this.http.get<Application>(url,{headers: header});
    }

    getApplication$(id: number, header: HttpHeaders): Observable<Application> {
        const url = `${this.url}/${id}`;

        return this.http.get<Application>(url,{headers: header});
    }
    getApplicationsByJobId$(id: number, header: HttpHeaders): Observable<UserApplication[]> {
        const url = `${this.url}/jobid?jobid=${id}`;

        return this.http.get<UserApplication[]>(url,{headers: header});
    }

    postApplication$(application: Application, header: HttpHeaders): Observable<Application> {
        return this.http.post<Application>(this.url, application, {headers: header});
    }

    putApplication$(application: Application, header: HttpHeaders): Observable<Application> {
        return this.http.put<Application>(this.url, application,{headers: header});
    }

    deleteApplication$(id: number, header: HttpHeaders): Observable<void>{
        const url = `${this.url}?Id=${id}`;

        return this.http.delete<void>(url,{headers: header});
    }

}
