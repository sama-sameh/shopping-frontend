import {Component, inject,OnInit} from '@angular/core';
import {ProductService} from "../../Service/ProductService";
import {Product} from "../../Model/product.model";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import { DomSanitizer } from '@angular/platform-browser';
import {CartService} from "../../Service/CartService";
import {CartDTO} from "../../DTO/CartDTO";
import {AuthService} from "@core/auth/auth.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {


// In your component
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
  getImageUrl(path: string) {
    return this.sanitizer.bypassSecurityTrustUrl('assets/images/' + path);
  }
}
