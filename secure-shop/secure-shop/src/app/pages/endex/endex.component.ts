import {Component, inject} from '@angular/core';
import {CartService} from "../../Service/CartService";
import {AuthService} from "@core/auth/auth.service";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ProductService} from "../../Service/ProductService";
import {Product} from "../../Model/product.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-endex',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './endex.component.html',
  styleUrl: './endex.component.css'
})
export class EndexComponent {
  constructor(private cartService: CartService,private authService:AuthService,private router:Router,private sanitizer: DomSanitizer) {}


  productService = inject(ProductService);
  products!:Product[];
  ngOnInit(): void {

    this.productService.getAllProducts().subscribe({
      next:(data)=>{
        this.products = data;
        console.log(this.products);
      }
    })
  }


  addToCart(id: string): void {
    if (this.authService.isLoggedIn()) {

      this.cartService.addToCart({product_id: id, quantity: 1}).subscribe({
          next: (response) => {
            console.log('Success:', response); // "Item added to cart"
            // Handle UI update (e.g., refresh cart count)
          },
          error: (err) => {
            if (err.status === 200) {
              console.log('Product added successfully');
              // You might want to update your UI here anyway
            } else {
              console.error('Real error occurred', err);
            }
          }
        }
      );
    }
    else{
      this.router.navigate(['/login']);
    }
  }

}
