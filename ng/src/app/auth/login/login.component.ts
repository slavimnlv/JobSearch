import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const loggedUser = this.authService.getUserDataFromStorage();
    if(loggedUser)
      this.router.navigate(['/job-ads']);
    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void {
    this.authService.login$(this.formGroup.value).subscribe({
      next: (response) => {
        if(response){
          this.authService.storeUserData(response);

          this.router.navigate(['/']);

        }
      }
    })
  }

}
