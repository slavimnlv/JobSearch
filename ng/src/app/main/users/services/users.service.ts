import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/main/users/models/user.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private url = `${environment.apiUrl}/user`;

    constructor(private http: HttpClient){
    }

    getUser$(id: number, header: HttpHeaders): Observable<User> {
        const url = `${this.url}/${id}`;

        return this.http.get<User>(url,{headers: header});
    }

    getUserName$(id: number, header: HttpHeaders): Observable<string> {
      const url = `${this.url}/name?id=${id}`;

      return this.http.get(url,{responseType: 'text', headers: header});
    }

    putUser$(User: User, header: HttpHeaders): Observable<User> {
        const url = `${this.url}`;

        return this.http.put<User>(url, User,{headers: header});
    }

    deleteUser$(id: number, header: HttpHeaders): Observable<void>{
        const url = `${this.url}?Id=${id}`;

        return this.http.delete<void>(url,{headers: header});
    }

}
