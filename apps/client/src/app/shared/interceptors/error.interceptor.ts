import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../api/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {
      if (request.url.includes('api/login') || request.url.includes('api/logout') || request.url.includes('api/user/activation')) {
        return next.handle(request);
      }
      if ([401, 403].includes(error.status)) {
        this.authService.logout()
        next.handle(request);
        return throwError(() => console.log('ErrorInterceptor ', error ));
      }
      return next.handle(request);
    }));
  }
}

export const ErrorInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];
