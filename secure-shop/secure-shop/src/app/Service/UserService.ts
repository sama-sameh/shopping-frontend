import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {RegisterDTO} from "../DTO/RegisterDTO";
import {Observable} from "rxjs";
import {AuthService} from "@core/auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,private authService: AuthService) {}
  addUser(user :RegisterDTO){
    this.authService.signUp(user).subscribe({
      next: () => {
        return true;
      },

      error: (err) => console.error('Sign failed:', err)
    });
  }

}
