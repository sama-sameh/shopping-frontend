import {Injectable} from "@angular/core";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {DashBoard} from "../DTO/DashBoard";
import {Order} from "../Model/orders";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl+'/admin';
  constructor(private http: HttpClient) {
  }
  getDashBoard (){
    return this.http.get<DashBoard>(`${this.apiUrl}/dashboard`).pipe();
  }
  getAllOrders(){
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe();
  }

}
