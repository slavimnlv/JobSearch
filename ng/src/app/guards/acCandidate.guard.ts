import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/services/auth.service";
import { JobAd } from "../main/job-ads/models/job-ad.model";

@Injectable({
    providedIn: 'root'
})
export class AcCandidateGuard implements CanActivate{

    constructor(private authService:AuthService, private router: Router){
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      var loggedUser = this.authService.getUserDataFromStorage();
      if (loggedUser!.role === 'Candidate') {
  
        return true;
      }
      this.router.navigate(['/']);

      return false;
      }

}