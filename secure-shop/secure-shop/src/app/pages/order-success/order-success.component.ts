import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {
  orderDetails: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.orderDetails = navigation?.extras.state?.['orderDetails'];
  }

  ngOnInit(): void {
    if (!this.orderDetails) {
      // Redirect if no order details (direct access)
      this.router.navigate(['/']);
    }
  }
}
