import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router){

  }

  ngOnInit(): void {
  }


  onLogout(): void {
    this.authService.logout();
    //this.router.navigate(['/auth','login']);
}

  logged():boolean {
    const user = this.authService.getUserDataFromStorage();
    if(user)
      return true;
    return false;
  }
}
