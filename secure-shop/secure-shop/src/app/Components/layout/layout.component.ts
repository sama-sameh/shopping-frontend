import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {AuthService} from "@core/auth/auth.service";   // Import RouterOutlet for routing

@Component({
  selector: 'app-layout',
  standalone: true,  // Indicates that it's a standalone component
  imports: [RouterOutlet,RouterModule,CommonModule],  // Import RouterOutlet to handle routing
  templateUrl: './layout.component.html',  // Path to your component's HTML template
  styleUrls: ['./layout.component.css']  // Correct property name for styles
})
export class LayoutComponent {
  constructor(private authService: AuthService,private router: Router) {

  }


  checkForLogin(){
    return this.authService.isLoggedIn();
  }
  logOut(){
    this.authService.logout();
  }
  checkforRole(){
    const role =  this.authService.getUserRole();
    if (role=="USER")
      return true;
    else
      return false;
  }

}
