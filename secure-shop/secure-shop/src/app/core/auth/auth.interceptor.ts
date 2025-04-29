import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, of } from 'rxjs';
import {AuthService} from "@core/auth/auth.service";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  const http = inject(HttpClient);
  const router = inject(Router);
  const authService = inject(AuthService);

  // 🚨 Skip adding access token if this is a refresh token request
  if (req.url.includes('/refresh')) {
    return next(req);

  }
  if (req.headers.get('No-Auth') === 'True') {
    return next(req);
  }


  // Attach access token if available
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        // Token expired — try refresh
        return authService.refreshToken(refreshToken).pipe(
          switchMap(response => {
            // Save new tokens
            localStorage.setItem('access', response.token);
            localStorage.setItem('refresh', response.refreshToken);

            // Retry original request with new token
            const retryReq: HttpRequest<any> = authReq.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            // If refresh fails — clear session and redirect
            // authService.logout();
            return throwError(() => refreshError);
          })
        );
      } else if (error.status === 403) {
        router.navigate(['/forbidden']);
      }

      // If not 401 or no refresh token — propagate error
      return throwError(() => error);
    })
  );
};




// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access');
//   const refreshToken = localStorage.getItem('refresh');
//
//   const http = inject(HttpClient);
//   const router = inject(Router);
//   const authService = inject(AuthService);
//   // Attach token if available
//   const authReq = token
//     ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
//     : req;
//
//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401 && refreshToken) {
//         // Token expired — try refresh
//         return authService.refreshToken(refreshToken).pipe(
//           switchMap(response => {
//             // Save new tokens
//             localStorage.setItem('access', response.token);
//             localStorage.setItem('refresh', response.refreshToken);
//
//             // Retry original request with new token
//             const retryReq: HttpRequest<any> = authReq.clone({
//               setHeaders: {
//                 Authorization: `Bearer ${response.token}`
//               }
//             });
//             return next(retryReq);
//           }),
//           catchError(refreshError => {
//             // If refresh fails — clear session and redirect
//             authService.logout();
//             return throwError(() => refreshError);
//           })
//         );
//       }
//       else if (error.status === 403) {
//         router.navigate(['/forbidden']);
//       }
//       // If not 401 or no refresh token — propagate error
//       return throwError(() => error);
//     })
//   );
// };


// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, throwError } from 'rxjs';
// import { AuthService } from "@core/auth/auth.service";
//
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   if (req.headers.get('No-Auth') === 'True') {
//     return next(req);
//   }
//
//   const token = authService.getCurrentAuthToken();
//   if (token) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//
//     return next(authReq).pipe(
//       catchError((err) => {
//         console.log(err.status);
//         if (err.status === 401) {
//           router.navigate(['/login']);
//         } else if (err.status === 403) {
//           router.navigate(['/forbidden']);
//         }
//         return throwError(() => new Error("Something is wrong"));
//       })
//     );
//   }
//
//   return throwError(() => new Error("Something is wrong"));
// };
