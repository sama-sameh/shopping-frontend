import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { AuthRequest, AuthResponse } from './models';
import { tap } from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {RegisterDTO} from "../../DTO/RegisterDTO";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  readonly isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access'));
  private api = `${environment.apiUrl}/auth`;

  signIn(body: AuthRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    body = { ...body, password: CryptoJS.SHA256(body.password).toString() };

    return this.http.post<AuthResponse>(`${this.api}/login`, body, {headers})
      .pipe(
        tap(res => this.handleAuth(res))
      );
  }

  signUp(body: RegisterDTO): Observable<RegisterDTO> {
    body = { ...body, password: CryptoJS.SHA256(body.password).toString() };
    return this.http.post<RegisterDTO>(`${this.api}/register`, body);
  }

  public handleAuth(res: AuthResponse) {
    localStorage.setItem('access', res.token);
    localStorage.setItem('refresh', res.refreshToken);
    localStorage.setItem('role', res.role);
    this.isLoggedIn$.next(true);
    this.router.navigateByUrl('/');
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn$.next(false);
    location.reload(); // Refresh the page
    this.router.navigateByUrl('/');
  }

  // Additional helper method
  getCurrentAuthToken(): string | null {
    return localStorage.getItem('access');
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }
  refreshToken(refreshToken: string): Observable<AuthResponse> {
    console.log("refreshToken");

    return this.http.post<any>(`${this.api}/refresh`, {
      token: refreshToken
    }, {
      headers: { 'No-Auth': 'True' }
    });
  }
  isMatch(req_role: string): Boolean {
    if(this.getUserRole() ===req_role){
        return true;
    }
    return false;

  }
  getUserRole(){
    return localStorage.getItem('role');
  }

}
