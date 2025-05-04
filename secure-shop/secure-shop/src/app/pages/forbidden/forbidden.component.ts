import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "@core/auth/auth.service";

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {
  constructor(private router: Router, private authService: AuthService) { }
  navigateToForbidden() {
    if (this.authService.getUserRole()==="USER") {
      return true;
    }
    return false;
  }
}
