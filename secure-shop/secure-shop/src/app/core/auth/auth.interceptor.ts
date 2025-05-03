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

  if (req.url.includes('/refresh')) {
    return next(req);

  }
  if (req.headers.get('No-Auth') === 'True') {
    return next(req);
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return authService.refreshToken(refreshToken).pipe(
          switchMap(response => {
            console.log("old token",{token:token,refreshToken:refreshToken});
            console.log("new token", response);
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
            console.log("refreshError", refreshError);
            authService.logout();
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


// import { inject } from '@angular/core';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { HttpClient, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import {AuthService} from "@core/auth/auth.service";
// import {AuthResponse} from "@core/auth/models";

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthService);
//   const http = inject(HttpClient);
//   const router = inject(Router);
//
//   const accessToken = authService.getCurrentAuthToken();
//
//   let authReq = req;
//   if (accessToken) {
//     authReq = req.clone({
//       setHeaders: { Authorization: `Bearer ${accessToken}` }
//     });
//   }
//
//   return next(authReq).pipe(
//     catchError(error => {
//       if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/refresh')) {
//         const refreshToken = authService.getRefreshToken();
//         if (refreshToken) {
//           return http.post<any>('http://localhost:8080/api/auth/refresh', {
//             refreshToken: refreshToken
//           }).pipe(
//             switchMap((response: AuthResponse) => {
//               const newResponse :AuthResponse = {
//                 'token': response.token,
//                 'refreshToken': response.refreshToken,
//                 'role': response.role,
//               }
//               authService.handleAuth(newResponse)
//               const newReq = req.clone({
//                 setHeaders: { Authorization: `Bearer ${response.token}` }
//               });
//               return next(newReq);
//             }),
//             catchError(err => {
//               authService.logout();
//               router.navigate(['/login']);
//               return throwError(() => err);
//             })
//           );
//         } else {
//           authService.logout();
//           router.navigate(['/login']);
//         }
//       }
//       return throwError(() => error);
//     })
//   );
// };
