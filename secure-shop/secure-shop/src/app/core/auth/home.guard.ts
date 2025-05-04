import {CanActivateFn, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "@core/auth/auth.service";

export const HomeGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(!authService.isLoggedIn()||authService.getUserRole()==="USER"){
    return of(true);
  }
  router.navigate(['/forbidden']);
  return of(false);
};

