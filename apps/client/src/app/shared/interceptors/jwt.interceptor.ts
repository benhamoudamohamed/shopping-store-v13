import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../api/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token
    const isLoggedIn = this.authService.isAccessTokenExpired()
    if (isLoggedIn) request = request.clone({setHeaders: { Authorization: `Bearer ${token}`}});
    return next.handle(request);
  }
}

export const JwtInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
