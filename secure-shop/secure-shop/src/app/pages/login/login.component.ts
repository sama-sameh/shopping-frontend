import { Component } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage:string ='';

  constructor(private authService: AuthService,private router: Router) {}

  onLogin() {

    console.log('Login payload:', this.credentials);
    this.authService.signIn(this.credentials).subscribe({
      next: () => {
        console.log('Logged in!')
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        // Display error message to user
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error - please check your connection';
        } else {
          this.errorMessage = 'Login failed - please try again later';
        }
      }

    });
  }
}
