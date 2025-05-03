import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "@core/auth/auth.service";
import {RegisterDTO} from "../../DTO/RegisterDTO";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData:RegisterDTO = {
    username:'',
    password:'',
    email:'',
    role:''
  };
  constructor(private authService: AuthService, private router: Router) {}
  onRegister() {
    console.log('Register payload:', this.registerData);
    this.registerData.role = "USER"
    this.authService.signUp(this.registerData).subscribe({
      next: () => {
        console.log('Signed in!');
        this.router.navigate(['/login']);
      },

      error: (err) => console.error('Sign failed:', err)
    });
  }
}
