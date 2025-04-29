import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {ProductService} from "./Service/ProductService";
import {HttpClientModule} from "@angular/common/http";
import {CartComponent} from "@pages/cart/cart.component";
import {RegisterComponent} from "@pages/register/register.component";
import {LoginComponent} from "@pages/login/login.component";
import {AuthService} from "@core/auth/auth.service";
import {catchError, Observable, of} from "rxjs";  // Correct import for RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,CommonModule,HttpClientModule,CartComponent,RegisterComponent,LoginComponent],  // Import RouterOutlet to handle routing
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ProductService
  ],


})
export class AppComponent {
  title = 'secure-shop';

}
