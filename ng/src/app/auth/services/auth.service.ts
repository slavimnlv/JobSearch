import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginData } from "../models/loginData.model";
import { Login } from "../models/login.model";
import { User } from "../../main/users/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient){

    }

    login$(data: Login): Observable<LoginData|null> {
        return this.http.post<LoginData>(`${environment.apiUrl}/authenticate/login?email=${data.email}&&password=${data.password}`,'').pipe(
            map((response: LoginData)=> {
                const token = response;

                if(token) {
                    return token;
                }
                return null;
            })
        );
    }

    logout(): void {
        localStorage.removeItem('loggedUser');
        window.location.reload();
    }

    storeUserData(token: LoginData): void {
        localStorage.setItem('loggedUser', JSON.stringify(token));
    }

    getUserDataFromStorage(): LoginData | null {
        return JSON.parse(localStorage.getItem('loggedUser')!);
    }

    registerUser(user: User): Observable<void> {
       return this.http.post<void>(`${environment.apiUrl}/authenticate/registration`,user);
    }

}
