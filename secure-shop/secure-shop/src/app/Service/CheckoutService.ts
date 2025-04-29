import {Injectable} from "@angular/core";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Product} from "../Model/product.model";
import {catchError, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = environment.apiUrl+'/user/orders';
  constructor(private http: HttpClient) {
  }
  placeOrder() {
    return this.http.get<Boolean>(`${this.apiUrl}/place`).pipe();
  }
}
