import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from "@core/auth/auth.service";
import {Observable, of} from "rxjs";

export const publicGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.getCurrentAuthToken()) {
    router.navigateByUrl('/');
    return of(false);
  }
  return of(true);

  // if(authService.getCurrentAuthToken()){
  //   const role = route.data["role"] as string;
  //   if(role){
  //     const match = authService.isMatch(role);
  //     if(match){
  //       return of(true);
  //     }else{
  //       router.navigate(['/forbidden']);
  //       return of(false);
  //     }
  //   }
  // }
  // router.navigate(['/login']);
  // return of(false);
};
