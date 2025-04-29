import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {Observable, of} from "rxjs";
import {AuthService} from "@core/auth/auth.service";




export const RoleGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(authService.getCurrentAuthToken()){
    const role = route.data["role"] as string;
    if(role){
      const match = authService.isMatch(role);
      if(match){
        return of(true);
      }else{
        router.navigate(['/forbidden']);
        return of(false);
      }
    }
  }
  router.navigate(['/login']);
  return of(false);
};





// export const roleGuard =
//   (allowed: string[]): CanActivateFn =>
//   () => {
//     const token = localStorage.getItem('access');
//     if (!token) return false;
//     const { role }: any = jwtDecode(token);
//     return allowed.includes(role);
//   };
