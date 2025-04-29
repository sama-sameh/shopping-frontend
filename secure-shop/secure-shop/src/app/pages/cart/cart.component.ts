import { Component,OnInit } from '@angular/core';
import {AuthService} from "@core/auth/auth.service";
import {Router, RouterLink} from "@angular/router";
import {Product} from "../../Model/product.model";
import {CartItem} from "../../Model/cart_items";
import {CartService} from "../../Service/CartService";
import {CartDetailDTO} from "../../DTO/CartDetailDTO";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css',

  ]
})
export class CartComponent {

  constructor(private authService: AuthService,private router: Router,private cartService:CartService) {}
  cartItems!:CartDetailDTO[];
  totalPrice !:number;
  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotalPrice();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });
  }
  updateQuantity(item: CartDetailDTO, change: number): void {
    const newQuantity = item.quantity + change;
    const unitPrice = item.price / item.quantity;

    if (newQuantity < 1) return;

    item.quantity = newQuantity;
    item.price = unitPrice * newQuantity;
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: (updatedCart) => {
        this.calculateTotalPrice();
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        item.quantity -= change;
      }
    });

  }
  removeItem(item: CartDetailDTO): void {
    this.cartService.removeCartItem(item.productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.productId !== item.productId);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      }
    });
  }
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price,
      0
    );

    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
