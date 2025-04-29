import {DestroyRef, inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {environment} from "@environments/environment";
import {Product} from "../Model/product.model";
import {AuthService} from "@core/auth/auth.service";
import {RegisterDTO} from "../DTO/RegisterDTO";
import * as CryptoJS from "crypto-js";
import {CartDTO} from "../DTO/CartDTO";
import {CartItem} from "../Model/cart_items";
import {CartDetailDTO} from "../DTO/CartDetailDTO";
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl+'/user/cart';
  constructor(private http:HttpClient,private authService: AuthService) {
  }
  addToCart(product: CartDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, product);
  }
  getCart(): Observable<CartDetailDTO[]>{
    return this.http.get<CartDetailDTO[]>(`${this.apiUrl}/cartDetails`).pipe(
      catchError(error => {
        console.error('Error fetching Cart items', error);
        return of(); // Return an empty array in case of error
      })
    );
  }


  updateCartItem(productId: string, newQuantity: number) {

    return this.http.post<Boolean>(`${this.apiUrl}/updateCart`, {product_id:productId, quantity:newQuantity}).pipe();
  }

  removeCartItem(productId: string) {
    return this.http.get<Boolean>(`${this.apiUrl}/deleteItem/${productId}`).pipe(
      catchError(error => {
        console.error('Error removing Cart items', error);
        return of();
      })
    );

  }
}
