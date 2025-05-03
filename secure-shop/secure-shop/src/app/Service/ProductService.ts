import {DestroyRef, inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {environment} from "@environments/environment";
import {Product} from "../Model/product.model";
import {CreditCard} from "../Model/CreditCard";
import {AuthService} from "@core/auth/auth.service";
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient,private authService: AuthService) {
  }
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/userhome/`).pipe(
      catchError(error => {
        console.error('Error fetching Products', error);
        return of(); // Return an empty array in case of error
      })
    );
  }
  getproductById(): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/home/`).pipe(
      catchError(error => {
        console.error('Error fetching Products', error);
        return of(); // Return an empty array in case of error
      })
    );
  }
  // addProduct(product: FormData): Observable<Product> {
  //   return this.http.post<any>('http://localhost:8080/api/admin/addProduct',product);
  // }
  addProduct(product: FormData): Observable<any> {
    const token = this.authService.getCurrentAuthToken();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post<any>('http://localhost:8080/api/admin/addProduct', product,{headers}).pipe();
  }

}
